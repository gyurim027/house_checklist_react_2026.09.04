import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { groupInspectionsByDate } from '../../lib/inspectionDisplay.js';
import { SavedInspectionListItem } from '../saved/SavedInspectionListItem.jsx';
import styles from './RecentNotesSection.module.css';

// 방문 날짜별로 묶은 노트 목록. 토글 없이 항상 전체를 펼쳐서 보여준다(와이어프레임
// 확정 사항) — 괄호 안 숫자는 그룹 개수가 아니라 노트 총 개수.
export function RecentNotesSection() {
  const { inspections } = useInspection();
  const groups = groupInspectionsByDate(inspections);

  let runningIndex = 0;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>최근 추가된 노트 ({inspections.length})</h2>

      {inspections.length === 0 ? (
        <p className={styles.empty}>아직 추가된 노트가 없어요.</p>
      ) : (
        groups.map((group) => (
          <div key={group.date} className={styles.group}>
            <p className={styles.dateLabel}>{group.date.replaceAll('-', '.')}</p>
            <ul className={styles.list}>
              {group.items.map((inspection) => {
                const index = runningIndex;
                runningIndex += 1;
                return (
                  <SavedInspectionListItem key={inspection.id} inspection={inspection} index={index} />
                );
              })}
            </ul>
          </div>
        ))
      )}
    </section>
  );
}
