# Gas Blender App — 아키텍처 문서

## 1. 프로젝트 개요

스쿠버 테크니컬 다이빙 전용 가스 블렌딩 & 감압 계획 앱.

| 항목 | 내용 |
|---|---|
| 플랫폼 | iOS / Android |
| 프레임워크 | React Native + Expo SDK 52 |
| 언어 | TypeScript |
| 라우팅 | Expo Router v3 (file-based) |
| 상태관리 | Zustand |
| UI | NativeWind (Tailwind CSS for RN) + react-native-paper |
| 테스트 | Jest + React Native Testing Library |

---

## 2. 핵심 기능 모듈

### 2-1. Gas Blending (부분압 블렌딩)
- **OC (Open Circuit)**: Nitrox / Trimix / Heliox 블렌딩 계산
  - Top-up 방식: 현재 잔압 → 목표 혼합기체 채우기
  - Full fill 방식: 빈 탱크부터 순서대로 채우기
- **CCR (Closed Circuit Rebreather)**: Diluent + O₂ setpoint 계산
- 부분압 공식: `pp = fraction × P_abs`, `P_abs = depth/10 + 1` (bar)

### 2-2. MOD (Maximum Operating Depth)
- 공식: `MOD(m) = (ppO₂_max / fO₂ - 1) × 10`
- 기본 ppO₂ 한계: 작업 1.4 bar, 감압 1.6 bar
- 사용자 설정 가능

### 2-3. EAD / END
- **EAD** (Equivalent Air Depth): `EAD = (fN₂ × (depth+10) / 0.79) - 10`
- **END** (Equivalent Narcotic Depth): 헬륨 제외 나르코시스 깊이 환산

### 2-4. Best Mix
- 목표 깊이 기준 최적 O₂ 비율: `fO₂ = ppO₂_max / P_abs`

### 2-5. Decompression Planning (감압 계획)
- 알고리즘: **Bühlmann ZHL-16C** (16 compartment)
- GF (Gradient Factor) 지원: GF_lo / GF_hi
- 출력: 정지 깊이 / 정지 시간 / 총 감압 시간 / TTS (Time To Surface)
- Multi-gas 지원 (bottom mix → deco mix 전환)

---

## 3. 프로젝트 디렉터리 구조

```
gas-blender/
├── app/                          # Expo Router 파일 기반 라우팅
│   ├── _layout.tsx               # Root layout (tab navigator)
│   ├── index.tsx                 # 홈 대시보드
│   ├── (tabs)/
│   │   ├── blending/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx         # 블렌딩 메인 (OC 기본)
│   │   │   ├── oc.tsx            # OC 블렌딩
│   │   │   └── ccr.tsx           # CCR 블렌딩
│   │   ├── calculator/
│   │   │   ├── index.tsx         # MOD / EAD / END / Best Mix
│   │   │   └── gas-table.tsx     # 혼합기체 빠른 참조표
│   │   ├── deco/
│   │   │   ├── index.tsx         # 감압 계획 입력
│   │   │   └── result.tsx        # 감압 테이블 결과
│   │   └── settings/
│   │       └── index.tsx         # 단위·ppO₂ 한계·GF 설정
├── src/
│   ├── lib/                      # 순수 계산 로직 (UI 무관)
│   │   ├── gas/
│   │   │   ├── constants.ts      # 기체 물성 상수
│   │   │   ├── partial-pressure.ts
│   │   │   ├── mod.ts
│   │   │   ├── ead-end.ts
│   │   │   └── best-mix.ts
│   │   ├── blending/
│   │   │   ├── oc-blending.ts    # OC 탱크 블렌딩 계산
│   │   │   └── ccr-blending.ts   # CCR 블렌딩 계산
│   │   └── deco/
│   │       ├── buhlmann.ts       # Bühlmann ZHL-16C 구현
│   │       ├── compartments.ts   # 16 compartment 계수
│   │       └── gradient-factor.ts
│   ├── store/
│   │   ├── blending.store.ts
│   │   ├── deco.store.ts
│   │   └── settings.store.ts
│   ├── hooks/
│   │   ├── useBlending.ts
│   │   ├── useDeco.ts
│   │   └── useSettings.ts
│   ├── components/
│   │   ├── ui/                   # 범용 UI 컴포넌트
│   │   │   ├── NumericInput.tsx
│   │   │   ├── GasSlider.tsx
│   │   │   ├── ResultCard.tsx
│   │   │   └── InfoBadge.tsx
│   │   ├── blending/
│   │   │   ├── TankForm.tsx
│   │   │   └── BlendResult.tsx
│   │   └── deco/
│   │       ├── DiveProfile.tsx
│   │       └── DecoTable.tsx
│   └── types/
│       ├── gas.types.ts
│       ├── blending.types.ts
│       └── deco.types.ts
├── constants/
│   └── theme.ts                  # 색상·폰트·간격
├── assets/
│   └── images/
├── __tests__/
│   └── lib/                      # 계산 로직 단위 테스트
├── app.json
├── package.json
├── tsconfig.json
└── ARCHITECTURE.md
```

---

## 4. 데이터 흐름

```
사용자 입력 (Screen)
    ↓
Hook (useBlending / useDeco)
    ↓
Store (Zustand) — 영속성: AsyncStorage
    ↓
lib/ 순수 계산 함수
    ↓
결과 → Screen 렌더링
```

---

## 5. 핵심 계산 공식 요약

### 부분압 블렌딩 (OC Top-up)
```
P_O2_add = fO2_target × P_final - fO2_current × P_current
P_He_add = fHe_target × P_final - fHe_current × P_current
P_air_add = P_final - P_current - P_O2_add - P_He_add
```

### MOD
```
MOD (m) = (ppO2_limit / fO2 - 1) × 10
```

### Bühlmann 조직 포화도 업데이트
```
P_t(t) = P_t(0) + (P_alv - P_t(0)) × (1 - 2^(-t/ht))
```
- `P_alv`: 폐포 불활성 기체 분압
- `ht`: 조직 반감기

### GF 기반 허용 한계
```
M_value(GF) = M0 + GF × (M_slope - 1) × P_amb
Ceiling = (P_t - GF_lo × b) / (GF_lo / a - 1)
```

---

## 6. 개발 우선순위 (Phase)

| Phase | 내용 |
|---|---|
| 1 | 프로젝트 초기화, 탭 네비게이션, 설정 화면 |
| 2 | Gas lib 구현 (MOD / EAD / Best Mix) + 단위 테스트 |
| 3 | OC 블렌딩 계산 + UI |
| 4 | CCR 블렌딩 계산 + UI |
| 5 | Bühlmann ZHL-16C 감압 계산 엔진 구현 |
| 6 | 감압 계획 UI (프로파일 입력 → 결과 테이블) |
| 7 | 다국어 (한/영), 다크모드, 배포 |

---

## 7. 주요 의존성

```json
{
  "expo": "~52.x",
  "expo-router": "~4.x",
  "react-native": "0.76.x",
  "zustand": "^5.x",
  "nativewind": "^4.x",
  "react-native-paper": "^5.x",
  "@react-native-async-storage/async-storage": "^2.x",
  "react-hook-form": "^7.x",
  "zod": "^3.x"
}
```

---

## 8. 안전 고려사항

- 계산 결과는 참고용이며 실제 다이빙 계획은 자격증 취득 전문가와 함께 수행해야 함
- 앱 내 면책 조항(Disclaimer) 표시 필수
- 계산 라이브러리는 100% 단위 테스트 커버리지 목표
