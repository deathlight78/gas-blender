# Gas Blender — 프로젝트 현황 및 작업 목록

## 프로젝트 개요
스쿠버 테크니컬 다이빙 전용 가스 블렌딩 & 감압 계획 앱.
- 플랫폼: iOS / Android (React Native + Expo SDK 54)
- 언어: TypeScript
- 라우팅: Expo Router v3 (파일 기반)
- 상태관리: Zustand
- 테스트: Jest + ts-jest

세부 아키텍처는 `ARCHITECTURE.md` 참고.

---

## 현재 진행 상황

### 완료 (Phase 1~4)
- [x] Expo 프로젝트 초기화 및 Expo Router 설정
- [x] 5개 탭 네비게이션 구조 (`Home`, `Blending`, `Calculator`, `Deco Plan`, `Settings`)
- [x] 각 탭 플레이스홀더 화면 생성
- [x] 핵심 계산 라이브러리 초기 구현
  - `src/lib/gas/constants.ts` — 다이빙 계산 표준 상수 (surface=1.0 bar, AIR_N2=0.79)
  - `src/lib/gas/partial-pressure.ts` — 부분압 / 절대압 변환
  - `src/lib/gas/mod.ts` — MOD, Best Mix, Min Operating Depth
  - `src/lib/gas/ead-end.ts` — EAD, END 계산
  - `src/lib/blending/oc-blending.ts` — OC 부분압 블렌딩 (공기 탑업 O₂ 보정 포함)
  - `src/lib/deco/compartments.ts` — Bühlmann ZHL-16C 16 compartment 계수
  - `src/lib/deco/buhlmann.ts` — Schreiner 방정식, 조직 포화도 업데이트, GF ceiling 계산
- [x] 타입 정의: `GasMix`, `Tank`, `OCBlendInput/Result`, `CCRBlendInput/Result`, `DecoInput/Result`
- [x] Settings store (Zustand): ppO₂ 한계, GF, 단위, 상승/하강 속도
- [x] 단위 테스트 18개 전체 통과 (`npm test`)
- [x] 공통 UI 컴포넌트: `NumericInput`, `ResultCard`, `GasSlider`, `SectionHeader`
- [x] `app/calculator.tsx` — MOD / Best Mix / EAD / END 실시간 계산 화면
- [x] `src/components/blending/TankForm.tsx`, `BlendResult.tsx`
- [x] `src/lib/blending/ccr-blending.ts` — CCR Diluent + setpoint 계산
- [x] `app/blending.tsx` — OC / CCR 탭 전환, 블렌딩 계산 UI
- [x] `app/settings.tsx` — ppO₂ / GF / 단위 / 속도 설정 + 저장/초기화
- [x] AsyncStorage persist 미들웨어 연동 (Zustand)
- [x] `src/lib/deco/gradient-factor.ts` — GF 보간 + 3m 정지 올림 로직
- [x] `src/lib/deco/oxygen-toxicity.ts` — CNS%/OTU 계산 (NOAA 표 + Repex 공식)
- [x] `src/lib/deco/deco-planner.ts` — Bühlmann ZHL-16C + GF 감압 오케스트레이터
  - 다이브 프로파일 → 조직 포화도 시뮬레이션 (Schreiner 방정식)
  - GF 보간 기반 ceiling 추적 → 3m 단위 감압 정지 생성
  - Multi-gas 전환 (bottom mix → deco gas, 전환 수심 기준)
  - CNS% / OTU 누적 산출
- [x] `src/components/deco/DecoTable.tsx` — 감압 정지 테이블 (수심/시간/기체/런타임)
- [x] `src/components/deco/DecoSummary.tsx` — TTS / 총감압시간 / CNS% / OTU 요약 카드
- [x] `app/deco.tsx` — 다이브 프로파일 입력, 감압 기체 관리, GF 오버라이드, 결과 표시
- [x] 단위 테스트 32개 전체 통과

---

## 앞으로 할 작업

### Phase 7 — 마감 작업 (완료)
- [x] 다크 모드 지원 — `ThemeContext` + `useAppTheme`, 라이트/다크/시스템 전환 (설정 화면)
- [x] 다국어 (한국어 / 영어) — `src/i18n/` + `useTranslation` hook, 전 화면 적용
- [x] 면책 조항(Disclaimer) 첫 실행 시 표시 — `DisclaimerModal`, AsyncStorage 영속성
- [x] 앱 아이콘 / 스플래시 배경색 → `#003366` (브랜드 컬러)
- [x] EAS Build 설정 (`eas.json` — development/preview/production)
- [x] App Store / Google Play 배포 준비 (`app.json` — bundleIdentifier, package 설정)

### 잔여 배포 작업 (수동 필요)
- [ ] EAS 프로젝트 ID 등록: `eas init` 실행 후 `app.json` extra.eas.projectId 입력
- [ ] Apple Developer 계정 등록: `eas.json` submit.ios 필드 채우기
- [ ] Google Play Service Account 키 파일 준비
- [ ] 앱 아이콘 실제 디자인 파일 교체 (`assets/icon.png` 등 1024×1024)

---

## 기술 메모

### 계산 표준 (중요)
- 해수면 압력: `1.0 bar` (다이빙 업계 표준, 10m = 1 bar)
- 공기 N₂: `0.79`, 공기 O₂: `0.209`
- EAD 공식: `(fN2 / 0.79) * (depth + 10) - 10`
- MOD 공식: `(ppO2_limit / fO2 - 1) * 10`
- OC 블렌딩 O₂ 주입량: `(fO2_target * P_final - fO2_curr * P_curr - 0.209 * airBase) / 0.791`

### 실행 명령
```bash
npm start          # Expo 개발 서버 시작
npm run android    # Android 에뮬레이터 실행
npm run ios        # iOS 시뮬레이터 실행 (macOS 필요)
npm test           # 단위 테스트 실행
```

### 패키지 설치 시 주의
의존성 충돌이 있으므로 `--legacy-peer-deps` 플래그 사용:
```bash
npm install <패키지> --legacy-peer-deps
```
