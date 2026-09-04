import { useInspection } from '../../context/InspectionStoreContext.jsx';
import styles from './VisitInfoCard.module.css';

// 방문일/방문시간은 즉시 저장, 나머지 텍스트 필드는 500ms debounce.
export function VisitInfoCard() {
  const { currentInspection, updateVisitField } = useInspection();
  const visit = currentInspection.visit;

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>방문 정보</h2>
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
        <label className={styles.field}>
          <span className={styles.label}>방문시간</span>
          <input
            type="time"
            className={styles.input}
            value={visit.time}
            onChange={(event) => updateVisitField('time', event.target.value, { immediate: true })}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>중개사/연락처</span>
          <input
            type="text"
            className={styles.input}
            placeholder="예: ○○공인중개사 010-0000-0000"
            value={visit.realtor}
            onChange={(event) => updateVisitField('realtor', event.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>보증금/매매가</span>
          <input
            type="text"
            className={styles.input}
            placeholder="예: 1억 5천"
            value={visit.price}
            onChange={(event) => updateVisitField('price', event.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>월세</span>
          <input
            type="text"
            className={styles.input}
            placeholder="예: 60만원"
            value={visit.monthlyRent}
            onChange={(event) => updateVisitField('monthlyRent', event.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>관리비</span>
          <input
            type="text"
            className={styles.input}
            placeholder="예: 8만원"
            value={visit.managementFee}
            onChange={(event) => updateVisitField('managementFee', event.target.value)}
          />
        </label>
      </div>
    </section>
  );
}
