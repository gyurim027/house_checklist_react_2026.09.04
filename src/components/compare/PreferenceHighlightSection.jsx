import { Link } from 'react-router-dom';
import { VERDICT_LABEL } from '../../lib/preferenceVerdict.js';
import { cx } from '../../lib/classNames.js';
import styles from './PreferenceHighlightSection.module.css';

// props: compared([{inspection, name, verdictSummary}], ≤3, CompareInspectionCard와
// 동일 순서), selectedTagIds
export function PreferenceHighlightSection({ compared, selectedTagIds }) {
  if (selectedTagIds.length === 0) {
    return (
      <section className={styles.section}>
        <p className={styles.empty}>
          <Link to="/me">마이</Link>에서 선호 조건을 선택하면 매물별로 충족 여부를 볼 수 있어요.
        </p>
      </section>
    );
  }

  // 모든 매물이 동일한 selectedTagIds로 계산됐으므로 태그 목록/라벨은 첫 매물 결과에서 가져온다.
  const tagRows = compared[0]?.verdictSummary.verdicts || [];

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>선호조건 비교</h2>
      <div className={styles.scrollWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.labelCell}>선호조건</th>
              {compared.map((c) => (
                <th key={c.inspection.id} className={styles.headCell}>
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tagRows.map((row, rowIndex) => (
              <tr key={row.tagId}>
                <td className={styles.labelCell}>{row.label}</td>
                {compared.map((c) => {
                  const verdict = c.verdictSummary.verdicts[rowIndex]?.verdict;
                  return (
                    <td key={c.inspection.id} className={styles.cell}>
                      <span className={cx(styles.chip, styles[verdict])}>{VERDICT_LABEL[verdict]}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.summaryRow}>
        {compared.map((c) => (
          <p key={c.inspection.id} className={styles.summaryLine}>
            {c.name}: 선호조건 {c.verdictSummary.totalCount}개 중 {c.verdictSummary.satisfiedCount}개 충족
          </p>
        ))}
      </div>
    </section>
  );
}
