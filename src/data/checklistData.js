// 「집 보러 갈 때 10분 체크」 v2.0 — 체크리스트 문항 데이터
// 기획서 01_체크리스트_정보구조.md §2, §3, §4, §5 원문 기준
// UI와 점수 계산의 단일 출처(single source of truth). ES 모듈로 재포팅.

// ---------- 대분류 / 카테고리 ----------

export const GROUPS = [
  { id: 'outside', label: '건물 밖' },
  { id: 'inside', label: '건물 안' }
];

export const CATEGORIES = [
  { id: 'A_exterior_common', group: 'outside', label: 'A. 건물·공용부' },
  { id: 'B_parking_around', group: 'outside', label: 'B. 주차·주변환경·접근성' },
  { id: 'C_first_impression', group: 'inside', label: 'C. 첫인상', hint: '문을 열고 들어선 직후, 익숙해지기 전에 답해 주세요.' },
  { id: 'D_wall_ceiling_window', group: 'inside', label: 'D. 벽·천장·창문' },
  { id: 'E_noise', group: 'inside', label: 'E. 소음', hint: '잠시 말을 멈추고 30초 동안 들어보세요.' },
  { id: 'F_kitchen', group: 'inside', label: 'F. 주방' },
  { id: 'G_bathroom', group: 'inside', label: 'G. 욕실·화장실' },
  { id: 'H_hvac_electric', group: 'inside', label: 'H. 냉난방·전기' },
  { id: 'I_door_storage_space', group: 'inside', label: 'I. 문·수납·공간' }
];

// ---------- 문항 50개 ----------
// severity: "critical" | "major" | "minor"
// tier: "core"(핵심, 기본 노출) | "optional"(선택, 더보기)
// allowNA: 상태값으로 "na"(해당없음)를 허용하는지

