import { Outlet } from 'react-router-dom';
import { Header } from './Header.jsx';
import { Toast } from '../feedback/Toast.jsx';
import { ConfirmModal } from '../feedback/ConfirmModal.jsx';
import styles from './AppShell.module.css';

// AppShell 라우트 레이아웃. Header + <Outlet/> + Toast/ConfirmModal만 렌더한다.
// NavBar는 아직 없다(Task 19가 추가). 페이지별 내용은 Outlet을 통해 자식 라우트가
// 채운다.
export function AppShell() {
  return (
    <div className={styles.shell}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Toast />
      <ConfirmModal />
    </div>
  );
}
