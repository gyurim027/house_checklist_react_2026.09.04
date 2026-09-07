import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { SavedInspectionsList } from './SavedInspectionsList.jsx';
import styles from './SavedInspectionsPanel.module.css';

// "최근 체크한 집 (N)" 토글 + "새 집 체크하기" + 펼쳐지는 목록.
// 펼침 상태는 세션 한정 로컬 상태(패널 UI 자체는 저장 대상이 아님).
export function SavedInspectionsPanel() {
  const { inspections, createInspection } = useInspection();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleNew = () => {
    createInspection();
    navigate('/new/basic');
  };

  return (
    <section className={styles.panel}>
      <div className={styles.row}>
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
        >
          최근 체크한 집 ({inspections.length})
        </button>
        <button type="button" className={styles.newBtn} onClick={handleNew}>
          새 집 체크하기
        </button>
      </div>
      {open && (
        <div className={styles.body}>
          <SavedInspectionsList inspections={inspections} />
        </div>
      )}
    </section>
  );
}
