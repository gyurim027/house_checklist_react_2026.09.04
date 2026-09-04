import { useInspection } from '../../context/InspectionStoreContext.jsx';
import styles from './VisitInfoCard.module.css';

// 중개사 이름/연락처 — 별도 입력 필드 2개(둘 다 자유 텍스트, 500ms debounce 저장).
// 온보딩 마법사(Task 11)와 체크리스트 화면 상단 카드가 동일하게 재사용한다.
export function RealtorFields() {
  const { currentInspection, updateVisitField } = useInspection();
  const visit = currentInspection.visit;

  return (
    <div className={styles.grid}>
      <label className={styles.field}>
        <span className={styles.label}>중개사 이름</span>
        <input
          type="text"
          className={styles.input}
          placeholder="예: ○○공인중개사"
          value={visit.realtorName}
          onChange={(event) => updateVisitField('realtorName', event.target.value)}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>연락처</span>
        <input
          type="text"
          className={styles.input}
          placeholder="예: 010-0000-0000"
          value={visit.realtorContact}
          onChange={(event) => updateVisitField('realtorContact', event.target.value)}
        />
      </label>
    </div>
  );
}
