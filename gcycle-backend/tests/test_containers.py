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


def test_return_container_updates_saturation(client, db_session):
    client.post("/api/v1/auth/register", json={"phone_number": "01099990001", "password": "password123"})
    headers = auth_header(client, "01099990001")

    store, menu = _seed_store_with_menu(db_session)
    cp = _seed_collection_point(db_session, capacity=5)

    order_resp = client.post("/api/v1/orders", headers=headers, json={
        "store_id": store.id,
        "items": [{"menu_id": menu.id, "quantity": 1}],
    })
    assert order_resp.status_code == 200

    containers = client.get("/api/v1/containers/me", headers=headers).json()["data"]
    assert len(containers) == 1
    qr_value = containers[0]["qr_code_value"]

    scan_resp = client.post("/api/v1/containers/scan", headers=headers, json={
        "qr_code_value": qr_value,
        "collection_point_id": cp.id,
    })
    assert scan_resp.status_code == 200
    assert scan_resp.json()["data"]["status"] == "returned"

    cp_resp = client.get(f"/api/v1/collection-points/{cp.id}")
    cp_data = cp_resp.json()["data"]
    assert cp_data["current_count"] == 1
    assert cp_data["fill_rate"] == 0.2


def test_returning_already_returned_container_conflicts(client, db_session):
    client.post("/api/v1/auth/register", json={"phone_number": "01099990002", "password": "password123"})
    headers = auth_header(client, "01099990002")
    store, menu = _seed_store_with_menu(db_session)
    cp = _seed_collection_point(db_session)

    client.post("/api/v1/orders", headers=headers, json={
        "store_id": store.id, "items": [{"menu_id": menu.id, "quantity": 1}],
    })
    qr_value = client.get("/api/v1/containers/me", headers=headers).json()["data"][0]["qr_code_value"]

    first = client.post("/api/v1/containers/scan", headers=headers, json={
        "qr_code_value": qr_value, "collection_point_id": cp.id,
    })
    assert first.status_code == 200

    second = client.post("/api/v1/containers/scan", headers=headers, json={
        "qr_code_value": qr_value, "collection_point_id": cp.id,
    })
    assert second.status_code == 409


def test_return_to_full_collection_point_rejected(client, db_session):
    client.post("/api/v1/auth/register", json={"phone_number": "01099990003", "password": "password123"})
    headers = auth_header(client, "01099990003")
    store, menu = _seed_store_with_menu(db_session)
    cp = _seed_collection_point(db_session, capacity=1)
    cp.current_count = 1
    db_session.commit()

    client.post("/api/v1/orders", headers=headers, json={
        "store_id": store.id, "items": [{"menu_id": menu.id, "quantity": 1}],
    })
    qr_value = client.get("/api/v1/containers/me", headers=headers).json()["data"][0]["qr_code_value"]

    resp = client.post("/api/v1/containers/scan", headers=headers, json={
        "qr_code_value": qr_value, "collection_point_id": cp.id,
    })
    assert resp.status_code == 409
