import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.constants import UserRole
from app.core.security import hash_password
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.user import User

# In-memory SQLite is enough to exercise service/router logic in tests;
# real deployments run against PostgreSQL via docker-compose + Alembic.
TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


@pytest.fixture()
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client(db_session):
    def _override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture()
def make_user(db_session):
    def _make(phone_number: str, role: UserRole = UserRole.MEMBER, password: str = "password123") -> User:
        user = User(
            phone_number=phone_number,
            password_hash=hash_password(password),
            role=role,
            name="Test User",
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        return user
    return _make


def auth_header(client: "any", phone_number: str, password: str = "password123") -> dict:
    resp = client.post("/api/v1/auth/login", json={"phone_number": phone_number, "password": password})
    token = resp.json()["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}
