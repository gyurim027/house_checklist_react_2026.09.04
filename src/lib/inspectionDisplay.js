// 저장된 매물 기록 하나를 사람이 읽는 이름/주소/확인율/점수라벨로 변환한다.
// SavedInspectionListItem(홈 목록)과 CompareSelectRow/CompareResultPage(Task 20
// 매물 비교)가 동일한 도출 규칙을 공유한다 — 화면마다 표기가 달라지면 사용자가
// 같은 매물을 다른 매물로 오인할 수 있다.
import { todayDateString } from './id.js';
import { calcCompletionRate } from './scoring.js';

export function deriveInspectionDisplay(inspection, index) {
  const name = inspection.alias || `${inspection.visit.date || todayDateString()} · ${index + 1}번째`;
  const addressLine = (inspection.property.addressText || '').split('\n')[0] || '(주소 미입력)';
  const { rate } = calcCompletionRate(inspection);
  const scoreLabel = inspection.cache.score != null && rate >= 60 ? `${inspection.cache.score}점` : '점검 중';
  return { name, addressLine, rate, scoreLabel };
}

// Task 20 매물 비교 후보 목록: 온보딩을 완료한(초안 제외) 기록만, updatedAt 내림차순.
// CompareSelectPage(선택 화면)와 CompareResultPage(결과 화면)가 이 함수로 동일한
// 정렬/필터를 공유해야 두 화면에서 같은 매물이 같은 index(=같은 fallback 이름)를
// 갖는다.
export function getComparableInspections(inspections) {
  return [...inspections]
    .filter((inspection) => inspection.ui.onboardingComplete)
    .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
}

// 홈 화면 "최근 추가된 노트" 목록을 방문 날짜(visit.date, 'YYYY-MM-DD')별로 묶는다.
// 그룹은 날짜 내림차순, 그룹 내부는 updatedAt 내림차순 — 날짜가 없으면(이론상 발생하지
// 않지만 방어적으로) '날짜 미정' 그룹으로 모은다. 반환값: [{ date, items }].
export function groupInspectionsByDate(inspections) {
  const byDate = new Map();
  inspections.forEach((inspection) => {
    const date = inspection.visit.date || '날짜 미정';
    if (!byDate.has(date)) byDate.set(date, []);
    byDate.get(date).push(inspection);
  });

  return Array.from(byDate.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, items]) => ({
      date,
      items: [...items].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')),
    }));
}
