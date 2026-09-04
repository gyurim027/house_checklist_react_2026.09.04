import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { TimeScrollPicker } from './TimeScrollPicker.jsx';
import styles from './VisitInfoCard.module.css';

// 방문일(날짜 입력, immediate) + 방문시간(스크롤 선택기, 확정 즉시 저장) 필드 그룹.
// 온보딩 마법사(Task 11)와 체크리스트 화면 상단 카드가 동일하게 재사용한다.
export function VisitScheduleFields() {
  const { currentInspection, updateVisitField } = useInspection();
  const visit = currentInspection.visit;

  return (
    <div className={styles.grid}>
      <label className={styles.field}>
        <span className={styles.label}>방문일</span>
        <input
          type="date"
          className={styles.input}
          value={visit.date}
          onChange={(event) => updateVisitField('date', event.target.value, { immediate: true })}
        />
      </label>
      <div className={styles.field}>
        <span className={styles.label}>방문시간</span>
        <TimeScrollPicker
          value={visit.time}
          onChange={(next) => updateVisitField('time', next, { immediate: true })}
        />
      </div>
    </div>
  );
}
