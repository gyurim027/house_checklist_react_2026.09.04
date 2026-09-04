import styles from './Header.module.css';

// 정적 헤더. 앱 제목/부제만 표시한다.
export function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>집 보러 갈 때 10분 체크</h1>
      <p className={styles.subtitle}>현장에서 눈으로 확인한 것만 기록합니다.</p>
    </header>
  );
}
