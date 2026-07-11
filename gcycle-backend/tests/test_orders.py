from app.core.constants import UserRole
from app.models.menu import Menu
from app.models.store import Store
from tests.conftest import auth_header


def _seed_store_with_menu(db_session) -> tuple[Store, Menu]:
    store = Store(name="강남 제로웨이스트 카페", address="서울 강남구", lat=37.498, lng=127.027)
    db_session.add(store)
    db_session.commit()
    db_session.refresh(store)

    menu = Menu(store_id=store.id, name="아이스 아메리카노", price=4500, is_available=True)
    db_session.add(menu)
    db_session.commit()
    db_session.refresh(menu)
    return store, menu


def test_create_order_issues_container_and_reward(client, db_session):
    client.post("/api/v1/auth/register", json={"phone_number": "01012340000", "password": "password123"})
    headers = auth_header(client, "01012340000")

    store, menu = _seed_store_with_menu(db_session)

    resp = client.post("/api/v1/orders", headers=headers, json={
        "store_id": store.id,
        "items": [{"menu_id": menu.id, "quantity": 2, "uses_container": True}],
    })
    assert resp.status_code == 200
    body = resp.json()["data"]
    assert body["status"] == "confirmed"
    assert body["total_amount"] == 9000

    # Two containers should have been issued (quantity=2).
    containers_resp = client.get("/api/v1/containers/me", headers=headers)
    assert len(containers_resp.json()["data"]) == 2

    # An order-completion reward should have been granted.
    rewards_resp = client.get("/api/v1/rewards/me", headers=headers)
    reward_types = [r["reward_type"] for r in rewards_resp.json()["data"]]
    assert "order_bonus" in reward_types


def test_order_with_unavailable_menu_rejected(client, db_session):
    client.post("/api/v1/auth/register", json={"phone_number": "01012340001", "password": "password123"})
    headers = auth_header(client, "01012340001")

    store, menu = _seed_store_with_menu(db_session)
    menu.is_available = False
    db_session.commit()

    resp = client.post("/api/v1/orders", headers=headers, json={
        "store_id": store.id,
        "items": [{"menu_id": menu.id, "quantity": 1}],
    })
    assert resp.status_code == 422


def test_cannot_view_others_order(client, db_session):
    client.post("/api/v1/auth/register", json={"phone_number": "01012340002", "password": "password123"})
    client.post("/api/v1/auth/register", json={"phone_number": "01012340003", "password": "password123"})
    headers_a = auth_header(client, "01012340002")
    headers_b = auth_header(client, "01012340003")

    store, menu = _seed_store_with_menu(db_session)
    order_resp = client.post("/api/v1/orders", headers=headers_a, json={
        "store_id": store.id,
        "items": [{"menu_id": menu.id, "quantity": 1}],
    })
    order_id = order_resp.json()["data"]["id"]

    resp = client.get(f"/api/v1/orders/{order_id}", headers=headers_b)
    assert resp.status_code == 403


def test_invalid_order_status_transition_rejected(client, db_session):
    client.post("/api/v1/auth/register", json={"phone_number": "01012340004", "password": "password123"})
    headers = auth_header(client, "01012340004")
    store, menu = _seed_store_with_menu(db_session)

    order_resp = client.post("/api/v1/orders", headers=headers, json={
        "store_id": store.id,
        "items": [{"menu_id": menu.id, "quantity": 1}],
    })
    order_id = order_resp.json()["data"]["id"]

    # Order is already confirmed by creation; complete it once, then try again.
    ok = client.patch(f"/api/v1/orders/{order_id}/status", headers=headers, json={"status": "completed"})
    assert ok.status_code == 200

    again = client.patch(f"/api/v1/orders/{order_id}/status", headers=headers, json={"status": "completed"})
    assert again.status_code == 409
