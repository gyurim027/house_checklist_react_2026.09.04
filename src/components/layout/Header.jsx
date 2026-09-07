import styles from './Header.module.css';

// 정적 헤더. 앱 제목/부제만 표시한다.
export function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>집노트</h1>
      <p className={styles.subtitle}>보고, 기록하고, 비교해서 결정해요</p>
    </header>
  );
}
