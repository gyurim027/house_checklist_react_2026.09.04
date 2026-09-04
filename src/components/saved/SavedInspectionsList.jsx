import { SavedInspectionListItem } from './SavedInspectionListItem.jsx';
import styles from './SavedInspectionsList.module.css';

// inspections를 updatedAt 내림차순으로 정렬해 렌더한다.
export function SavedInspectionsList({ inspections }) {
  const sorted = [...inspections].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));

  if (sorted.length === 0) {
    return <p className={styles.empty}>아직 저장된 체크 기록이 없습니다.</p>;
  }

  return (
    <ul className={styles.list}>
      {sorted.map((inspection, index) => (
        <SavedInspectionListItem key={inspection.id} inspection={inspection} index={index} />
      ))}
    </ul>
  );
}
