// 「집 보러 갈 때 10분 체크」 v2.0 — 점수·확인율 계산 (DOM 비의존 순수함수)
// 기획서 01_체크리스트_정보구조.md §4, §6 기준.
// 레거시 04_house_checklist/js/scoring.js의 확인율 관련 함수를 그대로 포팅하고,
// 점수/등급/미흡목록/장점목록/게이트 관련 함수를 §4 기준으로 신규 구현한다.

import {
  STATUS,
  SEVERITY_PENALTY,
  CATEGORIES,
  ITEMS,
  ITEMS_BY_CATEGORY,
  CORE_ITEMS,
  CORE_ITEM_COUNT,
} from '../data/checklistData.js';

// ---------- 포팅: 레거시 scoring.js와 동일 시그니처/동작 ----------

export function isAnswered(status) {
  return status === STATUS.POOR || status === STATUS.FINE || status === STATUS.GREAT;
}

export function isNA(status) {
  return status === STATUS.NA;
}

export function getItemStatus(inspection, itemId) {
  const entry = inspection.items[itemId];
  return entry ? entry.status || null : null;
}

// §6: 핵심 항목은 해당없음만 아니면 분모에 포함(응답 여부 무관).
//     선택 항목은 응답한 것만(해당없음 제외) 분모에 포함 — 펼치지 않았으면 계산에서 아예 빠진다.
export function countsTowardDenominator(item, status) {
  if (item.tier === 'core') return !isNA(status);
  return isAnswered(status);
}

// 카테고리 헤더 "응답 n/m · 미흡 k"에 쓰는 카테고리별 집계
export function categoryStats(inspection, categoryId) {
  const items = ITEMS_BY_CATEGORY[categoryId] || [];
  let total = 0;
  let answered = 0;
  let poor = 0;
  items.forEach((item) => {
    const status = getItemStatus(inspection, item.id);
    if (countsTowardDenominator(item, status)) total++;
    if (isAnswered(status)) {
      answered++;
      if (status === STATUS.POOR) poor++;
    }
  });
  return { total, answered, poor };
}

// 전체 확인율(§6) — 상단 확인 현황과 §4.4 60% 게이트가 공유하는 동일한 값
export function calcCompletionRate(inspection) {
  let total = 0;
  let answered = 0;
  let naCount = 0;
  ITEMS.forEach((item) => {
    const status = getItemStatus(inspection, item.id);
    // "해당없음 n개 제외" 표기는 분모를 실제로 줄인 경우만 센다.
    // 선택 항목의 해당없음은 애초에 분모에 들어간 적이 없으므로(응답한 것만 포함) 여기서 세지 않는다.
    if (item.tier === 'core' && isNA(status)) naCount++;
    if (countsTowardDenominator(item, status)) total++;
    if (isAnswered(status)) answered++;
  });
  const rate = total === 0 ? 0 : Math.round((answered / total) * 100);
  return { rate, answered, total, naCount };
}

// 게이트 안내 문구("핵심 31개 중 13개 응답")에 쓰는 핵심 문항 전용 카운트
export function coreAnsweredCount(inspection) {
  let answered = 0;
  CORE_ITEMS.forEach((item) => {
    if (isAnswered(getItemStatus(inspection, item.id))) answered++;
  });
  return answered;
}

// ---------- 신규 구현 (기획서 §4 기준) ----------

// §4.2 — 점수 계산
export function calcScore(inspection) {
  let criticalPoorCount = 0;
  let majorPoorCount = 0;
  let minorPoorCount = 0;

  ITEMS.forEach((item) => {
    const status = getItemStatus(inspection, item.id);
    if (status !== STATUS.POOR) return;
    if (item.severity === 'critical') criticalPoorCount++;
    else if (item.severity === 'major') majorPoorCount++;
    else if (item.severity === 'minor') minorPoorCount++;
  });

  const noiseUnlivable = inspection.noiseLevel === 'unlivable';
  if (noiseUnlivable) criticalPoorCount++;

  const score = Math.max(
    0,
    100 -
      criticalPoorCount * SEVERITY_PENALTY.critical -
      majorPoorCount * SEVERITY_PENALTY.major -
      minorPoorCount * SEVERITY_PENALTY.minor
  );

  return { score, criticalPoorCount, majorPoorCount, minorPoorCount, noiseUnlivable };
}

