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

### 완료 (Phase 1)
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
- [x] 단위 테스트 14개 전체 통과 (`npm test`)

---

## 앞으로 할 작업

### Phase 2 — 계산기 화면 UI
- [ ] `app/calculator.tsx` — MOD / Best Mix / EAD / END 입력 폼 + 결과 카드
  - 수심 입력 → 실시간 MOD, Best Mix, EAD 출력
  - fO2 / fHe 슬라이더 연동
- [ ] `src/components/ui/NumericInput.tsx` — 숫자 입력 공통 컴포넌트
- [ ] `src/components/ui/ResultCard.tsx` — 계산 결과 표시 카드
- [ ] `src/components/ui/GasSlider.tsx` — O₂ / He 비율 슬라이더

### Phase 3 — OC 블렌딩 화면 UI
- [ ] `app/blending.tsx` — OC 탭 / CCR 탭 전환 구조
- [ ] `src/components/blending/TankForm.tsx` — 현재 탱크 / 목표 탱크 입력 폼
- [ ] `src/components/blending/BlendResult.tsx` — He 주입량 / O₂ 주입량 / 탑업 압력 표시
- [ ] `src/lib/blending/ccr-blending.ts` — CCR Diluent + setpoint 계산 구현
- [ ] CCR 블렌딩 화면 UI

### Phase 4 — 설정 화면 UI
- [ ] `app/settings.tsx` — 설정 화면 완성
  - ppO₂ 작업/감압 한계 조정
  - GF Low / High 슬라이더
  - 단위 전환 (m/ft, bar/psi)
  - 상승/하강 속도
- [ ] AsyncStorage 연동 — 설정 영속성 저장

### Phase 5 — 감압 계획 엔진
- [ ] `src/lib/deco/gradient-factor.ts` — GF 보간 로직 분리
- [ ] 감압 계획 계산 오케스트레이터 구현
  - 다이브 프로파일 → 조직 포화도 시뮬레이션
  - GF 기반 ceiling 추적 → 감압 정지 생성
  - Multi-gas 전환 (bottom mix → deco gas)
  - CNS% / OTU 산출
- [ ] 감압 엔진 단위 테스트 추가

### Phase 6 — 감압 계획 화면 UI
- [ ] `app/deco.tsx` — 다이브 프로파일 입력 화면
  - 목표 수심 / 바닥 시간 / 하강 속도
  - 사용 기체 목록 (bottom + deco gases)
  - GF 설정 오버라이드
- [ ] `src/components/deco/DecoTable.tsx` — 감압 정지 테이블 (수심 / 시간 / 기체)
- [ ] TTS / 총 감압 시간 / CNS% / OTU 요약 카드

### Phase 7 — 마감 작업
- [ ] 다크 모드 지원
- [ ] 다국어 (한국어 / 영어)
- [ ] 면책 조항(Disclaimer) 첫 실행 시 표시
- [ ] 앱 아이콘 / 스플래시 스크린 디자인
- [ ] EAS Build 설정 (Expo Application Services)
- [ ] App Store / Google Play 배포 준비

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
