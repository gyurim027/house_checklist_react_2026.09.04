import { PropertyTermsFields } from './PropertyTermsFields.jsx';
import { RealtorFields } from './RealtorFields.jsx';
import { VisitScheduleFields } from './VisitScheduleFields.jsx';
import styles from './VisitInfoCard.module.css';

// 체크리스트 화면 상단 카드 — 온보딩(별도 화면, Task 11)이 끝난 뒤에도 언제든 값을
// 추가 기입/수정할 수 있도록 계속 보인다. 세 필드 그룹(방문 일정/매물 조건/중개사)을
// 그대로 조합만 한다 — 각 그룹은 온보딩 마법사와 동일한 컴포넌트를 그대로 재사용한다.
export function VisitInfoCard() {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>방문 정보</h2>

      <h3 className={styles.subtitle}>방문 일정</h3>
      <VisitScheduleFields />

      <h3 className={styles.subtitle}>매물 조건</h3>
      <PropertyTermsFields />

      <h3 className={styles.subtitle}>중개사</h3>
      <RealtorFields />
    </section>
  );
}
