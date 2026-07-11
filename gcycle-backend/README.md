# G-Cycle Backend

강남구 다회용기(리유저블 컨테이너) 순환 플랫폼을 위한 운영용 API 서버.
QR 주문 → 용기 발급 → 반납 → 수거 → 리워드 지급까지, 전체 흐름을 이벤트 기반으로 추적합니다.

## 기술 스택
- FastAPI + Python 3.12
- PostgreSQL 16 + SQLAlchemy 2.0 (ORM) + Alembic (migration)
- JWT 인증 (python-jose) + bcrypt 해시
- Redis (선택, 캐시/큐 확장용)
- Docker / Docker Compose
- pytest (in-memory SQLite로 서비스/라우터 통합 테스트)

## 빠른 시작 (Docker)

```bash
cp .env.example .env
# .env의 SECRET_KEY는 반드시 실제 배포 전에 랜덤 값으로 교체하세요.

docker compose up --build
# 개발 중 코드 변경을 바로 반영하려면:
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

서버가 뜨면:
- API: http://localhost:8000/api/v1
- Swagger 문서: http://localhost:8000/docs
- Health check: http://localhost:8000/health

## 로컬 개발 (Docker 없이)

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# PostgreSQL이 로컬에 없다면 .env의 DATABASE_URL을 sqlite:///./dev.db 로 바꿔도
# 개발 중에는 동작합니다 (SQLAlchemy가 자동으로 방언을 전환).
cp .env.example .env

alembic upgrade head   # 또는 python -c "from app.db.init_db import init_db; init_db()"
uvicorn app.main:app --reload
```

## 첫 마이그레이션 생성

모델을 추가/수정한 뒤:

```bash
alembic revision --autogenerate -m "add xxx table"
alembic upgrade head
```

## 테스트

```bash
pytest -v
```

18개의 통합 테스트가 in-memory SQLite 위에서 회원가입/로그인부터
주문 → 용기 발급 → QR 반납 → 수거함 포화도 갱신 → 라이더 수거 완료 →
리워드 지급/클레임까지 전체 흐름과 권한/상태전이 예외 케이스를 검증합니다.

## 프로젝트 구조

```
app/
├─ main.py                 # FastAPI 앱, 전역 예외 핸들러, 라우터 등록
├─ core/                   # 설정, 보안(JWT/bcrypt), 공통 응답, 예외, 로깅, 상수(Enum)
├─ db/                     # SQLAlchemy 세션/베이스, 초기화 스크립트
├─ models/                 # ORM 모델 (users, stores, orders, containers, ...)
├─ schemas/                # Pydantic 요청/응답 스키마
├─ repositories/           # DB 접근 계층 (모델별 CRUD)
├─ services/                # 비즈니스 로직 (주문/컨테이너/수거/리워드/지도)
├─ api/v1/
│  ├─ deps.py              # 인증(JWT 디코딩) + 역할 기반 접근 제어 의존성
│  └─ routers/             # 엔드포인트 (auth, stores, orders, containers, ...)
└─ utils/                  # QR 생성, 거리 계산(haversine), 시간/검증 유틸

tests/                     # pytest 통합 테스트
alembic/                   # DB 마이그레이션
```

## 핵심 설계 원칙

- **이벤트 기반 추적**: 컨테이너는 단순 상태 컬럼이 아니라 `container_events`
  append-only 로그로 이력을 남깁니다 (발급→반납→수거→세척).
- **레이어 분리**: 라우터는 요청/응답만 다루고, 비즈니스 로직은 `services/`,
  DB 쿼리는 `repositories/`에 위치합니다.
- **일관된 응답 포맷**: 모든 API는 `{success, message, data, error, meta}` 형태로
  응답하며, 커스텀 예외(`AppException` 계열)가 전역 핸들러에서 이 포맷으로 변환됩니다.
- **역할 기반 접근 제어**: `guest / member / store_owner / rider / admin` 5가지
  역할을 JWT 클레임 + `api/v1/deps.py`의 의존성으로 검사합니다.
- **운영 로그**: 로그인, 주문 생성, 용기 발급/반납/수거, 리워드 지급 등 주요
  이벤트는 `gcycle.audit` 로거로 기록됩니다 (`audit_logs` 테이블과는 별도로,
  상세 감사이력을 DB에 남기고 싶다면 `models/audit_log.py`를 서비스 계층에서
  호출하도록 확장하세요).

## 다음 단계로 고려할 것들

- `AuditLog` 모델은 정의만 되어 있고 서비스 계층에서 실제로 기록하지는 않습니다.
  운영 감사가 중요하다면 각 서비스의 상태 변경 지점에 `audit_logs` insert를 추가하세요.
- Redis는 docker-compose에 포함되어 있지만 아직 캐싱/큐 로직에는 연결되어 있지
  않습니다 (수거 작업 큐, 알림 발송 등에 활용 가능).
- Refresh token은 stateless JWT라 서버 측 강제 만료(로그아웃 시 즉시 무효화)가
  안 됩니다. 필요하면 Redis 기반 토큰 denylist를 추가하세요.
- `notifications` 테이블은 모델만 있고 아직 발송 로직/엔드포인트가 없습니다.
