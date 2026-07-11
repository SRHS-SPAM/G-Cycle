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


def test_claim_reward_updates_status_and_ledger(client, db_session):
    client.post("/api/v1/auth/register", json={"phone_number": "01077770001", "password": "password123"})
    headers = auth_header(client, "01077770001")
    store, menu = _seed_store_with_menu(db_session)

    client.post("/api/v1/orders", headers=headers, json={
        "store_id": store.id, "items": [{"menu_id": menu.id, "quantity": 1}],
    })
    reward = client.get("/api/v1/rewards/me", headers=headers).json()["data"][0]
    assert reward["status"] == "confirmed"

    claim_resp = client.post("/api/v1/rewards/claim", headers=headers, json={"reward_id": reward["id"]})
    assert claim_resp.status_code == 200
    assert claim_resp.json()["data"]["status"] == "claimed"

    txs = client.get("/api/v1/rewards/transactions", headers=headers).json()["data"]
    actions = [t["action"] for t in txs]
    assert "granted" in actions and "claimed" in actions


def test_cannot_claim_reward_twice(client, db_session):
    client.post("/api/v1/auth/register", json={"phone_number": "01077770002", "password": "password123"})
    headers = auth_header(client, "01077770002")
    store, menu = _seed_store_with_menu(db_session)
    client.post("/api/v1/orders", headers=headers, json={
        "store_id": store.id, "items": [{"menu_id": menu.id, "quantity": 1}],
    })
    reward_id = client.get("/api/v1/rewards/me", headers=headers).json()["data"][0]["id"]

    client.post("/api/v1/rewards/claim", headers=headers, json={"reward_id": reward_id})
    again = client.post("/api/v1/rewards/claim", headers=headers, json={"reward_id": reward_id})
    assert again.status_code == 409


def test_cannot_claim_others_reward(client, db_session):
    client.post("/api/v1/auth/register", json={"phone_number": "01077770003", "password": "password123"})
    client.post("/api/v1/auth/register", json={"phone_number": "01077770004", "password": "password123"})
    headers_a = auth_header(client, "01077770003")
    headers_b = auth_header(client, "01077770004")
    store, menu = _seed_store_with_menu(db_session)

    client.post("/api/v1/orders", headers=headers_a, json={
        "store_id": store.id, "items": [{"menu_id": menu.id, "quantity": 1}],
    })
    reward_id = client.get("/api/v1/rewards/me", headers=headers_a).json()["data"][0]["id"]

    resp = client.post("/api/v1/rewards/claim", headers=headers_b, json={"reward_id": reward_id})
    assert resp.status_code == 403
