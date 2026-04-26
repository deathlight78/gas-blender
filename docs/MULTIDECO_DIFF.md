# MultiDeco vs Gas Blender — 알고리즘 비교 분석

> 분석 기준: `reference/multideco-2-26.apk` (MultiDeco 2.26 APK 역설계)
> 분석 방법: `libmultideco_arm64.so` ELF 바이너리 분석 (Python struct)
> 분석 일자: 2026-04-27

---

## 분석 방법

1. APK 압축 해제 → `libmultideco_arm64.so` 추출
2. ELF64 헤더 파싱 → 섹션 목록 확인
3. `.dynsym` 심볼 테이블에서 함수명·주소 추출
4. `.dynstr`·`.rodata` 문자열 분석
5. rate constant (k = ln2 / HT) 배열 위치 탐색
6. b·a 계수 배열 직접 메모리 덤프·비교

---

## MultiDeco 알고리즘 구조 (확인된 정보)

### C++ 클래스 구조
- 메인 클래스: `TVPM` (VPM/ZHL 통합 구현체)
- JNI 브릿지: `Java_com_hhssoftware_multideco_Settings_decoCalc` 등
- 지원 알고리즘: `ZHLC + GF`, `ZHLB + GF`, `VPM-B + GFS`, `VPM-B/FBO`

### 주요 메서드 (함수명·파일 오프셋)
| 메서드 | 오프셋 | 크기 |
|---|---|---|
| `TVPM::DECOMPRESS_STOP` | 0x34760 | 1712 bytes |
| `TVPM::CALC_START_OF_DECO_ZONE` | 0x318ec | 780 bytes |
| `TVPM::CALC_DECO_CEILING_GF` | 0x31bf8 | 456 bytes |
| `TVPM::PROJECTED_ASCENT` | 0x320f8 | 1016 bytes |
| `TVPM::SCHREINER_EQUATION` | 0x35dc4 | 64 bytes |
| `TVPM::GAS_LOADINGS_ASCENT_DESCENT` | 0x32b9c | 696 bytes |
| `TVPM::VPM_CALCULATE` | 0x29c18 | 27048 bytes |

---

## Bühlmann ZHL-16C 계수 비교

### 분석 결과: MultiDeco는 표준 ZHL-16C 사용

N2 rate constant 배열 (`k = ln2 / HT`) 위치: 오프셋 0x15c80  
He rate constant 배열 위치: 오프셋 0x15bf8  
N2 b 계수 배열 위치: 오프셋 0x15e80  
He a 계수 배열 위치: 오프셋 0x15e00 (×10 스케일, 단위 불명)

### 격실별 계수 비교

| 격실 | 항목 | 旧 gas-blender | MultiDeco (표준 ZHL-16C) | 수정 여부 |
|---|---|---|---|---|
| 1 | N2 HT (min) | 4.0 | **5.0** | ✅ 수정 |
| 1 | N2 b | 0.5050 (ZHL-16**B**) | **0.5578** (ZHL-16C) | ✅ 수정 |
| 1 | He HT (min) | 1.51 | **1.88** | ✅ 수정 |
| 1 | He a (bar) | 1.7424 | **1.6189** | ✅ 수정 |
| 1 | He b | 0.4245 | **0.4770** | ✅ 수정 |
| 6 | N2 a (bar) | 0.5933 | **0.5600** | ✅ 수정 |
| 7 | N2 a (bar) | 0.5282 | **0.4947** | ✅ 수정 |
| 8 | N2 a (bar) | 0.4701 | **0.4500** | ✅ 수정 |
| 13 | N2 a (bar) | 0.2971 | **0.2850** | ✅ 수정 |
| 2~5, 9~12, 14~16 | 전 항목 | — | 동일 | 수정 없음 |

---

## 오류 원인 분석

### 1번 격실 전체 오류
旧 코드의 1번 격실은 다수의 비표준 값을 사용:
- `b_N2 = 0.5050`: ZHL-16**B** 값 (ZHL-16C는 0.5578)
- `ht_N2 = 4.0`: 일부 구현체 값 (표준 ZHL-16C는 5.0)
- `ht_He = 1.51`: 비표준값 (표준 ZHL-16C는 1.88)
- `a_He = 1.7424`: 비표준값 (표준 ZHL-16C는 1.6189)
- `b_He = 0.4245`: 비표준값 (표준 ZHL-16C는 0.4770)

### 6~8번·13번 격실 N2 a 오류
표준 ZHL-16C (Erik Baker "Understanding M-Values" 기준) 대비 높은 값 사용.  
높은 a 값 → M-value 높음 → 해당 격실이 덜 보수적.

### 영향 범위
| 항목 | 영향 깊이 범위 | 비고 |
|---|---|---|
| 1번 격실 오류 | 10m 이하 단시간 | 테크 다이빙 범위에서 감압 결정에 기여 미미 |
| 6~8번 a 오류 | **30~60m** (핵심 테크 범위) | 감압 정지 시간에 직접 영향 |
| 13번 a 오류 | 매우 긴 다이빙 | 영향 제한적 |

---

## 기타 확인된 알고리즘 파라미터

### .rodata에서 확인된 설정값 위치
| 값 | 오프셋 | 내용 |
|---|---|---|
| 0.16 | 0x16000 | 저산소 ppO₂ 한계 (0.16 bar) |
| 0.2 | 0x138e8 | 기본 GF Low (20%) |
| 1.01325 | 0x13828 | 해수면 절대압 (bar) |
| 0.79 | 0x13820 | 공기 N₂ 분율 |
| 0.209 | 0x13980 | 공기 O₂ 분율 |

### CNS%/min 룩업 테이블 (0x15f80)
ppO₂ 구간별 CNS%/분 값이 0.12~0.29 범위로 저장되어 있음.  
(NOAA 기준 ppO₂별 CNS 노출 한도 테이블로 추정)

### 확인된 전역 변수
| 변수명 | 주소 | 내용 |
|---|---|---|
| `Depth_Start_of_Deco_Zone` | 0x66458 | 첫 감압 정지 수심 |
| `Deco_Stop_Complete` | 0x66472 | 정지 완료 플래그 |
| `In_Deco_Stops` | 0x66479 | 감압 구간 플래그 |
| `Deco_Ceil_Depth` | 0x663d8 | 현재 천장 수심 |
| `Deco_Grad_N2` | 0x66f00 | N₂ 기울기 배열 |
| `Deco_Grad_He` | 0x66e80 | He 기울기 배열 |

---

## 한계 및 미확인 항목

- **전체 디컴파일 불가**: ARM64 어셈블리 분석은 Ghidra 없이 불가  
  → `DECOMPRESS_STOP` 내부 정지 탈출 조건 로직은 소스 수준 확인 불가  
  → 알고리즘 동작 일치는 입출력 비교(블랙박스 테스트)로 검증
- **He a 계수 단위 불명**: 오프셋 0x15e00의 값이 ×10 스케일로 나타나 단위 체계 불명확
- **VPM-B 계수**: VPM 버블 모델 계수 위치 미탐색
- **ZHL-16B 계수**: 심볼에 `ZHLB + GF` 존재하나 별도 테이블 위치 미확인

---

## 참고

- MultiDeco 공식 사이트: hhssoftware.com
- 표준 ZHL-16C 계수 출처: Erik Baker, "Understanding M-Values" (1998)
- 분석 바이너리: `reference/libmultideco_arm64.so` (MultiDeco 2.26 APK에서 추출)
