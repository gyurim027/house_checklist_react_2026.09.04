import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { getComparableInspections } from '../../lib/inspectionDisplay.js';
import { CompareSelectRow } from '../../components/compare/CompareSelectRow.jsx';
import styles from './CompareSelectPage.module.css';

const MIN_COMPARE = 2;
const MAX_COMPARE = 3;

// PA-CMS-01. 완료된(초안 제외) 체크 기록 중 최대 3개를 골라 /compare?ids=...로 넘긴다.
export function CompareSelectPage() {
  const { inspections } = useInspection();
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);

  const comparable = getComparableInspections(inspections);

  const toggle = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((existingId) => existingId !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  };

  const handleCompare = () => {
    navigate(`/compare?ids=${selectedIds.join(',')}`);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>비교할 매물 선택</h1>

      {comparable.length < MIN_COMPARE ? (
        <p className={styles.empty}>비교하려면 완료한 체크 기록이 2개 이상 필요해요.</p>
      ) : (
        <>
          <p className={styles.counter} aria-live="polite">
            {selectedIds.length}/{MAX_COMPARE} 선택됨
          </p>
          <ul className={styles.list}>
            {comparable.map((inspection, index) => (
              <CompareSelectRow
                key={inspection.id}
                inspection={inspection}
                index={index}
                selected={selectedIds.includes(inspection.id)}
                disabled={!selectedIds.includes(inspection.id) && selectedIds.length >= MAX_COMPARE}
                onToggle={() => toggle(inspection.id)}
              />
            ))}
          </ul>
          <button
            type="button"
            className={styles.compareBtn}
            disabled={selectedIds.length < MIN_COMPARE}
            onClick={handleCompare}
          >
            비교하기
          </button>
        </>
      )}
    </div>
  );
}
