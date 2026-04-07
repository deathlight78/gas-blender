# GUE Decoplanner vs Gas Blender — 감압 계획 비교 분석

> 분석 기준: `reference/decoplanner-offline.html` (GUE Decoplanner 기반 웹앱)
> 최초 분석: 2026-04-05 / 최종 갱신: 2026-04-06

---

## 공통점

- Bühlmann ZHL-16C 기반 감압 알고리즘
- GF Low / High 지원
- Multi-gas (감압 기체 전환) 지원
- CNS% / OTU 산소 독성 계산
- 3m (미터계) / 10ft (야드계) 단위 감압 정지
- 메트릭 / 임페리얼 단위 지원

---

## 기능 비교

| 항목 | Gas Blender (현재) | GUE Decoplanner |
|---|---|---|
| **알고리즘** | ZHL-16C 단일 | ZHL-16B/C + **VPM 동시 계산** |
| **ZHL 기본 계수** | ZHL-16C | **ZHL-16B** (GUE 표준), C 선택 가능 |
| **GF 기본값** | 설정에서 지정 | **GF Low 20% / High 85%** (GUE 표준) |
| **Bailout GF** | ✅ 설정 + 감압 계획 토글 지원 | **GF Low 30% / High 90%** |
| **CCR 블렌딩** | ✅ 완전 지원 (Diluent + Dual SP + MOD + pN₂ + O₂ 소비) | 완전 지원 |
| **CCR 감압 계획** | 없음 | **setpoint 기반 감압 계획** |
| **pSCR** | 없음 | 희석비 설정 지원 |
| **표면 간격** | 없음 | **지원** (조직 포화도 반영) |
| **반복 다이빙** | 없음 | **지원** |
| **고도 보정** | 없음 | **최대 3,000m 고도** |
| **RMV/가스량 연동** | ✅ 프로파일 연동 자동 계산 | 프로파일 연동 자동 계산 |
| **마지막 정지** | ✅ 3m / 6m / 9m 선택 | 3m 또는 6m 선택 |
| **ICD 경고** | ✅ 역방향 가스 전환(N₂↑) 경고 | 역방향 가스 전환 경고 |
| **최소 ppO₂ 경고** | ✅ 감압 기체 전환 수심 저산소 경고 | **0.16 bar 미만 경고** |
| **GF Multilevel** | 없음 | **GF Multilevel Mode** |
| **정지 시간 배분** | 단일 계산 | model / equal / linear / s 4가지 |
| **보존성 레벨** | GF로 간접 조절 | conservatism 레벨 별도 제공 |
| **탭별 공식 설명** | ✅ InfoModal (ⓘ 버튼) | 없음 |
| **통합 워크플로** | ✅ 블렌딩→계획→감압 한 앱에서 | 감압 계획 전용 |

---

## Gas Blender의 장점

- **모바일 앱** — 오프라인 사용, 화면 전환 불필요
- **직관적 UI** — 드럼롤 피커 + 슬라이더로 빠른 입력
- **통합 워크플로** — 블렌딩 → 가스 계획 → 감압 계획을 한 앱에서
- **실린더 계획 탭** — SAC / 가스량 / 실린더별 사용시간 통합 관리
- **탭별 인포 버튼** — 사용된 알고리즘/공식을 화면에서 바로 확인
- **코드 단순성** — 유지보수 용이, 커스텀 쉬움

---

## 구현 완료 이력

| 완료일 | 기능 |
|---|---|
| 2026-04-05 | Priority 1 — RMV 연동 (감압 계획 기체별 소비량 자동 계산) |
| 2026-04-05 | Priority 2 — ICD 경고 (역방향 가스 전환 N₂ 증가 경고) |
| 2026-04-05 | Priority 3 — 마지막 정지 수심 설정 (3m / 6m / 9m, 기본 6m) |
| 2026-04-05 | CCR 블렌딩 탭 (Diluent + setpoint 계산, MOD/ppO₂ 검증) |
| 2026-04-06 | 탭별 InfoModal (ⓘ 버튼 → 알고리즘/공식 설명) |
| 2026-04-06 | Priority A — 감압 기체 저산소 경고 (ppO₂ < 0.16 bar) |
| 2026-04-06 | Priority B — Bailout GF 설정 + 감압 계획 토글 |
| 2026-04-06 | CCR-1 ~ CCR-5 — Diluent MOD / 저산소 한계 수심 / pN₂ / Dual Setpoint / O₂ 소비 추정 |

---

## 신규 개선 우선순위

### ✅ Priority A — 최소 ppO₂ 경고 (저산소 경고) — **완료**

- 감압 기체 전환 수심에서 `ppO₂ < 0.16 bar` 검사
- `deco-planner.ts`에 `hypoxicWarnings` 필드 추가, `deco.tsx`에 경고 표시

### ✅ Priority B — Bailout GF 설정 — **완료**

- `settings.store.ts`에 `gfBailoutLow` / `gfBailoutHigh` 추가 (기본 0.30 / 0.90)
- 감압 계획 화면에 "Bailout 모드" 토글, 설정 화면에 슬라이더

### Priority C — ZHL-16B 계수 선택

- `settings.store.ts`에 `zhlVariant: 'B' | 'C'` 추가 (기본 'C')
- `src/lib/deco/compartments.ts`에 ZHL-16B 계수 테이블 추가
- **구현 난이도**: 낮음~중간
- **근거**: GUE 표준은 16B 사용

### Priority D — 고도 보정

- `settings.store.ts`에 `altitudeM: number` 추가 (기본 0)
- 해수면 절대압 = `exp(−altitude / 8430)` bar (표준 대기 근사)
- **구현 난이도**: 중간 (계산 코어 전체에 파라미터 전파 필요)

---

## CCR 블렌딩 탭 개선 현황

> 분석일: 2026-04-06 / 최종 구현: 2026-04-06

### 현재 제공하는 것
| 항목 | 공식 | 상태 |
|---|---|---|
| Setpoint 유지 최대 수심 | `D = (SP / fO₂_dil − 1) × 10` | ✅ |
| 목표 수심 Diluent ppO₂ | `ppO₂ = fO₂_dil × ATA` | ✅ |
| CCR-1: Diluent MOD | `D_mod = (1.4 / fO₂_dil − 1) × 10` | ✅ |
| CCR-2: 저산소 한계 수심 | `D_hyp = (0.16 / fO₂_dil − 1) × 10` | ✅ |
| CCR-3: 최대 수심 pN₂ | `pN₂ = fN₂_dil × ATA(maxDepth)` | ✅ |
| CCR-4: Dual Setpoint 전환 수심 | `D_sw = (SP2 / fO₂_dil − 1) × 10` | ✅ |
| CCR-5: O₂ 소비량 추정 | `O₂ = 0.5 L/min × T; ΔP = O₂ / V` | ✅ |
| 경고 | setpoint 범위, 표면 저산소, setpoint 초과, MOD 초과 | ✅ |

---

## 장기 검토 (구현 복잡도 높음)

| 기능 | 복잡도 | 비고 |
|---|---|---|
| 표면 간격 / 반복 다이빙 | 높음 | 조직 포화도 영속 + off-gassing 계산 필요 |
| CCR 감압 계획 | 높음 | deco 탭에 OC/CCR 모드 전환, setpoint 기반 ppO₂ 계산 |
| ZHL-16B + VPM 동시 계산 | 매우 높음 | VPM 알고리즘 전체 구현 필요 |
| GF Multilevel 모드 | 중간 | 다중 GF 보간 구간 처리 |
| 정지 시간 배분 방식 선택 | 중간 | model/equal/linear/s 4가지 로직 |
