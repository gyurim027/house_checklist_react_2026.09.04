// 「집 보러 갈 때 10분 체크」 v2.0 — 클립보드 복사용 결과 요약 텍스트 조립.
// 기획서 §11 "완료 상태" 배너에 담기는 정보(별칭/주소, 확인율, (공개 시) 점수·등급·미흡목록)를
// 사람이 읽기 좋은 일반 텍스트로 구성한다. 점수는 ui.resultRevealed가 true일 때만 포함해
// SaveBar와 동일하게 "미리 흘리지 않는다" 규칙을 지킨다.

import { CORE_ITEM_COUNT, SEVERITY_LABEL } from '../data/checklistData.js';
import { calcCompletionRate, calcGrade, calcScore, coreAnsweredCount, collectIssues } from './scoring.js';

export function buildResultsSummaryText(inspection) {
  const lines = [];

  const alias = (inspection.alias || '').trim();
  const addressText = (inspection.property?.addressText || '').trim();
  lines.push(alias || addressText ? `[${alias || '이름 없음'}]` : '[이름 없음]');
  if (addressText) lines.push(addressText);

  const { rate } = calcCompletionRate(inspection);
  const answered = coreAnsweredCount(inspection);
  lines.push(`핵심 ${CORE_ITEM_COUNT}개 중 ${answered}개 응답 (확인율 ${rate}%)`);

  if (inspection.ui?.resultRevealed) {
    const { score, criticalPoorCount } = calcScore(inspection);
    const grade = calcGrade(score, criticalPoorCount);
    lines.push(`결과: ${score}점 · ${grade.label}`);

    const issues = collectIssues(inspection);
    if (issues.length > 0) {
      lines.push('');
      lines.push(`미흡 항목 (${issues.length})`);
      issues.forEach((issue) => {
        const memo = issue.memo ? ` - ${issue.memo}` : '';
        lines.push(`- [${SEVERITY_LABEL[issue.severity]}] ${issue.text}${memo}`);
      });
    } else {
      lines.push('미흡으로 표시한 항목이 없습니다.');
    }
  }

  return lines.join('\n');
}
