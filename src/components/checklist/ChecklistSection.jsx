import { GROUPS, CATEGORIES } from '../../data/checklistData.js';
import { CategoryCard } from './CategoryCard.jsx';
import styles from './ChecklistSection.module.css';

// GROUPS를 순회하며 그룹 라벨 + 해당 그룹의 CATEGORIES를 순회해 CategoryCard를 렌더한다.
export function ChecklistSection() {
  return (
    <div className={styles.section}>
      {GROUPS.map((group) => (
        <div key={group.id} className={styles.group}>
          <h2 className={styles.groupLabel}>{group.label}</h2>
          <div className={styles.categories}>
            {CATEGORIES.filter((category) => category.group === group.id).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
