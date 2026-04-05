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
- `gas/sac-rate.ts` — SAC Rate, Gas Endurance
- `blending/oc-blending.ts` — OC 부분압 블렌딩 (공기 탑업 O₂ 보정, isValid 플래그)
- `blending/ccr-blending.ts` — CCR Diluent + setpoint 계산 (경고 i18n 키 인코딩)
- `deco/compartments.ts` — Bühlmann ZHL-16C 16 compartment 계수
- `deco/buhlmann.ts` — Schreiner 방정식, 조직 포화도 업데이트, GF ceiling
- `deco/gradient-factor.ts` — GF 보간 + 3m 정지 올림
- `deco/oxygen-toxicity.ts` — CNS%/OTU (NOAA 표 + Repex 공식)
- `deco/deco-planner.ts` — 감압 오케스트레이터 (multi-gas, CNS/OTU 누적)
- `utils/ranges.ts` — buildRange(min, max, step)

### 화면 (`app/`)
- `index.tsx` — 홈 대시보드 (기능 카드, i18n)
- `blending.tsx` — OC / CCR 블렌딩 (탭 전환)
- `gas-plan.tsx` — SAC Rate · 가스 사용시간 · 실린더별 계획 (수심/SAC 개별 설정)
- `deco.tsx` — 감압 계획 (StepInput + GasSlider)
- `calculator.tsx` — MOD / Best Mix / EAD / END
- `settings.tsx` — ppO₂ · GF · 단위 · 속도 · 언어 · 테마

### UI 컴포넌트 (`src/components/`)
- `ui/DrumRollPicker.tsx` — 드럼롤 피커 (PanResponder + 관성 스크롤, capture 핸들러)
- `ui/GasSlider.tsx` — −/입력/+ + 수평 슬라이더 (0~1 분율, 중앙 정렬)
- `ui/StepInput.tsx` — −/입력/+ + 수평 슬라이더 (범용 숫자, 중앙 정렬)
- `ui/ResultCard.tsx` — 계산 결과 카드
- `ui/SectionHeader.tsx` — 섹션 헤더
- `ui/NumericInput.tsx` — 단순 숫자 입력
- `ui/DisclaimerModal.tsx` — 첫 실행 면책 조항 모달
- `blending/TankForm.tsx` — 블렌딩 실린더 폼 (DrumRollPicker)
- `blending/BlendResult.tsx` — 블렌딩 결과 (isValid 기반 경고 분기)
- `deco/DecoTable.tsx` — 감압 정지 테이블
- `deco/DecoSummary.tsx` — TTS / 총감압 / CNS% / OTU 요약

### 인프라
- `src/i18n/` — 한국어/영어 전환 (`useTranslation` hook, `t(key, params?)`)
- `src/context/ThemeContext.tsx` — 라이트/다크/시스템 테마
- `src/store/settings.store.ts` — 앱 설정 영속 (AsyncStorage)
- `src/store/app.store.ts` — 언어/테마/면책 동의 영속 (기본 테마: dark)
- `app/+html.tsx` — PWA meta 태그 (viewport-fit=cover, manifest)
- `public/manifest.json` — PWA manifest
- `vercel.json` — Vercel 배포 설정
- `eas.json` — EAS Build (development/preview/production)

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
