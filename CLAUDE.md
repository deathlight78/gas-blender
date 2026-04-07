# Gas Blender — 프로젝트 현황

## 프로젝트 개요
스쿠버 테크니컬 다이빙 전용 가스 블렌딩 & 감압 계획 앱.
- 플랫폼: iOS / Android / PWA (Vercel)
- 프레임워크: React Native 0.81 + Expo SDK 54
- 언어: TypeScript 5.9
- 라우팅: Expo Router v6 (파일 기반)
- 상태관리: Zustand v5 + AsyncStorage persist
- 테스트: Jest 30 + ts-jest (39개 통과)

세부 아키텍처는 `ARCHITECTURE.md` 참고.

---

## 구현 완료 목록

### 계산 라이브러리 (`src/lib/`)
- `gas/constants.ts` — 표준 상수 (surface=1.0 bar, AIR_N2=0.79/0.781)
- `gas/partial-pressure.ts` — 부분압 / 절대압 변환
- `gas/mod.ts` — MOD, Best Mix
- `gas/ead-end.ts` — EAD, END
- `gas/sac-rate.ts` — SAC Rate, Gas Endurance, RMV
- `blending/oc-blending.ts` — OC 부분압 블렌딩 (공기 탑업 O₂ 보정, isValid 플래그)
- `blending/ccr-blending.ts` — CCR Diluent + setpoint 계산 + CCR-1~5 (MOD / 저산소 한계 / pN₂ / Dual SP / O₂ 소비)
- `deco/compartments.ts` — Bühlmann ZHL-16C 16 compartment 계수
- `deco/buhlmann.ts` — Schreiner 방정식, 조직 포화도 업데이트, GF ceiling
- `deco/gradient-factor.ts` — GF 보간 + 3m 정지 올림
- `deco/oxygen-toxicity.ts` — CNS%/OTU (NOAA 표 + Repex 공식)
- `deco/deco-planner.ts` — 감압 오케스트레이터 (multi-gas, CNS/OTU 누적, lastStopDepth, ICD 경고, 저산소 경고, 기체별 소비량)
- `deco/cns-recovery.ts` — 수면 휴식 후 CNS% 지수 회복 계산 (반감기 90min), 세션 carry-over 집계
- `utils/ranges.ts` — buildRange(min, max, step)

### 화면 (`app/`)
- `index.tsx` — 홈 대시보드 (기능 카드, i18n)
- `blending.tsx` — OC / CCR 블렌딩 (탭 전환, 헤더 ⓘ 인포 버튼, CCR-1~5 결과 카드)
- `gas-plan.tsx` — SAC Rate · RMV · 가스 사용시간 · 실린더별 계획 (수심/SAC 개별 설정, 헤더 ⓘ 인포 버튼)
- `deco.tsx` — 감압 계획 (StepInput + GasSlider, 마지막 정지 수심, RMV, ICD/저산소 경고, 기체별 소비량, Bailout 탭 UI, 감압 기체 번호 카드, 다이빙 세션 패널)
- `calculator.tsx` — MOD / Best Mix / EAD / END (헤더 ⓘ 인포 버튼)
- `settings.tsx` — ppO₂ · 상승/하강 속도 · GF · GF Bailout · 단위 · 공기 조성 · 언어 · 테마 · 피드백 이메일

### UI 컴포넌트 (`src/components/`)
- `ui/DrumRollPicker.tsx` — 드럼롤 피커 (PanResponder + 관성 스크롤, capture 핸들러)
- `ui/GasSlider.tsx` — −/입력/+ + 수평 슬라이더 (0~1 분율, 중앙 정렬)
- `ui/StepInput.tsx` — −/입력/+ + 수평 슬라이더 (범용 숫자, 중앙 정렬)
- `ui/ResultCard.tsx` — 계산 결과 카드
- `ui/SectionHeader.tsx` — 섹션 헤더
- `ui/NumericInput.tsx` — 단순 숫자 입력
- `ui/InfoModal.tsx` — 탭별 기능 설명 모달 (헤더 ⓘ 버튼, useNavigation + useLayoutEffect)
- `ui/DisclaimerModal.tsx` — 첫 실행 면책 조항 모달
- `blending/TankForm.tsx` — 블렌딩 실린더 폼 (DrumRollPicker)
- `blending/BlendResult.tsx` — 블렌딩 결과 (isValid 기반 경고 분기)
- `deco/DecoTable.tsx` — 감압 정지 테이블
- `deco/DecoSummary.tsx` — TTS / 총감압 / CNS% / OTU 요약
- `deco/SessionPanel.tsx` — 연속 다이빙 세션 패널 (다이빙 목록, 수면 휴식 편집, OTU 프로그레스 바)

### 스토어 (`src/store/`)
- `settings.store.ts` — ppO₂·GF·GF Bailout·단위·속도·공기 조성 (AsyncStorage 영속)
- `app.store.ts` — 언어·테마·면책조항 동의 (AsyncStorage 영속)
- `session.store.ts` — 연속 다이빙 세션 기록 (AsyncStorage 영속, 앱 재시작 후에도 유지)

### 타입 (`src/types/`)
- `gas.types.ts` — GasMix, DepthUnit, PressureUnit
- `blending.types.ts` — OCBlendInput/Result, CCRBlendInput/Result + CCR-1~5 결과 타입
- `deco.types.ts` — DecoInput, DecoResult, DecoStop, GasConsumption, IcdWarning, HypoxicWarning, **SessionEntry**

