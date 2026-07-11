from tests.conftest import auth_header


def test_register_and_login(client):
    resp = client.post("/api/v1/auth/register", json={
        "phone_number": "01011112222",
        "password": "password123",
        "name": "Hong Gildong",
    })
    assert resp.status_code == 200
    assert resp.json()["success"] is True

    resp = client.post("/api/v1/auth/login", json={
        "phone_number": "01011112222",
        "password": "password123",
    })
    assert resp.status_code == 200
    body = resp.json()
    assert body["data"]["access_token"]
    assert body["data"]["refresh_token"]


def test_login_wrong_password_rejected(client):
    client.post("/api/v1/auth/register", json={
        "phone_number": "01033334444",
        "password": "password123",
    })
    resp = client.post("/api/v1/auth/login", json={
        "phone_number": "01033334444",
        "password": "wrong-password",
    })
    assert resp.status_code == 401
    assert resp.json()["success"] is False
    assert resp.json()["error"]["code"] == "UNAUTHORIZED"


def test_duplicate_registration_rejected(client):
    payload = {"phone_number": "01055556666", "password": "password123"}
    client.post("/api/v1/auth/register", json=payload)
    resp = client.post("/api/v1/auth/register", json=payload)
    assert resp.status_code == 409


def test_guest_session_issues_token(client):
    resp = client.post("/api/v1/auth/guest", json={"phone_number": "01099998888"})
    assert resp.status_code == 200
    assert resp.json()["data"]["access_token"]


def test_me_requires_auth(client):
    resp = client.get("/api/v1/auth/me")
    assert resp.status_code == 401

    client.post("/api/v1/auth/register", json={"phone_number": "01077778888", "password": "password123"})
    headers = auth_header(client, "01077778888")
    resp = client.get("/api/v1/auth/me", headers=headers)
    assert resp.status_code == 200
    assert resp.json()["data"]["phone_number"] == "01077778888"
