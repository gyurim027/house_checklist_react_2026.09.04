import { calcScore, calcGrade, calcCompletionRate, getResultsGateInfo } from '../../lib/scoring.js';
import { GRADE_COLOR_VAR } from '../../lib/gradeColor.js';
import styles from './CompareInspectionCard.module.css';

// props: inspection, name, addressLine(공유 deriveInspectionDisplay 결과),
// verdictSummary({satisfiedCount, totalCount} — preferenceVerdict.js)
export function CompareInspectionCard({ inspection, name, addressLine, verdictSummary }) {
  const { rate } = calcCompletionRate(inspection);
  const gate = getResultsGateInfo(inspection);

  let scoreBlock;
  if (gate.isUnlocked) {
    const { score, criticalPoorCount } = calcScore(inspection);
    const grade = calcGrade(score, criticalPoorCount);
    scoreBlock = (
      <div className={styles.scoreBadge} style={{ '--grade-color': GRADE_COLOR_VAR[grade.color] }}>
        <span className={styles.score}>{score}점</span>
        <span className={styles.gradeLabel}>{grade.label}</span>
      </div>
    );
  } else {
    scoreBlock = <p className={styles.scoreLocked}>확인율 60% 미만 — 점수 비공개</p>;
  }

  return (
    <div className={styles.card}>
      <p className={styles.name}>{name}</p>
      <p className={styles.address}>{addressLine}</p>
      <p className={styles.rate}>확인율 {rate}%</p>
      {scoreBlock}
      {verdictSummary.totalCount > 0 && (
        <p className={styles.preferenceLine}>
          선호조건 {verdictSummary.totalCount}개 중 {verdictSummary.satisfiedCount}개 충족
        </p>
      )}
    </div>
  );
}
