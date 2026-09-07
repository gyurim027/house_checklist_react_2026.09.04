import { NavLink } from 'react-router-dom';
import { cx } from '../../lib/classNames.js';
import styles from './NavBar.module.css';

// 하단 탭 내비게이션(Task 19에서 처음 생성). 지금은 홈/마이 2개 링크만 — 매물
// 비교 링크는 Task 20이 추가한다(브리프 Ruling P3, 범위 확장 금지). AppShell
// 레이아웃을 쓰는 라우트(/, /checklist/:id, /me)에서만 보이고, /login·/preferences·
// /new/*처럼 AppShell 밖에 있는 라우트에서는 애초에 이 컴포넌트가 렌더되지 않는다.
const NAV_ITEMS = [
  { to: '/', label: '홈', end: true },
  { to: '/me', label: '마이', end: false },
];

export function NavBar() {
  return (
    <nav className={styles.nav} aria-label="주요 메뉴">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => cx(styles.link, isActive && styles.active)}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
