import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { Header } from './Header.jsx';
import { SavedInspectionsPanel } from '../saved/SavedInspectionsPanel.jsx';
import { EmptyState } from '../empty/EmptyState.jsx';
import { SetupWizard } from '../setup/SetupWizard.jsx';
import { InspectionView } from '../inspection/InspectionView.jsx';
import { Toast } from '../feedback/Toast.jsx';
import { ConfirmModal } from '../feedback/ConfirmModal.jsx';
import styles from './AppShell.module.css';

// 앱 전체 레이아웃. Header + SavedInspectionsPanel + 3분기(EmptyState/SetupWizard/
// InspectionView) + Toast + ConfirmModal.
// - currentInspection 없음 → EmptyState
// - currentInspection 있으나 온보딩 미완료(ui.onboardingComplete falsy) → SetupWizard
// - currentInspection 있고 온보딩 완료 → InspectionView
export function AppShell() {
  const { currentInspection } = useInspection();

  let content;
  if (!currentInspection) {
    content = <EmptyState />;
  } else if (!currentInspection.ui.onboardingComplete) {
    content = <SetupWizard />;
  } else {
    content = <InspectionView />;
  }

  return (
    <div className={styles.shell}>
      <Header />
      <main className={styles.main}>
        <SavedInspectionsPanel />
        {content}
      </main>
      <Toast />
      <ConfirmModal />
    </div>
  );
}