export const ITEMS = [
  // A. 건물·공용부 (5)
  { id: 'entrance_lock', category: 'A_exterior_common', text: '공동현관이 잠겨 있고, 비밀번호나 카드로만 열린다.', severity: 'major', tier: 'core', allowNA: false },
  { id: 'building_crack', category: 'A_exterior_common', text: '외벽·계단실에 갈라진 틈이나 물이 흘러내린 자국이 없다.', severity: 'major', tier: 'core', allowNA: false },
  { id: 'common_clean', category: 'A_exterior_common', text: '계단과 복도에 쓰레기나 개인 물건이 쌓여 있지 않다.', severity: 'minor', tier: 'optional', allowNA: false },
  { id: 'elevator_state', category: 'A_exterior_common', text: '엘리베이터가 작동하고 최근 점검 스티커가 붙어 있다.', severity: 'minor', tier: 'optional', allowNA: true },
  { id: 'trash_area', category: 'A_exterior_common', text: '쓰레기·재활용 배출 장소가 집에서 가깝고 정리되어 있다.', severity: 'minor', tier: 'optional', allowNA: false },

  // B. 주차·주변환경·접근성 (5)
  { id: 'parking_space', category: 'B_parking_around', text: '주차할 수 있는 자리가 실제로 남아 있다.', severity: 'major', tier: 'core', allowNA: true },
  { id: 'transit_walk', category: 'B_parking_around', text: '지하철역이나 버스정류장까지 걸어서 갈 만한 거리다.', severity: 'major', tier: 'core', allowNA: false },
  { id: 'night_route', category: 'B_parking_around', text: '귀갓길에 가로등이 켜져 있고 인적이 끊기는 구간이 없다.', severity: 'major', tier: 'core', allowNA: false },
  { id: 'parking_access', category: 'B_parking_around', text: '주차장 진입로와 주차 칸이 내 차가 들어갈 만한 폭이다.', severity: 'minor', tier: 'optional', allowNA: true },
  { id: 'slope_stairs', category: 'B_parking_around', text: '집까지 오는 길에 가파른 언덕이나 긴 계단이 없다.', severity: 'minor', tier: 'optional', allowNA: false },

  // C. 첫인상 — 냄새·채광·환기 (5)
  { id: 'smell_indoor', category: 'C_first_impression', text: '들어섰을 때 곰팡이·하수구·담배 등 불쾌한 냄새가 나지 않는다.', severity: 'major', tier: 'core', allowNA: false },
  { id: 'daylight', category: 'C_first_impression', text: '낮에 불을 켜지 않아도 될 만큼 빛이 든다.', severity: 'major', tier: 'core', allowNA: false },
  { id: 'ventilation', category: 'C_first_impression', text: '창문을 열었을 때 공기가 통한다(맞통풍 또는 환기구).', severity: 'major', tier: 'core', allowNA: false },
  { id: 'air_freshener', category: 'C_first_impression', text: '방향제나 향초 냄새로 다른 냄새를 덮은 정황이 없다.', severity: 'minor', tier: 'optional', allowNA: false },
  { id: 'view_block', category: 'C_first_impression', text: '앞 건물이 창을 가려 시야와 빛을 막지 않는다.', severity: 'minor', tier: 'optional', allowNA: false },

  // D. 벽·천장·창문 (7)
  { id: 'mold_black', category: 'D_wall_ceiling_window', text: '벽지·천장·창가에 검은 곰팡이가 없다.', severity: 'critical', tier: 'core', allowNA: false },
  { id: 'leak_stain', category: 'D_wall_ceiling_window', text: '천장이나 벽에 누런 물자국이 없다.', severity: 'critical', tier: 'core', allowNA: false },
  { id: 'condensation', category: 'D_wall_ceiling_window', text: '창틀과 벽 모서리에 물이 고였던 자국이나 들뜬 벽지가 없다.', severity: 'major', tier: 'core', allowNA: false },
  { id: 'window_open', category: 'D_wall_ceiling_window', text: '주요 창문이 끝까지 열리고 닫힌다.', severity: 'major', tier: 'core', allowNA: false },
  { id: 'window_lock', category: 'D_wall_ceiling_window', text: '창문 잠금장치가 끝까지 걸린다.', severity: 'major', tier: 'core', allowNA: false },
  { id: 'wallpaper_patch', category: 'D_wall_ceiling_window', text: '한 부분만 새것처럼 다시 도배된 곳이 없다.', severity: 'major', tier: 'optional', allowNA: false },
  { id: 'window_screen', category: 'D_wall_ceiling_window', text: '방충망이 찢어지거나 빠진 곳이 없다.', severity: 'minor', tier: 'optional', allowNA: true },

  // E. 소음 (3, 소음 정도는 별도 라디오)
  { id: 'noise_outdoor', category: 'E_noise', text: '창을 닫으면 도로·오토바이·상가 소음이 거의 들리지 않는다.', severity: 'major', tier: 'core', allowNA: false },
  { id: 'noise_neighbor', category: 'E_noise', text: '옆집이나 위층의 생활음이 들리지 않는다.', severity: 'major', tier: 'core', allowNA: false },
  { id: 'noise_facility', category: 'E_noise', text: '엘리베이터·보일러·배관 등 설비 소리가 들리지 않는다.', severity: 'minor', tier: 'optional', allowNA: false },

  // F. 주방 (5)
  { id: 'hotwater_kitchen', category: 'F_kitchen', text: '주방 수전을 틀고 3분 안에 뜨거운 물이 나온다.', severity: 'critical', tier: 'core', allowNA: false },
  { id: 'drain_kitchen', category: 'F_kitchen', text: '싱크대에 물을 받았다 흘려보내면 고이지 않고 빠진다.', severity: 'critical', tier: 'core', allowNA: false },
  { id: 'water_pressure_kitchen', category: 'F_kitchen', text: '싱크대 수압이 설거지에 충분하다.', severity: 'major', tier: 'core', allowNA: false },
  { id: 'sink_undercabinet', category: 'F_kitchen', text: '싱크대 하부장 안이 젖어 있거나 냄새가 나지 않는다.', severity: 'major', tier: 'core', allowNA: false },
  { id: 'kitchen_space', category: 'F_kitchen', text: '냉장고 놓을 자리와 조리할 상판 공간이 있다.', severity: 'minor', tier: 'optional', allowNA: false },

  // G. 욕실·화장실 (8)
  { id: 'hotwater_bath', category: 'G_bathroom', text: '욕실 샤워기를 틀고 3분 안에 뜨거운 물이 나오고 끊기지 않는다.', severity: 'critical', tier: 'core', allowNA: false },
  { id: 'water_pressure_bath', category: 'G_bathroom', text: '샤워기 수압이 머리를 감을 만큼 나온다.', severity: 'critical', tier: 'core', allowNA: false },
  { id: 'drain_bath', category: 'G_bathroom', text: '세면대·바닥 배수구·변기 물이 막힘 없이 내려간다.', severity: 'critical', tier: 'core', allowNA: false },
  { id: 'mold_bath', category: 'G_bathroom', text: '천장·타일 줄눈·실리콘에 검은 곰팡이가 없다.', severity: 'critical', tier: 'core', allowNA: false },
  { id: 'smell_drain_bath', category: 'G_bathroom', text: '배수구에서 냄새가 올라오지 않는다.', severity: 'major', tier: 'core', allowNA: false },
  { id: 'vent_fan', category: 'G_bathroom', text: '환풍기를 켜면 돌아가고 휴지가 붙을 만큼 빨아들인다.', severity: 'major', tier: 'core', allowNA: false },
  { id: 'bath_leak', category: 'G_bathroom', text: '세면대와 수전 아래에 물이 새거나 젖은 흔적이 없다.', severity: 'major', tier: 'optional', allowNA: false },
  { id: 'tile_toilet', category: 'G_bathroom', text: '타일이 깨지거나 들뜬 곳이 없고 변기가 흔들리지 않는다.', severity: 'minor', tier: 'optional', allowNA: false },

  // H. 냉난방·전기 (6)
  { id: 'heating_boiler', category: 'H_hvac_electric', text: '보일러가 켜지고 난방 조절기가 반응한다.', severity: 'critical', tier: 'core', allowNA: false },
  { id: 'lights_switch', category: 'H_hvac_electric', text: '모든 방의 전등과 스위치가 켜진다.', severity: 'major', tier: 'core', allowNA: false },
  { id: 'outlet_count', category: 'H_hvac_electric', text: '방마다 콘센트가 2구 이상 있다.', severity: 'major', tier: 'core', allowNA: false },
  { id: 'aircon_state', category: 'H_hvac_electric', text: '에어컨을 켜면 찬 바람이 나온다.', severity: 'major', tier: 'optional', allowNA: true },
  { id: 'mobile_signal', category: 'H_hvac_electric', text: '집 안 모든 방에서 휴대폰 신호가 잡힌다.', severity: 'major', tier: 'optional', allowNA: false },
  { id: 'aircon_mold', category: 'H_hvac_electric', text: '에어컨 송풍구 안쪽에 검은 곰팡이가 보이지 않는다.', severity: 'minor', tier: 'optional', allowNA: true },

  // I. 문·수납·공간 (6)
  { id: 'door_entrance', category: 'I_door_storage_space', text: '현관문이 끝까지 닫히고 잠금장치가 잠긴다.', severity: 'critical', tier: 'core', allowNA: false },
  { id: 'washer_space', category: 'I_door_storage_space', text: '세탁기를 놓을 자리와 배수구가 있다.', severity: 'major', tier: 'core', allowNA: true },
  { id: 'furniture_space', category: 'I_door_storage_space', text: '침대 등 주요 가구를 놓고도 지나다닐 통로가 남는다.', severity: 'minor', tier: 'core', allowNA: false },
  { id: 'floor_level', category: 'I_door_storage_space', text: '바닥이 꺼지거나 밟을 때 삐걱대는 곳이 없다.', severity: 'major', tier: 'optional', allowNA: false },
  { id: 'door_inner', category: 'I_door_storage_space', text: '방문과 욕실문이 바닥에 끌리지 않고 여닫힌다.', severity: 'minor', tier: 'optional', allowNA: false },
  { id: 'closet_size', category: 'I_door_storage_space', text: '옷장이나 붙박이장에 옷을 걸 깊이가 나온다.', severity: 'minor', tier: 'optional', allowNA: true }
];

