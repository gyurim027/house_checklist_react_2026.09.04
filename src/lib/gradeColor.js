// 등급 4색(초록/노랑/주황/빨강)은 앱 전체에서 ScoreGradeCard(체크리스트 결과)와
// CompareInspectionCard(Task 20 매물 비교 카드) 두 곳에서만 쓴다(계획 Global
// Constraints). "좋음" 상태의 옅은 파랑과 절대 혼동되지 않도록, calcGrade가 반환하는
// color 문자열을 그대로 키로만 조회한다.
export const GRADE_COLOR_VAR = {
  green: 'var(--grade-green)',
  yellow: 'var(--grade-yellow)',
  orange: 'var(--grade-orange)',
  red: 'var(--grade-red)',
};
