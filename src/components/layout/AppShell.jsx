import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { Header } from './Header.jsx';
import { SavedInspectionsPanel } from '../saved/SavedInspectionsPanel.jsx';
import { EmptyState } from '../empty/EmptyState.jsx';
import { InspectionView } from '../inspection/InspectionView.jsx';
import { Toast } from '../feedback/Toast.jsx';
import { ConfirmModal } from '../feedback/ConfirmModal.jsx';
import styles from './AppShell.module.css';

// 앱 전체 레이아웃. Header + SavedInspectionsPanel + (currentInspection ? InspectionView :
// EmptyState) + Toast + ConfirmModal.
export function AppShell() {
  const { currentInspection } = useInspection();

  return (
    <div className={styles.shell}>
      <Header />
      <main className={styles.main}>
        <SavedInspectionsPanel />
        {currentInspection ? <InspectionView /> : <EmptyState />}
      </main>
      <Toast />
      <ConfirmModal />
    </div>
  );
}
