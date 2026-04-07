# Gas Blender App — 아키텍처 문서

## 1. 프로젝트 개요

스쿠버 테크니컬 다이빙 전용 가스 블렌딩 & 감압 계획 앱.

| 항목 | 내용 |
|---|---|
| 플랫폼 | iOS / Android / PWA (Vercel) |
| 프레임워크 | React Native 0.81 + Expo SDK 54 |
| 언어 | TypeScript 5.9 |
| 라우팅 | Expo Router v6 (file-based tabs) |
| 상태관리 | Zustand v5 + AsyncStorage persist |
| 테스트 | Jest 30 + ts-jest |
| 배포 | EAS Build (iOS/Android) · Vercel (PWA) |

---

## 2. 탭 구조 (6개)

| 탭 | 파일 | 내용 |
|---|---|---|
| 홈 | `app/index.tsx` | 기능 대시보드 카드 |
| 블렌딩 | `app/blending.tsx` | OC / CCR 탭 전환 블렌딩 계산 |
| 가스 계획 | `app/gas-plan.tsx` | SAC Rate · 가스 사용시간 · 실린더별 계획 |
| 감압 계획 | `app/deco.tsx` | Bühlmann ZHL-16C + GF 감압 계획 |
| 기체 분석 | `app/calculator.tsx` | MOD / Best Mix / EAD / END |
| 설정 | `app/settings.tsx` | ppO₂ · GF · 단위 · 속도 · 언어 · 테마 |

---

## 3. 디렉터리 구조

```
gas-blender/
├── app/                          # Expo Router 파일 기반 라우팅
│   ├── _layout.tsx               # 루트 레이아웃 (탭 네비게이터)
│   ├── +html.tsx                 # PWA meta 태그 (viewport-fit, manifest)
│   ├── index.tsx                 # 홈 대시보드
│   ├── blending.tsx              # 블렌딩 (OC / CCR 탭)
│   ├── calculator.tsx            # 기체 분석 (MOD / EAD / END)
│   ├── gas-plan.tsx              # 가스 계획 (SAC / 사용시간 / 실린더 계획)
│   ├── deco.tsx                  # 감압 계획
│   └── settings.tsx              # 앱 설정
├── src/
│   ├── lib/                      # 순수 계산 로직 (UI 무관, 단위 테스트 대상)
│   │   ├── gas/
│   │   │   ├── constants.ts      # 표준 상수 (surface=1 bar, AIR_N2=0.79)
│   │   │   ├── partial-pressure.ts
│   │   │   ├── mod.ts            # MOD, Best Mix
│   │   │   ├── ead-end.ts        # EAD, END
│   │   │   └── sac-rate.ts       # SAC Rate, Gas Endurance, RMV
│   │   ├── blending/
│   │   │   ├── oc-blending.ts    # OC 부분압 블렌딩 (공기 탑업 O₂ 보정)
│   │   │   └── ccr-blending.ts   # CCR Diluent + setpoint 계산
│   │   ├── deco/
│   │   │   ├── buhlmann.ts       # Bühlmann ZHL-16C (Schreiner 방정식)
│   │   │   ├── compartments.ts   # 16 compartment 계수 (ZHL-16C)
│   │   │   ├── deco-planner.ts   # 감압 오케스트레이터 (multi-gas, CNS/OTU, ICD, 기체별 소비량)
│   │   │   ├── gradient-factor.ts # GF 보간 + 3m 정지 올림
│   │   │   └── oxygen-toxicity.ts # CNS% / OTU (NOAA 표 + Repex 공식)
│   │   └── utils/
│   │       └── ranges.ts         # buildRange(min, max, step) 유틸
│   ├── components/
│   │   ├── ui/                   # 범용 UI 컴포넌트
│   │   │   ├── DrumRollPicker.tsx # 드럼롤 스크롤 피커 (PanResponder)
│   │   │   ├── GasSlider.tsx     # −/입력/+ 버튼 + 드래그 슬라이더 (0~1 분율)
│   │   │   ├── StepInput.tsx     # −/입력/+ 버튼 + 드래그 슬라이더 (범용 숫자)
│   │   │   ├── ResultCard.tsx    # 계산 결과 카드
│   │   │   ├── SectionHeader.tsx # 섹션 제목 + 부제목
│   │   │   ├── NumericInput.tsx  # 단순 숫자 텍스트 입력
│   │   │   ├── InfoModal.tsx     # 탭별 알고리즘/공식 설명 모달 (헤더 ⓘ 버튼)
│   │   │   └── DisclaimerModal.tsx # 첫 실행 면책 조항 모달
│   │   ├── blending/
│   │   │   ├── TankForm.tsx      # 블렌딩 실린더 입력 폼
│   │   │   └── BlendResult.tsx   # 블렌딩 결과 (주입 순서 · 검증)
│   │   └── deco/
│   │       ├── DecoTable.tsx     # 감압 정지 테이블
│   │       └── DecoSummary.tsx   # TTS / 총감압 / CNS% / OTU 요약 카드
│   ├── context/
│   │   └── ThemeContext.tsx      # 라이트/다크/시스템 테마 컨텍스트
│   ├── i18n/
│   │   ├── index.ts              # useTranslation hook, t(key, params?) 함수
│   │   └── locales/
│   │       ├── ko.ts             # 한국어 번역
│   │       └── en.ts             # 영어 번역
│   ├── store/
│   │   ├── settings.store.ts     # ppO₂·GF·단위·속도·공기 조성 (AsyncStorage 영속)
│   │   └── app.store.ts          # 언어·테마·면책조항 동의 (AsyncStorage 영속)
│   └── types/
│       ├── gas.types.ts          # GasMix, Tank, DepthUnit, PressureUnit
│       ├── blending.types.ts     # OCBlendInput/Result, CCRBlendInput/Result
│       └── deco.types.ts         # DecoInput, DecoResult, DecoStop, GasConsumption, IcdWarning
├── public/                       # PWA 에셋
│   ├── manifest.json
│   └── icon-*.png
├── assets/                       # 앱 아이콘·스플래시
├── __tests__/                    # 단위 테스트 (Jest)
├── reference/
│   └── decoplanner-offline.html  # GUE Decoplanner 참고용 오프라인 사본
├── docs/
│   └── GUE_DIFF.md               # GUE Decoplanner vs 현 프로젝트 기능 비교 및 로드맵
├── vercel.json                   # Vercel PWA 배포 설정
├── app.json                      # Expo 앱 설정 (bundleId, package 등)
├── eas.json                      # EAS Build 설정 (development/preview/production)
├── ARCHITECTURE.md
└── CLAUDE.md
```

