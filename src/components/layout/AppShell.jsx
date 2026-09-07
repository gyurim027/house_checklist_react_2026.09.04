import { Outlet } from 'react-router-dom';
import { Header } from './Header.jsx';
import { NavBar } from './NavBar.jsx';
import { Toast } from '../feedback/Toast.jsx';
import { ConfirmModal } from '../feedback/ConfirmModal.jsx';
import styles from './AppShell.module.css';

// AppShell 라우트 레이아웃. Header + <Outlet/> + NavBar + Toast/ConfirmModal를
// 렌더한다. NavBar는 Task 19에서 처음 추가됐다(하단 고정) — 이 레이아웃을 쓰는
// 라우트(/, /checklist/:id, /me)에서만 보이고, 레이아웃 밖 라우트(/login,
// /preferences, /new/*)에는 애초에 이 컴포넌트 트리가 렌더되지 않는다.
export function AppShell() {
  return (
    <div className={styles.shell}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <NavBar />
      <Toast />
      <ConfirmModal />
    </div>
  );
}
