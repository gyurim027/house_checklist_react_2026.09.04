import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { usePreferencesContext } from '../../context/PreferencesContext.jsx';
import { getComparableInspections, deriveInspectionDisplay } from '../../lib/inspectionDisplay.js';
import { summarizePreferenceVerdicts, VERDICT_LABEL } from '../../lib/preferenceVerdict.js';
import { calcCompletionRate, calcScore, calcGrade, getResultsGateInfo } from '../../lib/scoring.js';
import { CompareInspectionCard } from '../../components/compare/CompareInspectionCard.jsx';
import { PreferenceHighlightSection } from '../../components/compare/PreferenceHighlightSection.jsx';
import { FullComparisonTable } from '../../components/compare/FullComparisonTable.jsx';
import { GeminiSummarySection } from '../../components/compare/GeminiSummarySection.jsx';
import styles from './CompareResultPage.module.css';

const MIN_COMPARE = 2;
const MAX_COMPARE = 3;

// §3의 결정적 사실(확인율/게이팅된 점수·등급/선호조건 판정)만으로 Gemini 프롬프트용
// 한국어 사실 문자열을 만든다. 원시 항목별 상태는 포함하지 않는다(프롬프트 절약,
// "이미 계산된 사실만" 원칙).
function buildFacts(compared) {
  return compared
    .map(({ inspection, name, verdictSummary }) => {
      const { rate } = calcCompletionRate(inspection);
      const gate = getResultsGateInfo(inspection);
      let scoreText = '점수 비공개 (확인율 60% 미만)';
      if (gate.isUnlocked) {
        const { score, criticalPoorCount } = calcScore(inspection);
        const grade = calcGrade(score, criticalPoorCount);
        scoreText = `점수 ${score}점(${grade.label})`;
      }
      const tagText = verdictSummary.verdicts.map((v) => `${v.label}: ${VERDICT_LABEL[v.verdict]}`).join(', ');
      const prefText =
        verdictSummary.totalCount > 0
          ? `선호조건 ${verdictSummary.totalCount}개 중 ${verdictSummary.satisfiedCount}개 충족 — ${tagText}`
          : '선택된 선호조건 없음';
      return `${name}: 확인율 ${rate}%, ${scoreText}, ${prefText}`;
    })
    .join('\n');
}

// PA-CMP-01. URL(?ids=id1,id2,id3)을 신뢰하지 않고 실제 완료된 매물 목록에서 찾은
// 것만 사용한다 — 유효한 것이 2개 미만이면 선택 화면으로 되돌린다.
export function CompareResultPage() {
  const [searchParams] = useSearchParams();
  const { inspections } = useInspection();
  const { selected: selectedTagIds } = usePreferencesContext();

  const requestedIds = (searchParams.get('ids') || '').split(',').filter(Boolean);
  const comparable = getComparableInspections(inspections);

  const compared = requestedIds
    .map((id) => {
      const index = comparable.findIndex((insp) => insp.id === id);
      if (index === -1) return null;
      const inspection = comparable[index];
      const display = deriveInspectionDisplay(inspection, index);
      const verdictSummary = summarizePreferenceVerdicts(selectedTagIds, inspection);
      return { inspection, name: display.name, addressLine: display.addressLine, verdictSummary };
    })
    .filter(Boolean)
    .slice(0, MAX_COMPARE);

  if (compared.length < MIN_COMPARE) {
    return <Navigate to="/compare/select" replace />;
  }

  const facts = buildFacts(compared);

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>비교 결과</h1>
        <Link to="/compare/select" className={styles.reselectLink}>
          다시 선택
        </Link>
      </div>

      <div className={styles.cardRow}>
        {compared.map((c) => (
          <CompareInspectionCard
            key={c.inspection.id}
            inspection={c.inspection}
            name={c.name}
            addressLine={c.addressLine}
            verdictSummary={c.verdictSummary}
          />
        ))}
      </div>

      <GeminiSummarySection facts={facts} />

      <PreferenceHighlightSection compared={compared} selectedTagIds={selectedTagIds} />

      <FullComparisonTable compared={compared} />
    </div>
  );
}