---

## 4. 데이터 흐름

```
사용자 입력 (Screen / Component)
    ↓
로컬 useState (화면 단위 임시 상태)
    ↓
lib/ 순수 계산 함수 (useMemo로 실시간 계산)
    ↓
결과 렌더링 (ResultCard / DecoTable / DecoSummary)

설정값은 Zustand store → AsyncStorage 영속
```

---

## 5. 핵심 계산 공식

### 부분압 블렌딩 (OC Top-up)
```
P_He_add  = fHe_target × P_final − fHe_current × P_current
P_O2_add  = fO2_target × P_final − fO2_current × P_current − airO2 × P_air_base
P_air_add = P_final − P_current − P_He_add − P_O2_add
```

### MOD
```
MOD (m) = (ppO2_limit / fO2 − 1) × 10
```

### EAD / END
```
EAD = (fN2 / fN2_air) × (depth + 10) − 10
END = (1 − fHe) × (depth + 10) − 10
```

### SAC Rate / RMV / Gas Endurance
```
SAC (L/min) = pressureUsed × tankVolume / ((avgDepth/10 + 1) × diveTime)
RMV (L/min) = SAC × (depth/10 + 1)   ← 해당 수심 실제 분당 호흡량
usableGas   = (currentPressure − reservePressure) × tankVolume
endurance   = usableGas / (SAC × (depth/10 + 1))
```

### Bühlmann ZHL-16C (Schreiner 방정식)
```
P_t(t) = P_alv + (P_t0 − P_alv) × e^(−λ×t)
λ = ln2 / half_time
P_alv = (P_amb − 0.0627) × fGas
```

### GF 기반 허용 상한
```
Ceiling = (P_t − GF_lo × b) / (GF_lo / a − 1)
GF 보간: GF(depth) = GF_lo + (GF_hi − GF_lo) × (firstStop − depth) / firstStop
```