### 인프라
- `src/i18n/` — 한국어/영어 전환 (`useTranslation` hook, `t(key, params?)`)
- `src/context/ThemeContext.tsx` — 라이트/다크/시스템 테마
- `app/+html.tsx` — PWA meta 태그 (viewport-fit=cover, manifest)
- `public/manifest.json` — PWA manifest
- `vercel.json` — Vercel 배포 설정
- `eas.json` — EAS Build (development/preview/production)

### 참고 문서
- `docs/GUE_DIFF.md` — GUE Decoplanner vs 현 프로젝트 기능 비교 및 로드맵

---

## 다음 구현 후보 (우선순위 순)

| 순위 | 기능 | 난이도 | 핵심 변경 파일 |
|---|---|---|---|
| ✅ A | 최소 ppO₂ 경고 (< 0.16 bar) | 낮음 | `deco-planner.ts`, `deco.tsx` |
| ✅ B | Bailout GF 설정 + 탭 UI | 낮음 | `settings.store.ts`, `settings.tsx`, `deco.tsx` |
| ✅ CCR-1~5 | CCR 블렌딩 5종 개선 | 낮음~중간 | `ccr-blending.ts`, `blending.types.ts`, `blending.tsx` |
| ✅ Session | 연속 다이빙 OTU/CNS% 세션 추적 | 중간 | `session.store.ts`, `SessionPanel.tsx`, `deco.tsx` |
| C | ZHL-16B 계수 선택 | 낮음~중간 | `compartments.ts`, `settings.store.ts` |
| D | 고도 보정 | 중간 | `deco-planner.ts` + `DecoInput` 전파 |
| E | 조직 포화도 캐리오버 (Phase 3) | 높음 | `deco-planner.ts`, `session.store.ts` |

세부 구현 현황은 `docs/GUE_DIFF.md` 참고.

---

## 잔여 배포 작업 (수동 필요)
- [ ] EAS 프로젝트 ID: `eas init` → `app.json` extra.eas.projectId 입력
- [ ] Apple Developer 계정: `eas.json` submit.ios 필드 채우기
- [ ] Google Play Service Account 키 파일 준비
- [ ] 앱 아이콘 최종 디자인 파일 교체 (`assets/icon.png` 1024×1024)

---

## 실행 명령
```bash
npm start          # Expo 개발 서버
npm run android    # Android 에뮬레이터
npm run ios        # iOS 시뮬레이터 (macOS 필요)
npm test           # 단위 테스트 (39개)
```

## 패키지 설치 시 주의
의존성 충돌 → `--legacy-peer-deps` 플래그 필수:
```bash
npm install <패키지> --legacy-peer-deps
```

---

## 알려진 설계 결정 사항

| 항목 | 결정 | 이유 |
|---|---|---|
| 드럼롤 피커 스크롤 충돌 | capture-phase PanResponder 핸들러 | 부모 ScrollView가 터치를 가로챔 |
| OC 블렌딩 isValid | addTopPressure < −0.1 시 경고만 표시 | EAN100 등 불가능 조합에서 혼란 방지 |
| CCR 경고 i18n | `key\|param` 인코딩 후 UI에서 파싱 | 계산 라이브러리에 UI 의존성 불가 |
| 기본 테마 | dark | 수중 환경 사용 시 눈부심 방지 |
| 공기 조성 | 설정에서 정밀/계산용 선택 가능 | EAD·감압 계산 정밀도 사용자 선택 |
| SAC vs RMV | SAC = 해수면 기준, RMV = SAC × ATA (수심 보정) | 두 값 모두 표시하여 계획 정확도 향상 |
| 마지막 정지 수심 기본값 | 6m (GUE 표준) | 3m보다 보수적, 사용자 3m/6m/9m 선택 가능 |
| ICD 경고 임계값 | fN₂ 차이 0.5% | 부동소수점 오차 방지, 실제 위험 기준 |
| 헤더 ⓘ 버튼 주입 | `useNavigation + useLayoutEffect` | Expo Router tabs에서 화면별 headerRight 설정 표준 방식 |
| Bailout GF UI | GF 섹션 내 탭(일반/Bailout) 전환 | 별도 토글 행보다 맥락 명확, 탭마다 현재 GF 수치 표시 |
| 감압 기체 카드 | 번호 뱃지 + 헤더/바디/푸터 분리 | 어떤 실린더인지 즉시 구분, 전환 수심 ppO₂ 하단 표시 |
| 설정 탭 섹션 순서 | ppO₂ → 상승/하강 속도 → GF → GF Bailout → 단위 → 공기 조성 → 외관 | 감압 계획 흐름(독성 한계→속도→GF)과 일치 |
| 세션 OTU carry-over | OTU 단순 누적, CNS%는 반감기 90min 지수 회복 | NOAA 기준 적용, 현실적 피로도 반영 |
| 세션 조직 포화도 | 미구현 (Phase 2 범위 외) | 구현 복잡도 높음, 별도 Phase 3으로 분리 |
| 세션 저장소 | Zustand + AsyncStorage (`gas-blender-dive-session`) | 앱 재시작 후에도 당일 세션 유지 |
