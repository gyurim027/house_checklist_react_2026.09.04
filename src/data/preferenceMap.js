// 「집 보러 갈 때 10분 체크」 React 재구현 — 선호 조건(선호 태그) 매핑 (Task 19)
// PA-PRF-01(온보딩)과 PA-MYP-01(마이)에서 쓰는 12개 선호 태그와, 각 태그가
// 체크리스트 데이터(카테고리/문항/중개사질문)·방문정보 필드 중 어디를 가리키는지의
// 매핑 테이블. Task 20(비교 화면)이 getPreferenceHighlights()로 이 매핑을 읽어
// "내가 중요하게 보는 것" 하이라이트를 계산한다.
//
// 아래 표는 사용자가 이미 승인한 태스크 브리프의 원문 매핑을 그대로 옮긴 것이다 —
// 절대 임의로 항목을 추가/생략/변경하지 말 것. id/label 철자는 checklistData.js의
// 실제 정의(CATEGORIES/ITEMS/QUESTIONS)와 대조 확인했다.
//
// categoryIds에 적힌 "(전체)"는 그 카테고리 전체를 가리킨다는 뜻(예: noise/E_noise —
// 이 카테고리엔 별도 itemIds가 없다). "(부분)"은 카테고리 중 일부만 관련 있다는
// 뜻이며, 실제 대상은 itemIds로 별도 명시된다(예: locationTransit/B_parking_around —
// transit_walk·slope_stairs 두 문항만 해당, B의 나머지 문항인 parking_space·
// parking_access·night_route는 다른 태그(parking/security) 소관). 브리프 표의 셀
// 값은 그대로 옮기되, 이 주석으로 (전체)/(부분) 의미만 기록해 Task 20 구현자가
// 카테고리 전체 하이라이트 여부를 판단할 근거를 남긴다.

export const PREFERENCE_TAGS = [
  { id: 'price', label: '가격' },
  { id: 'contractTerms', label: '계약 조건' },
  { id: 'locationTransit', label: '위치/교통' },
  { id: 'livingEnv', label: '주변 생활 환경' },
  { id: 'size', label: '면적' },
  { id: 'daylight', label: '채광' },
  { id: 'noise', label: '소음' },
  { id: 'hygiene', label: '위생' },
  { id: 'facilityCondition', label: '내부 시설 상태' },
  { id: 'parking', label: '주차' },
  { id: 'security', label: '치안' },
  { id: 'pet', label: '반려동물 가능 여부' },
];

// tagId → { categoryIds, itemIds, questionIds, visitFields }
// 각 배열은 checklistData.js의 실제 id 철자와 대조 확인된 값만 담는다.
// visitFields는 insp.visit.* 필드명이 기본이며, contractTerms 태그의
// 'decision.needsNegotiation'/'decision.negotiationMemo'만 예외적으로
// insp.decision.* 경로를 "decision." 접두사로 표기한다(브리프 원문 그대로).
export const PREFERENCE_MAPPING = {
  price: {
    categoryIds: [],
    itemIds: [],
    questionIds: ['q_management_fee'],
    visitFields: [
      'dealType',
      'jeonseAmount',
      'maemaeAmount',
      'wolseDepositType',
      'wolseDeposit',
      'wolseRent',
      'managementFeeType',
      'managementFeeAmount',
    ],
  },
  contractTerms: {
    categoryIds: [],
    itemIds: [],
    questionIds: ['q_move_in', 'q_repair_history'],
    visitFields: ['dealType', 'decision.needsNegotiation', 'decision.negotiationMemo'],
  },
  locationTransit: {
    categoryIds: ['B_parking_around'], // 부분 — 실제 대상은 itemIds 참고
    itemIds: ['transit_walk', 'slope_stairs'],
    questionIds: [],
    visitFields: [],
  },
  livingEnv: {
    categoryIds: [],
    itemIds: ['trash_area', 'view_block'],
    questionIds: ['q_trash_rule'],
    visitFields: [],
  },
  size: {
    categoryIds: [],
    itemIds: ['furniture_space', 'closet_size', 'kitchen_space'],
    questionIds: [],
    visitFields: [],
  },
  daylight: {
    categoryIds: [],
    itemIds: ['daylight', 'view_block'],
    questionIds: [],
    visitFields: [],
  },
  noise: {
    categoryIds: ['E_noise'], // 전체
    itemIds: [],
    questionIds: [],
    visitFields: ['noiseLevel'],
  },
  hygiene: {
    categoryIds: [],
    itemIds: [
      'smell_indoor',
      'mold_black',
      'leak_stain',
      'condensation',
      'sink_undercabinet',
      'mold_bath',
      'smell_drain_bath',
      'aircon_mold',
      'common_clean',
    ],
    questionIds: [],
    visitFields: [],
  },
  facilityCondition: {
    categoryIds: [],
    itemIds: [
      'window_open',
      'window_lock',
      'window_screen',
      'hotwater_kitchen',
      'drain_kitchen',
      'water_pressure_kitchen',
      'hotwater_bath',
      'water_pressure_bath',
      'drain_bath',
      'vent_fan',
      'tile_toilet',
      'heating_boiler',
      'lights_switch',
      'outlet_count',
      'aircon_state',
      'mobile_signal',
      'door_entrance',
      'door_inner',
      'floor_level',
      'washer_space',
    ],
    questionIds: ['q_repair_history'],
    visitFields: [],
  },
  parking: {
    categoryIds: [],
    itemIds: ['parking_space', 'parking_access'],
    questionIds: ['q_parking_fee'],
    visitFields: [],
  },
  security: {
    categoryIds: [],
    itemIds: ['entrance_lock', 'night_route'],
    questionIds: [],
    visitFields: [],
  },
  pet: {
    categoryIds: [],
    itemIds: [],
    questionIds: ['q_pet'],
    visitFields: [],
  },
};

// 선택된 태그 id 배열을 받아 그 매핑을 합집합으로 합친다.
// 존재하지 않는 tagId는 조용히 무시한다(방어적 — 저장된 selected에 옛 slug가
// 남아있는 경우를 대비).
export function getPreferenceHighlights(selectedTagIds) {
  const categoryIds = new Set();
  const itemIds = new Set();
  const questionIds = new Set();
  const visitFields = new Set();

  (selectedTagIds || []).forEach((tagId) => {
    const mapping = PREFERENCE_MAPPING[tagId];
    if (!mapping) return;
    mapping.categoryIds.forEach((id) => categoryIds.add(id));
    mapping.itemIds.forEach((id) => itemIds.add(id));
    mapping.questionIds.forEach((id) => questionIds.add(id));
    mapping.visitFields.forEach((field) => visitFields.add(field));
  });

  return { categoryIds, itemIds, questionIds, visitFields };
}