### 감압 계획 고급 기능
- **마지막 정지 수심**: 기본 6m (GUE 표준), 사용자 설정 가능 (3m/6m/9m)
- **ICD 경고**: 가스 전환 시 신규 기체의 fN₂ > 이전 기체 fN₂ + 0.005 이면 경고 (역방향 N₂ 증가 = 버블 리스크)
- **기체별 소비량**: `gasUsed = RMV × ATA × stopTime`, 기체 레이블 기준으로 집계 후 표시

### CCR Diluent 블렌딩
```
ppO₂_at_depth  = fO₂_dil × ATA
maxSetpointDepth = (setpoint / fO₂_dil − 1) × 10  [m]
```

---

## 6. UI 컴포넌트 설계 원칙

- **DrumRollPicker**: PanResponder 드래그 + 관성 스크롤. capture-phase 핸들러로 부모 ScrollView 터치 충돌 방지.
- **GasSlider**: 0~1 분율 전용. −/입력/+ 버튼 + 수평 PanResponder 슬라이더.
- **StepInput**: 범용 숫자(정수·소수). GasSlider와 동일 패턴, min/max/step/unit 프롭.
- **InfoModal**: 각 탭 헤더 ⓘ 버튼 → 해당 탭 알고리즘/공식 설명 모달. `useNavigation + useLayoutEffect`로 헤더 우측 버튼 주입.
- 모든 색상은 `useAppTheme()` 훅으로 주입 — 하드코딩된 색상 없음 (accent 계열 예외).

---

## 7. i18n

- `src/i18n/index.ts`: `useTranslation()` 훅 → `t(key, params?)` 반환.
- `{placeholder}` 치환 지원: `t('key', { count: 3 })` → `"3개"`.
- 언어 설정은 `app.store.ts`에 저장, 앱 재시작 없이 즉시 적용.
- 기술 고유명사(EAN, Trimix, Air, SAC, GF, OTU, CNS, ppO₂ 등)는 양 언어 동일 표기.
- `TranslationKey = keyof typeof ko` — `en.ts`는 `ko.ts`와 동일 키 세트를 유지해야 함.

---

## 8. 배포

| 채널 | 방법 | 대상 |
|---|---|---|
| PWA | Vercel (GitHub 연동 자동 배포) | 브라우저 설치 (iOS Safari / Android Chrome) |
| Android | EAS Build → APK/AAB | 사이드로드 또는 Google Play |
| iOS | EAS Build → IPA | TestFlight 또는 App Store |

---

## 9. 테스트

- 위치: `__tests__/`
- 대상: `src/lib/` 순수 계산 함수 전체 (39개 테스트)
- 실행: `npm test`
- UI 컴포넌트 테스트는 현재 미포함

| 테스트 파일 | 대상 |
|---|---|
| `__tests__/lib/mod.test.ts` | MOD, Best Mix |
| `__tests__/lib/ead-end.test.ts` | EAD, END |
| `__tests__/lib/partial-pressure.test.ts` | 부분압 변환 |
| `__tests__/lib/oc-blending.test.ts` | OC 블렌딩 |
| `__tests__/lib/buhlmann.test.ts` | Bühlmann 조직 포화도 |
| `__tests__/lib/oxygen-toxicity.test.ts` | CNS%/OTU |
| `__tests__/lib/sac-rate.test.ts` | SAC Rate, Gas Endurance, RMV |

---

## 10. 계산 표준 (중요)

| 항목 | 값 | 근거 |
|---|---|---|
| 해수면 압력 | 1.0 bar | 다이빙 업계 표준 (10m = 1 bar) |
| 공기 N₂ (계산용) | 0.79 | 표준 근사값 |
| 공기 N₂ (정밀) | 0.781 | 실제 대기 조성 |
| 공기 O₂ (계산용) | 0.21 | 표준 근사값 |
| 공기 O₂ (정밀) | 0.209 | 실제 대기 조성 |
| 수증기압 보정 | 0.0627 bar | Bühlmann 폐포 압력 공식 적용 |
| ICD 경고 임계값 | ΔfN₂ > 0.5% | 부동소수점 오차 방지, 실제 위험 기준 |
| 마지막 정지 기본값 | 6m | GUE 표준 (사용자 3/6/9m 선택 가능) |
