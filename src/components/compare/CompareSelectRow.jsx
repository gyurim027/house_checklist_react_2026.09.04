import { deriveInspectionDisplay } from '../../lib/inspectionDisplay.js';
import { cx } from '../../lib/classNames.js';
import styles from './CompareSelectRow.module.css';

// props: inspection, index(비교 후보 목록에서의 0-based 순번), selected, disabled(3개 제한
// 도달 시 미선택 행 비활성화), onToggle
export function CompareSelectRow({ inspection, index, selected, disabled, onToggle }) {
  const { name, addressLine, rate, scoreLabel } = deriveInspectionDisplay(inspection, index);

  return (
    <li className={cx(styles.item, selected && styles.selected)}>
      <label className={styles.main}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={selected}
          disabled={disabled}
          onChange={onToggle}
        />
        <span className={styles.info}>
          <span className={styles.name}>
            {name} <span className={styles.score}>{scoreLabel}</span>
          </span>
          <span className={styles.address}>{addressLine}</span>
          <span className={styles.meta}>확인율 {rate}%</span>
        </span>
      </label>
    </li>
  );
}
