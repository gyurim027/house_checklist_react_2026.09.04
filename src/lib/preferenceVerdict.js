// 선호조건(태그) × 매물 → 3상태 판정 (Task 20, design spec §3).
// 새로운 점수 체계가 아니다 — 사용자가 이미 선택한 항목/질문/방문정보에서 그대로
// 읽히는 사실을 "충족/미흡 있음/미확인"으로 요약할 뿐이다.
import { STATUS, ITEMS_BY_CATEGORY } from '../data/checklistData.js';
import { getItemStatus } from './scoring.js';
import { PREFERENCE_MAPPING, PREFERENCE_TAGS } from '../data/preferenceMap.js';

export const VERDICT = { SATISFIED: 'satisfied', ISSUES: 'issues', UNCONFIRMED: 'unconfirmed' };
export const VERDICT_LABEL = { satisfied: '충족', issues: '미흡 있음', unconfirmed: '미확인' };

const TAG_LABEL_BY_ID = {};
PREFERENCE_TAGS.forEach((tag) => {
  TAG_LABEL_BY_ID[tag.id] = tag.label;
});

// mapping.categoryIds를 실제 item id로 펼쳐 mapping.itemIds와 합친다.
export function expandMappingToItemIds(mapping) {
  const ids = new Set(mapping.itemIds);
  mapping.categoryIds.forEach((categoryId) => {
    (ITEMS_BY_CATEGORY[categoryId] || []).forEach((item) => ids.add(item.id));
  });
  return Array.from(ids);
}

// visit.*/decision.* 어디서 값을 읽을지 필드명으로 판단한다("decision." 접두사는
// preferenceMap.js의 문서화된 관례). noiseLevel은 preferenceMap.js 주석상
// "insp.visit.*"로 문서화돼 있지만, 실제 저장 스키마(storage.js buildInspectionRecord)
// 에서는 insp.visit이 아니라 최상위 insp.noiseLevel에 저장된다 — 스키마와 어긋나는
// 문서화 관례를 여기서 바로잡는다.
function readVisitField(inspection, field) {
  if (field.startsWith('decision.')) {
    const key = field.slice('decision.'.length);
    return inspection.decision[key];
  }
  if (field === 'noiseLevel') {
    return inspection.noiseLevel;
  }
  return inspection.visit[field];
}

// visitField 하나가 "긍정 신호"인지 판단한다. decision.needsNegotiation은 항상 존재하는
// boolean이라 존재 여부 자체가 무의미하므로 신호로 쓰지 않는다(그 옆의
// negotiationMemo 자유텍스트만 신호가 된다). noiseLevel은 q_pet 'no'와 동일한 이유로
// (사용자 승인) '거슬리는 수준'/'거주하기 어려운 수준'을 여기서 긍정 신호로 세지 않는다
// — 그 경우는 computeTagVerdict의 이슈 판정 단계에서 먼저 걸러진다.
function hasVisitFieldSignal(field, value) {
  if (field === 'decision.needsNegotiation') return false;
  if (field === 'noiseLevel') return value === 'quiet' || value === 'normal';
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim() !== '';
  return true;
}

export function computeTagVerdict(mapping, inspection) {
  const itemIds = expandMappingToItemIds(mapping);

  const hasPoorItem = itemIds.some((itemId) => getItemStatus(inspection, itemId) === STATUS.POOR);

  // pet 태그 특례(사용자 승인): 반려동물 '불가' 답변은 item의 poor와 동일한 우선순위로
  // "미흡 있음"을 트리거한다 — spec 원문(항목 상태만 정의)을 확장하는 결정.
  const petSaysNo = mapping.questionIds.includes('q_pet') && inspection.questions.q_pet === 'no';

  // noise 태그의 동일 취지 확장: 소음 정도가 '거슬리는 수준'/'거주하기 어려운 수준'이면
  // 해당 항목이 poor로 표시되지 않았더라도 "미흡 있음"으로 본다.
  const noiseSaysBothersome =
    mapping.visitFields.includes('noiseLevel') &&
    (inspection.noiseLevel === 'bothering' || inspection.noiseLevel === 'unlivable');

  if (hasPoorItem || petSaysNo || noiseSaysBothersome) return VERDICT.ISSUES;

  const hasPositiveItem = itemIds.some((itemId) => {
    const status = getItemStatus(inspection, itemId);
    return status === STATUS.FINE || status === STATUS.GREAT;
  });

  const hasPositiveQuestion = mapping.questionIds.some((questionId) => {
    const value = inspection.questions[questionId];
    if (questionId === 'q_pet') return value === 'yes';
    return typeof value === 'string' && value.trim() !== '';
  });

  const hasPositiveVisitField = mapping.visitFields.some((field) =>
    hasVisitFieldSignal(field, readVisitField(inspection, field))
  );

  if (hasPositiveItem || hasPositiveQuestion || hasPositiveVisitField) return VERDICT.SATISFIED;
  return VERDICT.UNCONFIRMED;
}

// 선택된 선호조건 태그 각각에 대해 한 매물의 판정을 계산한다.
// N(totalCount)은 항상 selectedTagIds.length — 사용자가 4개 미만을 선택했을 수 있으므로
// "4개 중"을 하드코딩하지 않는다.
export function summarizePreferenceVerdicts(selectedTagIds, inspection) {
  const verdicts = (selectedTagIds || [])
    .map((tagId) => {
      const mapping = PREFERENCE_MAPPING[tagId];
      if (!mapping) return null;
      return {
        tagId,
        label: TAG_LABEL_BY_ID[tagId] || tagId,
        verdict: computeTagVerdict(mapping, inspection),
      };
    })
    .filter(Boolean);

  const satisfiedCount = verdicts.filter((v) => v.verdict === VERDICT.SATISFIED).length;

  return { verdicts, satisfiedCount, totalCount: verdicts.length };
}
