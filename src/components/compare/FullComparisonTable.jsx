import { useState } from 'react';
import { CATEGORIES, ITEMS_BY_CATEGORY, STATUS } from '../../data/checklistData.js';
import { getItemStatus } from '../../lib/scoring.js';
import { cx } from '../../lib/classNames.js';
import styles from './FullComparisonTable.module.css';

const STATUS_LABEL = {
  [STATUS.POOR]: '미흡',
  [STATUS.FINE]: '양호',
  [STATUS.GREAT]: '좋음',
  [STATUS.NA]: '해당없음',
};
const UNANSWERED_LABEL = '미응답';

function statusChipClass(status) {
  if (status === STATUS.POOR) return styles.poor;
  if (status === STATUS.FINE) return styles.fine;
  if (status === STATUS.GREAT) return styles.great;
  if (status === STATUS.NA) return styles.na;
  return styles.unanswered;
}

function ItemCompareRow({ item, compared }) {
  return (
    <tr>
      <td className={styles.itemCell}>{item.text}</td>
      {compared.map((c) => {
        const status = getItemStatus(c.inspection, item.id);
        return (
          <td key={c.inspection.id} className={styles.statusCell}>
            <span className={cx(styles.statusChip, statusChipClass(status))}>
              {status ? STATUS_LABEL[status] : UNANSWERED_LABEL}
            </span>
          </td>
        );
      })}
    </tr>
  );
}

// props: compared([{inspection, name}], ≤3, CompareInspectionCard와 동일 순서)
export function FullComparisonTable({ compared }) {
  const [expandedCategoryIds, setExpandedCategoryIds] = useState([]);
  const [expandedOptionalIds, setExpandedOptionalIds] = useState([]);

  const toggleCategory = (categoryId) => {
    setExpandedCategoryIds((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const toggleOptional = (categoryId) => {
    setExpandedOptionalIds((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>전체 항목 비교</h2>
      <div className={styles.scrollWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.itemHeadCell}>항목</th>
              {compared.map((c) => (
                <th key={c.inspection.id} className={styles.headCell}>
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          {CATEGORIES.map((category) => {
            const isExpanded = expandedCategoryIds.includes(category.id);
            const isOptionalExpanded = expandedOptionalIds.includes(category.id);
            const items = ITEMS_BY_CATEGORY[category.id] || [];
            const coreItems = items.filter((item) => item.tier === 'core');
            const optionalItems = items.filter((item) => item.tier === 'optional');

            return (
              <tbody key={category.id}>
                <tr>
                  <td colSpan={compared.length + 1} className={styles.categoryHeadCell}>
                    <button
                      type="button"
                      className={styles.categoryToggle}
                      aria-expanded={isExpanded}
                      onClick={() => toggleCategory(category.id)}
                    >
                      <span>{category.label}</span>
                      <span className={cx(styles.chevron, isExpanded && styles.chevronOpen)} aria-hidden="true">
                        ▾
                      </span>
                    </button>
                  </td>
                </tr>
                {isExpanded &&
                  coreItems.map((item) => <ItemCompareRow key={item.id} item={item} compared={compared} />)}
                {isExpanded && optionalItems.length > 0 && (
                  <tr>
                    <td colSpan={compared.length + 1} className={styles.optionalToggleCell}>
                      <button
                        type="button"
                        className={styles.optionalToggle}
                        onClick={() => toggleOptional(category.id)}
                      >
                        {isOptionalExpanded ? '접기' : `+ 더 볼 항목 ${optionalItems.length}개`}
                      </button>
                    </td>
                  </tr>
                )}
                {isExpanded &&
                  isOptionalExpanded &&
                  optionalItems.map((item) => <ItemCompareRow key={item.id} item={item} compared={compared} />)}
              </tbody>
            );
          })}
        </table>
      </div>
    </section>
  );
}
