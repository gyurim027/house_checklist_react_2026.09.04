import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { useUiFeedback } from '../../context/UiFeedbackContext.jsx';
import { calcCompletionRate } from '../../lib/scoring.js';
import { todayDateString } from '../../lib/id.js';
import { cx } from '../../lib/classNames.js';
import styles from './SavedInspectionListItem.module.css';

// props: inspection, index(정렬된 목록에서의 0-based 순번, alias 없을 때 "N번째"로 표시)
export function SavedInspectionListItem({ inspection, index }) {
  const { currentInspection, loadInspection, deleteInspection } = useInspection();
  const { showConfirm } = useUiFeedback();

  const name = inspection.alias || `${inspection.visit.date || todayDateString()} · ${index + 1}번째`;
  const addressLine = (inspection.property.addressText || '').split('\n')[0] || '(주소 미입력)';
  const { rate } = calcCompletionRate(inspection);
  const scoreLabel =
    inspection.cache.score != null && rate >= 60 ? `${inspection.cache.score}점` : '점검 중';
  const isCurrent = currentInspection?.id === inspection.id;

  const handleDelete = (event) => {
    event.stopPropagation();
    showConfirm(
      '이 체크 기록을 삭제하시겠습니까?\n삭제된 기록은 복구할 수 없습니다.',
      () => deleteInspection(inspection.id),
      { confirmLabel: '삭제' }
    );
  };

  return (
    <li className={cx(styles.item, isCurrent && styles.current)}>
      <button type="button" className={styles.main} onClick={() => loadInspection(inspection.id)}>
        <p className={styles.name}>
          {name} <span className={styles.score}>{scoreLabel}</span>
        </p>
        <p className={styles.address}>{addressLine}</p>
        <p className={styles.meta}>
          {inspection.visit.date || ''} · 확인율 {rate}%
        </p>
      </button>
      <button type="button" className={styles.deleteBtn} onClick={handleDelete}>
        기록 삭제
      </button>
    </li>
  );
}
