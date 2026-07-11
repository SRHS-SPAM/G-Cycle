# G-Cycle (지사이클) — Frontend

강남구 다회용기 순환 플랫폼의 React Native(Expo) 프론트엔드 스캐폴드입니다. 백엔드 없이도 화면 구조, 내비게이션, 상태관리, 타입, API 연동 레이어까지 전체 골격이 잡혀 있어 화면 단위로 바로 살을 붙일 수 있습니다.

## 실행 방법

```bash
npm install
npm run start   # Expo 개발 서버
npm run ios     # iOS 시뮬레이터
npm run android # Android 에뮬레이터
npm run typecheck
```

백엔드가 아직 없으므로 `.env`에 `EXPO_PUBLIC_API_BASE_URL`을 목 서버 주소로 지정하거나, `src/constants/config.ts`의 기본값을 사용하세요. React Query 훅들은 아직 실제 API가 없는 상태이므로 화면을 확인하려면 목 서버(MSW, json-server 등)를 붙이는 걸 권장합니다.

## 구조

```
src/
├─ app/            # 내비게이션, 프로바이더, App.tsx
├─ components/     # 공용 컴포넌트 (common/buttons/feedback/cards/map/qr)
├─ features/       # 화면 + 화면 전용 컴포넌트 (auth/home/store/order/return/rider/reward/mypage/storeOwner/admin)
├─ api/            # 도메인별 axios 래퍼
├─ store/          # zustand 전역 상태 (auth/ui/order/rider)
├─ hooks/           # useLocation + React Query 훅 (hooks/queries)
├─ types/          # UserRole, Store, Order, CollectionPoint, PickupTask, Reward, ApiResponse<T> 등
├─ theme/          # colors, typography, spacing
└─ constants/      # API_BASE_URL, 강남 기본 좌표 등
```

## 역할별 진입점

`RootNavigator`가 `authStore.role`을 보고 트리 전체를 분기합니다.

- 비로그인 → `AuthNavigator` (Onboarding → RoleSelect → GuestEntry/Login/SignUp)
- 게스트/회원 → `MainTabNavigator` (Home / Scan / Map / Reward / My, 5탭 고정)
- RIDER → `RiderNavigator`
- STORE_OWNER → `StoreOwnerNavigator`
- ADMIN → `AdminNavigator`

## 다음 단계

1. 백엔드 `/api/v1` 스펙 확정되는 대로 `src/api/*.ts`의 엔드포인트/응답 타입을 실제 스펙에 맞춰 조정.
2. 화면별 실제 카피/디자인 다듬기 (지금은 기능이 동작하는 최소 UI 상태).
3. React Query 훅에 낙관적 업데이트, 에러 재시도 정책 등 세부 튜닝.
4. 라이더 지도 클러스터링, 실시간 포화도 업데이트(WebSocket 등) 붙이기.
5. 게스트 → 회원 전환 유도 로직(리워드 화면 upsell) 실제 문구/트리거 다듬기.