// ---------- 상태값 ----------
// 항목 상태: 미응답(null) | 미흡(poor) | 양호(fine) | 좋음(great) | 해당없음(na)
// 舊 v1의 good/issue 토큰과 의도적으로 다른 이름 — 문자열 우연일치로 인한 조용한 오동작 방지.

export const STATUS = { POOR: 'poor', FINE: 'fine', GREAT: 'great', NA: 'na' };
export const STATUS_ORDER = [STATUS.POOR, STATUS.FINE, STATUS.GREAT];

export const SEVERITY_PENALTY = { critical: 15, major: 6, minor: 2 };
export const SEVERITY_LABEL = { critical: '치명', major: '중요', minor: '참고' };

// ---------- 소음 정도 ----------

export const NOISE_LEVELS = [
  { id: 'quiet', label: '조용한 편' },
  { id: 'normal', label: '보통' },
  { id: 'bothering', label: '거슬리는 수준' },
  { id: 'unlivable', label: '거주하기 어려운 수준' }
];

// ---------- 거래 유형 ----------

export const DEAL_TYPES = [
  { id: 'jeonse', label: '전세' },
  { id: 'wolse', label: '월세' },
  { id: 'maemae', label: '매매' },
];

// ---------- 중개사에게 물어볼 것 (8개, 확인율·점수 계산 제외) ----------

