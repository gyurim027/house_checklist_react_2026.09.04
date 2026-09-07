import { NavLink } from 'react-router-dom';
import { cx } from '../../lib/classNames.js';
import styles from './NavBar.module.css';

// 하단 탭 내비게이션(Task 19에서 처음 생성, Task 20에서 "비교" 추가). AppShell
// 레이아웃을 쓰는 라우트(/, /checklist/:id, /compare/*, /me)에서만 보이고,
// /login·/preferences·/new/*처럼 AppShell 밖에 있는 라우트에서는 애초에 이
// 컴포넌트가 렌더되지 않는다. "/compare"(결과 화면)는 "/compare/select"의 형제
// 라우트라 NavLink의 isActive가 결과 화면에서는 자동으로 켜지지 않는다 — 사소한
// 화면상 nit이라 별도 경로 매칭 로직은 추가하지 않는다(범위 확장 금지).
const NAV_ITEMS = [
  { to: '/', label: '홈', end: true },
  { to: '/compare/select', label: '비교', end: false },
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
