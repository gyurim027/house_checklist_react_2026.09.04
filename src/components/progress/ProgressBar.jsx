import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { calcCompletionRate } from '../../lib/scoring.js';
import styles from './ProgressBar.module.css';

// 확인율 표시. 색상 사용 규칙(계획 Global Constraints)에 따라 무채색만 사용한다.
export function ProgressBar() {
  const { currentInspection } = useInspection();
  const { rate, answered, total, naCount } = calcCompletionRate(currentInspection);

  return (
    <section className={styles.wrap}>
      <div className={styles.headerRow}>
        <span className={styles.label}>확인율 {rate}%</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${rate}%` }} />
      </div>
      <p className={styles.detail}>
        {total}개 중 {answered}개 응답
        {naCount > 0 ? ` · 해당없음 ${naCount}개 제외` : ''}
      </p>
    </section>
  );
}
