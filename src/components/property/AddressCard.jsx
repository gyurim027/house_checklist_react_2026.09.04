import { useInspection } from '../../context/InspectionStoreContext.jsx';
import styles from './AddressCard.module.css';

// 주소(멀티라인) + 별칭. 지도 UI 없음(계획서 Global Constraints에 따라 명시적으로 제외).
// 텍스트 입력이므로 store 훅이 500ms debounce로 localStorage에 저장한다(React state는 즉시 갱신).
export function AddressCard() {
  const { currentInspection, setAddressText, setAlias } = useInspection();

  return (
    <section className={styles.card}>
      <label className={styles.field}>
        <span className={styles.label}>주소</span>
        <textarea
          className={styles.textarea}
          rows={2}
          placeholder={'예: 서울시 ○○구 ○○로 12길 3\n101동 502호'}
          value={currentInspection.property.addressText}
          onChange={(event) => setAddressText(event.target.value)}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>별칭</span>
        <input
          type="text"
          className={styles.input}
          placeholder="예: 역세권 원룸"
          value={currentInspection.alias}
          onChange={(event) => setAlias(event.target.value)}
        />
      </label>
    </section>
  );
}
