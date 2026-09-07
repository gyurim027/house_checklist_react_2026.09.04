import { useState } from 'react';
import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { DEAL_TYPES } from '../../data/checklistData.js';
import { cx } from '../../lib/classNames.js';
import { AddressCard } from './AddressCard.jsx';
import { VisitInfoCard } from './VisitInfoCard.jsx';
import styles from './PropertyOverviewCard.module.css';

// Task 18: 체크리스트 화면 상단의 AddressCard+VisitInfoCard를 감싸는 접힘 카드.
// 폼 로직은 전혀 갖지 않는다 — 펼치면 두 카드를 무수정 그대로 렌더할 뿐이고,
// 이 컴포넌트가 소유하는 상태는 로컬 expanded 하나뿐(기본값 false, 즉 기본 접힘).
export function PropertyOverviewCard() {
  const { currentInspection } = useInspection();
  const [expanded, setExpanded] = useState(false);

  const summary = buildSummary(currentInspection);

  return (
    <section className={styles.card}>
      <button
        type="button"
        className={styles.header}
        aria-expanded={expanded}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <span className={styles.summary}>{summary}</span>
        <span className={expanded ? cx(styles.chevron, styles.chevronOpen) : styles.chevron} aria-hidden="true">
          ▾
        </span>
      </button>

      {expanded && (
        <div className={styles.body}>
          <AddressCard />
          <VisitInfoCard />
          <button type="button" className={styles.collapseBtn} onClick={() => setExpanded(false)}>
            접기
          </button>
        </div>
      )}
    </section>
  );
}

// 접힘 요약: "{별칭} · {주소 첫 줄} · {방문일} 방문 · {거래유형}" — 값이 비어있으면
// 해당 세그먼트만 생략한다. 전부 비었으면 안내 문구로 대체한다.
function buildSummary(inspection) {
  const segments = [];

  const alias = inspection.alias.trim();
  if (alias) segments.push(alias);

  const addressFirstLine = inspection.property.addressText.split('\n')[0].trim();
  if (addressFirstLine) segments.push(addressFirstLine);

  const date = inspection.visit.date;
  if (date) segments.push(`${date} 방문`);

  const dealType = DEAL_TYPES.find((type) => type.id === inspection.visit.dealType);
  if (dealType) segments.push(dealType.label);

  if (segments.length === 0) return '매물 정보를 입력해주세요';
  return segments.join(' · ');
}
