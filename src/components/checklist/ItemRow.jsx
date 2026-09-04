import { useState } from 'react';
import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { STATUS, SEVERITY_LABEL } from '../../data/checklistData.js';
import { cx } from '../../lib/classNames.js';
import styles from './ItemRow.module.css';

// props: item (ITEMS의 원소 하나).
// 루트 엘리먼트에 id={`checklist-item-${item.id}`}를 반드시 부여한다 —
// 향후 Task(결과화면)의 "미흡 항목 클릭 → 스크롤" 기능이 이 id 형식에 의존한다.
export function ItemRow({ item }) {
  const { currentInspection, setItemStatus, setItemMemo } = useInspection();
  const entry = currentInspection.items[item.id];
  const status = entry ? entry.status : null;
  const memo = entry ? entry.memo : '';

  // 메모창의 수동 펼침 상태. 세션 한정(useState) — 저장하지 않는다.
  const [manualMemoOpen, setManualMemoOpen] = useState(false);
  const isPoor = status === STATUS.POOR;
  const memoOpen = isPoor || manualMemoOpen;

  const handleStatusClick = (nextStatus) => {
    setItemStatus(item.id, nextStatus);
  };

  return (
    <div id={`checklist-item-${item.id}`} className={styles.row}>
      <div className={styles.top}>
        <div className={styles.textCol}>
          <span
            className={cx(
              styles.severityBadge,
              isPoor ? styles[`severity-${item.severity}`] : styles.severityNeutral
            )}
          >
            {SEVERITY_LABEL[item.severity]}
          </span>
          <p className={styles.text}>{item.text}</p>
        </div>
      </div>
      <div className={styles.controls}>
        <div className={styles.statusButtons}>
          <button
            type="button"
            className={cx(styles.statusBtn, styles.poorBtn, status === STATUS.POOR && styles.active)}
            aria-pressed={status === STATUS.POOR}
            onClick={() => handleStatusClick(STATUS.POOR)}
          >
            미흡
          </button>
          <button
            type="button"
            className={cx(styles.statusBtn, styles.fineBtn, status === STATUS.FINE && styles.active)}
            aria-pressed={status === STATUS.FINE}
            onClick={() => handleStatusClick(STATUS.FINE)}
          >
            양호
          </button>
          <button
            type="button"
            className={cx(styles.statusBtn, styles.greatBtn, status === STATUS.GREAT && styles.active)}
            aria-pressed={status === STATUS.GREAT}
            onClick={() => handleStatusClick(STATUS.GREAT)}
          >
            좋음
          </button>
          {item.allowNA && (
            <button
              type="button"
              className={cx(styles.statusBtn, styles.naBtn, status === STATUS.NA && styles.active)}
              aria-pressed={status === STATUS.NA}
              aria-label="해당없음"
              onClick={() => handleStatusClick(STATUS.NA)}
            >
              —
            </button>
          )}
        </div>
        {!isPoor && (
          <button
            type="button"
            className={styles.memoToggle}
            onClick={() => setManualMemoOpen((prev) => !prev)}
          >
            {manualMemoOpen ? '메모 접기' : memo ? '메모 보기' : '+메모'}
          </button>
        )}
      </div>
      {memoOpen && (
        <label className={styles.memoField}>
          {isPoor && <span className={styles.memoLabel}>무엇이 미흡했나요?</span>}
          <textarea
            className={styles.memoInput}
            rows={2}
            value={memo}
            onChange={(event) => setItemMemo(item.id, event.target.value)}
          />
        </label>
      )}
    </div>
  );
}
