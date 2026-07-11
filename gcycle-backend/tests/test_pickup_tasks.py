from app.core.constants import UserRole
from app.models.collection_point import CollectionPoint
from app.models.menu import Menu
from app.models.store import Store
from tests.conftest import auth_header


def _seed_store_with_menu(db_session):
    store = Store(name="테스트 매장", address="서울", lat=37.5, lng=127.0)
    db_session.add(store)
    db_session.commit()
    db_session.refresh(store)
    menu = Menu(store_id=store.id, name="음료", price=5000, is_available=True)
    db_session.add(menu)
    db_session.commit()
    db_session.refresh(menu)
    return store, menu


def _seed_collection_point(db_session, capacity: int = 5) -> CollectionPoint:
    cp = CollectionPoint(name="강남역 수거함", address="서울 강남구", lat=37.498, lng=127.028, capacity=capacity)
    db_session.add(cp)
    db_session.commit()
    db_session.refresh(cp)
    return cp


def _return_one_container(client, headers, db_session, cp) -> None:
    store, menu = _seed_store_with_menu(db_session)
    client.post("/api/v1/orders", headers=headers, json={
        "store_id": store.id, "items": [{"menu_id": menu.id, "quantity": 1}],
    })
    qr_value = client.get("/api/v1/containers/me", headers=headers).json()["data"][-1]["qr_code_value"]
    client.post("/api/v1/containers/scan", headers=headers, json={
        "qr_code_value": qr_value, "collection_point_id": cp.id,
    })


def test_full_pickup_flow_and_incentive_payout(client, db_session, make_user):
    # Member returns a container, admin opens a pickup task, rider accepts and completes it.
    client.post("/api/v1/auth/register", json={"phone_number": "01088880001", "password": "password123"})
    member_headers = auth_header(client, "01088880001")

    make_user("01088880002", role=UserRole.ADMIN)
    admin_headers = auth_header(client, "01088880002")

    make_user("01088880003", role=UserRole.RIDER)
    rider_headers = auth_header(client, "01088880003")

    cp = _seed_collection_point(db_session, capacity=5)
    _return_one_container(client, member_headers, db_session, cp)

    create_resp = client.post("/api/v1/pickup-tasks", headers=admin_headers, json={
        "collection_point_id": cp.id, "incentive_amount": 300,
    })
    assert create_resp.status_code == 200
    task_id = create_resp.json()["data"]["id"]

    accept_resp = client.patch(f"/api/v1/pickup-tasks/{task_id}/accept", headers=rider_headers)
    assert accept_resp.status_code == 200
    assert accept_resp.json()["data"]["status"] == "accepted"

    complete_resp = client.patch(
        f"/api/v1/pickup-tasks/{task_id}/complete", headers=rider_headers, json={"collected_count": 1}
    )
    assert complete_resp.status_code == 200
    assert complete_resp.json()["data"]["status"] == "completed"

    cp_after = client.get(f"/api/v1/collection-points/{cp.id}").json()["data"]
    assert cp_after["current_count"] == 0
    assert cp_after["fill_rate"] == 0.0

    rider_rewards = client.get("/api/v1/rewards/me", headers=rider_headers).json()["data"]
    assert any(r["reward_type"] == "pickup_incentive" and r["amount"] == 300 for r in rider_rewards)


def test_accepting_already_accepted_task_conflicts(client, db_session, make_user):
    make_user("01088880004", role=UserRole.ADMIN)
    admin_headers = auth_header(client, "01088880004")
    make_user("01088880005", role=UserRole.RIDER)
    rider_a = auth_header(client, "01088880005")
    make_user("01088880006", role=UserRole.RIDER)
    rider_b = auth_header(client, "01088880006")

    cp = _seed_collection_point(db_session)
    task_id = client.post("/api/v1/pickup-tasks", headers=admin_headers, json={
        "collection_point_id": cp.id, "incentive_amount": 100,
    }).json()["data"]["id"]

    first = client.patch(f"/api/v1/pickup-tasks/{task_id}/accept", headers=rider_a)
    assert first.status_code == 200

    second = client.patch(f"/api/v1/pickup-tasks/{task_id}/accept", headers=rider_b)
    assert second.status_code == 409


def test_non_rider_cannot_access_pickup_tasks(client, make_user):
    client.post("/api/v1/auth/register", json={"phone_number": "01088880007", "password": "password123"})
    member_headers = auth_header(client, "01088880007")

    resp = client.get("/api/v1/pickup-tasks", headers=member_headers)
    assert resp.status_code == 403
