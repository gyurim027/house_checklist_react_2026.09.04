import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { calcScore, calcGrade, calcCompletionRate } from '../../lib/scoring.js';
import styles from './ScoreGradeCard.module.css';

// 등급 4색(초록/노랑/주황/빨강)은 앱 전체에서 이 컴포넌트에서만 사용한다(계획 Global Constraints).
// "좋음" 상태의 옅은 파랑과 절대 혼동되지 않도록, calcGrade가 반환하는 color를 그대로만 사용한다.
const GRADE_COLOR_VAR = {
  green: 'var(--grade-green)',
  yellow: 'var(--grade-yellow)',
  orange: 'var(--grade-orange)',
  red: 'var(--grade-red)',
};

export function ScoreGradeCard() {
  const { currentInspection } = useInspection();
  const { score, criticalPoorCount } = calcScore(currentInspection);
  const grade = calcGrade(score, criticalPoorCount);
  // getResultsGateInfo는 rate만 노출하고 naCount를 반환하지 않으므로(scoring.js 실제 구현 확인됨),
  // ProgressBar와 동일하게 calcCompletionRate를 직접 사용해 "확인율 N% · 해당없음 K개 제외"를 만든다.
  const { rate, naCount } = calcCompletionRate(currentInspection);

  return (
    <section className={styles.card} style={{ '--grade-color': GRADE_COLOR_VAR[grade.color] }}>
      <div className={styles.badge}>
        <span className={styles.score}>{score}점</span>
        <span className={styles.dot}>·</span>
        <span className={styles.gradeLabel}>{grade.label}</span>
      </div>
      <p className={styles.disclaimer}>이 점수는 참고용입니다.</p>
      <p className={styles.guidance}>{grade.guidance}</p>
      <p className={styles.scope}>
        오늘 현장에서 눈으로 확인한 범위의 인상 점수입니다. 시세·등기·계약 조건은 포함되지 않습니다.
      </p>
      <p className={styles.rateLine}>
        확인율 {rate}%{naCount > 0 ? ` · 해당없음 ${naCount}개 제외` : ''}
      </p>
    </section>
  );
}