export const QUESTIONS = [
  { id: 'q_internet', text: '인터넷 회선이 들어와 있나요? 어느 통신사인가요?' },
  { id: 'q_management_fee', text: '관리비에 무엇이 포함되나요? (수도/난방/인터넷/청소비)' },
  { id: 'q_repair_history', text: '최근 도배·장판·보일러·전기 설비 수리나 교체 이력이 있나요?' },
  { id: 'q_parking_fee', text: '주차는 세대당 몇 대이고 비용은 얼마인가요?' },
  { id: 'q_pet', text: '반려동물을 키울 수 있나요?' },
  { id: 'q_move_in', text: '입주 가능일이 언제인가요?' },
  { id: 'q_trash_rule', text: '음식물·일반 쓰레기는 언제 어디에 배출하나요?' },
  { id: 'q_etc', text: '그 밖에 물어본 것' }
];

// ---------- 최종 판단 3지선다 ----------

export const DECISIONS = [
  { id: 'proceed', label: '계약을 고려한다' },
  { id: 'hold', label: '보류한다' },
  { id: 'reject', label: '포기한다' }
];

// ---------- 파생 상수 (검증용, 계산에도 사용) ----------

export const CORE_ITEMS = ITEMS.filter((it) => it.tier === 'core');
export const OPTIONAL_ITEMS = ITEMS.filter((it) => it.tier === 'optional');
export const CORE_ITEM_COUNT = CORE_ITEMS.length; // 31
export const TOTAL_ITEM_COUNT = ITEMS.length; // 50

// itemId → item 정의 조회용 맵
export const ITEMS_BY_ID = {};
ITEMS.forEach((it) => {
  ITEMS_BY_ID[it.id] = it;
});

// categoryId → 그 카테고리의 문항 배열
export const ITEMS_BY_CATEGORY = {};
CATEGORIES.forEach((cat) => {
  ITEMS_BY_CATEGORY[cat.id] = [];
});
ITEMS.forEach((it) => {
  ITEMS_BY_CATEGORY[it.category].push(it);
});
