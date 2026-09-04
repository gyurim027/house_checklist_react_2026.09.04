import { useState } from 'react';
import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { collectHighlights } from '../../lib/scoring.js';
import styles from './HighlightsList.module.css';

const MAX_PROS = 3;

// autoItems(◎, "좋음" 상태 실시간 자동 목록, 읽기 전용) + 사용자가 직접 추가한 pros(최대 3개).
export function HighlightsList() {
  const { currentInspection, addHighlightPro, removeHighlightPro } = useInspection();
  const { autoItems, pros } = collectHighlights(currentInspection);
  const [draft, setDraft] = useState('');
  const atLimit = pros.length >= MAX_PROS;

  const handleAdd = () => {
    const text = draft.trim();
    if (!text || atLimit) return;
    addHighlightPro(text);
    setDraft('');
  };

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>좋았던 점 ({autoItems.length + pros.length})</h2>

      {autoItems.length > 0 ? (
        <ul className={styles.autoList}>
          {autoItems.map((item) => (
            <li key={item.itemId} className={styles.autoItem}>
              <span className={styles.autoIcon} aria-hidden="true">
                ◎
              </span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>&quot;좋음&quot;으로 표시한 항목이 아직 없습니다.</p>
      )}

      <hr className={styles.divider} />

      <div className={styles.customSection}>
        <h3 className={styles.subtitle}>직접 추가한 점</h3>

        {pros.length > 0 && (
          <ul className={styles.prosList}>
            {pros.map((text, index) => (
              <li key={`${index}-${text}`} className={styles.proItem}>
                <span className={styles.proText}>{text}</span>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeHighlightPro(index)}
                  aria-label="삭제"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {atLimit ? (
          <p className={styles.limitNote}>최대 3개까지 추가할 수 있습니다.</p>
        ) : (
          <div className={styles.addRow}>
            <input
              type="text"
              className={styles.input}
              placeholder="직접 좋았던 점을 적어 주세요"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleAdd();
                }
              }}
            />
            <button
              type="button"
              className={styles.addBtn}
              onClick={handleAdd}
              disabled={!draft.trim()}
            >
              + 추가
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
