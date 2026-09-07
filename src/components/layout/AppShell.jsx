import { Outlet, useMatch } from 'react-router-dom';
import { Header } from './Header.jsx';
import { NavBar } from './NavBar.jsx';
import { Toast } from '../feedback/Toast.jsx';
import { ConfirmModal } from '../feedback/ConfirmModal.jsx';
import styles from './AppShell.module.css';

// AppShell 라우트 레이아웃. Header + <Outlet/> + NavBar + Toast/ConfirmModal를
// 렌더한다. NavBar는 Task 19에서 처음 추가됐다(하단 고정) — 이 레이아웃을 쓰는
// 라우트(/, /checklist/:id, /compare/*, /me) 전부에서 렌더 트리에 들어오되,
// /checklist/:id(PA-CKL-01)에서만 (Task 19 리비전) 숨긴다 — 체크리스트 작성
// 중 실수로 하단 탭을 눌러 이탈하는 걸 막기 위함. 레이아웃 밖 라우트(/login,
// /preferences, /new/*)에는 애초에 이 컴포넌트 트리가 렌더되지 않는다.
//
// NavBar를 숨길 때는 --nav-height를 이 서브트리 안에서 0으로 덮어써서, 그 값을
// 참조하는 .main의 padding-bottom(AppShell.module.css)·SaveBar의 bottom 오프셋·
// Toast의 bottom 오프셋이 전부 "NavBar가 없는 레이아웃"에 맞게 함께 접히도록
// 한다(각 컴포넌트가 라우트를 개별적으로 알 필요 없이 토큰 하나로 전파).
export function AppShell() {
  const isChecklistRoute = useMatch('/checklist/:id');

  return (
    <div className={styles.shell} style={isChecklistRoute ? { '--nav-height': '0px' } : undefined}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      {!isChecklistRoute && <NavBar />}
      <Toast />
      <ConfirmModal />
    </div>
  );
}
