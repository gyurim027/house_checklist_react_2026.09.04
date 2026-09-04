import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { ITEMS_BY_CATEGORY } from '../../data/checklistData.js';
import { categoryStats } from '../../lib/scoring.js';
import { ItemRow } from './ItemRow.jsx';
import { NoiseBlock } from './NoiseBlock.jsx';
import { cx } from '../../lib/classNames.js';
import styles from './CategoryCard.module.css';

// props: category (CATEGORIES의 원소 하나).
export function CategoryCard({ category }) {
  const { currentInspection, toggleCategoryExpanded, toggleOptionalExpanded, setCategoryMemo } =
    useInspection();

  const items = ITEMS_BY_CATEGORY[category.id] || [];
  const coreItems = items.filter((item) => item.tier === 'core');
  const optionalItems = items.filter((item) => item.tier === 'optional');

  const stats = categoryStats(currentInspection, category.id);
  const isExpanded = currentInspection.ui.expandedCategories.includes(category.id);
  const isOptionalExpanded = currentInspection.ui.optionalExpanded.includes(category.id);
  const memo = currentInspection.categoryMemos[category.id] ?? '';

  return (
    <section className={styles.card}>
      <button
        type="button"
        className={styles.header}
        aria-expanded={isExpanded}
        onClick={() => toggleCategoryExpanded(category.id)}
      >
        <span className={styles.label}>{category.label}</span>
        <span className={styles.stats}>
          응답 {stats.answered}/{stats.total}
          {stats.poor > 0 ? ` · 미흡 ${stats.poor}` : ''}
        </span>
      </button>

      {isExpanded && (
        <div className={styles.body}>
          {category.hint && <p className={styles.hint}>{category.hint}</p>}

          <div className={styles.items}>
            {coreItems.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>

          {category.id === 'E_noise' && <NoiseBlock />}

          {optionalItems.length > 0 && (
            <>
              <button
                type="button"
                className={styles.optionalToggle}
                onClick={() => toggleOptionalExpanded(category.id)}
              >
                {isOptionalExpanded ? '접기' : `+ 더 볼 항목 ${optionalItems.length}개`}
              </button>
              {isOptionalExpanded && (
                <div className={cx(styles.items, styles.optionalItems)}>
                  {optionalItems.map((item) => (
                    <ItemRow key={item.id} item={item} />
                  ))}
                </div>
              )}
            </>
          )}

          <label className={styles.memoField}>
            <span className={styles.memoLabel}>카테고리 메모</span>
            <textarea
              className={styles.memoInput}
              rows={2}
              placeholder="이 카테고리에서 기록해 둘 것이 있나요?"
              value={memo}
              onChange={(event) => setCategoryMemo(category.id, event.target.value)}
            />
          </label>
        </div>
      )}
    </section>
  );
}
