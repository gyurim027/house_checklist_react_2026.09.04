import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { collectIssues } from '../../lib/scoring.js';
import { SEVERITY_LABEL } from '../../data/checklistData.js';
import { cx } from '../../lib/classNames.js';
import styles from './IssuesList.module.css';

// collectIssues()가 이미 치명→중요→참고, 그 안에서 카테고리 선언 순으로 정렬해 반환하므로
// 여기서 다시 정렬하지 않는다. synthetic(소음) 행은 항목 id가 없어 스크롤 대상이 없으므로
// 클릭 비활성(버튼이 아닌 div로 렌더)로 처리한다.
export function IssuesList() {
  const { currentInspection, expandCategory } = useInspection();
  const issues = collectIssues(currentInspection);

  const handleClick = (issue) => {
    expandCategory(issue.categoryId);
    document
      .getElementById(`checklist-item-${issue.itemId}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>미흡으로 표시한 항목 ({issues.length})</h2>
      {issues.length === 0 ? (
        <p className={styles.empty}>미흡으로 표시한 항목이 없습니다.</p>
      ) : (
        <ul className={styles.list}>
          {issues.map((issue) => {
            const key = issue.itemId ?? `synthetic-${issue.categoryId}`;
            const content = (
              <>
                <span className={cx(styles.severityBadge, styles[`severity-${issue.severity}`])}>
                  {SEVERITY_LABEL[issue.severity]}
                </span>
                <span className={styles.textCol}>
                  <span className={styles.text}>{issue.text}</span>
                  {issue.memo && <span className={styles.memo}>{issue.memo}</span>}
                </span>
              </>
            );
            return (
              <li key={key}>
                {issue.synthetic ? (
                  <div className={cx(styles.row, styles.nonClickable)}>{content}</div>
                ) : (
                  <button type="button" className={styles.row} onClick={() => handleClick(issue)}>
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