// §4.3 — 등급 (판정 순서: 위험→주의→보통→양호, 먼저 걸리는 조건이 확정)
export function calcGrade(score, criticalPoorCount) {
  if (score < 50 || criticalPoorCount >= 2) {
    return { id: 'danger', label: '위험', color: 'red', guidance: '계약 전 반드시 재확인이 필요합니다.' };
  }
  if (score < 70 || criticalPoorCount >= 1) {
    return {
      id: 'caution',
      label: '주의',
      color: 'orange',
      guidance: '거주 후 불편이 예상됩니다. 다른 집과 비교해 보시길 권합니다.',
    };
  }
  if (score <= 84) {
    return {
      id: 'fair',
      label: '보통',
      color: 'yellow',
      guidance: '치명적인 문제는 없지만 아쉬운 점이 있습니다. 조건 협의 여지를 확인해 보세요.',
    };
  }
  return {
    id: 'good',
    label: '양호',
    color: 'green',
    guidance: '큰 결격 사유가 발견되지 않았습니다. 계약 검토를 진행해도 좋습니다.',
  };
}

const SEVERITY_RANK = { critical: 0, major: 1, minor: 2 };

const CATEGORY_RANK = {};
CATEGORIES.forEach((cat, idx) => {
  CATEGORY_RANK[cat.id] = idx;
});

// §4.5 — 미흡 항목 자동 목록. 정렬: 치명→중요→참고, 그 안에서 CATEGORIES 선언 순.
// noiseLevel==='unlivable'이면 synthetic 이슈를 다른 치명 항목들보다도 먼저(치명 그룹의 맨 앞) 삽입한다.
export function collectIssues(inspection) {
  const issues = [];

  ITEMS.forEach((item) => {
    const status = getItemStatus(inspection, item.id);
    if (status !== STATUS.POOR) return;
    const entry = inspection.items[item.id];
    issues.push({
      itemId: item.id,
      categoryId: item.category,
      severity: item.severity,
      text: item.text,
      memo: (entry && entry.memo) || '',
      synthetic: false,
    });
  });

  issues.sort((a, b) => {
    const sevDiff = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
    if (sevDiff !== 0) return sevDiff;
    return CATEGORY_RANK[a.categoryId] - CATEGORY_RANK[b.categoryId];
  });

  if (inspection.noiseLevel === 'unlivable') {
    issues.unshift({
      itemId: null,
      categoryId: 'E_noise',
      severity: 'critical',
      text: '소음(거주 곤란)',
      memo: '',
      synthetic: true,
    });
  }

  return issues;
}

// §4.6 — 좋았던 점: 좋음 상태 자동목록(실시간) + 사용자가 직접 추가한 evaluation.pros(최대 3개, 그 이상은 UI 단에서 막음 — 여기선 그대로 반환)
export function collectHighlights(inspection) {
  const autoItems = [];

  ITEMS.forEach((item) => {
    const status = getItemStatus(inspection, item.id);
    if (status !== STATUS.GREAT) return;
    autoItems.push({ itemId: item.id, categoryId: item.category, text: item.text });
  });

  return { autoItems, pros: inspection.evaluation.pros.slice(0, 3) };
}

// §4.4 — 60% 게이트. calcCompletionRate와 동일 값 사용.
export function getResultsGateInfo(inspection) {
  const { rate, answered, total } = calcCompletionRate(inspection);
  return {
    rate,
    isUnlocked: rate >= 60,
    coreAnswered: coreAnsweredCount(inspection),
    coreTotal: CORE_ITEM_COUNT,
    itemsNeeded: Math.max(0, Math.ceil(total * 0.6) - answered),
  };
}

// "아직 확인 안 한 항목 보기" — core 항목 중 status===null(미응답)이 하나라도 있는 카테고리 id 목록
export function categoriesWithUnansweredCoreItems(inspection) {
  const result = [];
  CATEGORIES.forEach((cat) => {
    const items = ITEMS_BY_CATEGORY[cat.id] || [];
    const hasUnanswered = items.some(
      (item) => item.tier === 'core' && getItemStatus(inspection, item.id) === null
    );
    if (hasUnanswered) result.push(cat.id);
  });
  return result;
}
