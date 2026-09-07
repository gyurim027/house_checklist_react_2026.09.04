import { Link } from 'react-router-dom';
import styles from './MePage.module.css';

// PA-MYP-01 — 마이. 이 태스크의 범위는 최소로: "내 기준 설정"(선호 조건 수정)
// 진입 카드 하나만 둔다. Gemini API 키는 사용자 화면에 노출하지 않고 빌드 시점
// 환경변수로만 관리한다(geminiKeyStore.js) — 프로필/설정 등 다른 항목은 이후
// 태스크가 필요해지면 추가한다.
export function MePage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>마이</h1>
      <Link to="/preferences" className={styles.card}>
        <span className={styles.cardTitle}>내 기준 설정</span>
        <span className={styles.cardHint}>집을 볼 때 중요하게 보는 조건을 다시 고를 수 있어요.</span>
      </Link>
    </div>
  );
}
