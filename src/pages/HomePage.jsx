import { Navigate } from 'react-router-dom';
import { useInspection } from '../context/InspectionStoreContext.jsx';
import { hasSeenPreferencesOnboarding } from '../hooks/usePreferences.js';
import { EmptyState } from '../components/empty/EmptyState.jsx';
import { SavedInspectionsPanel } from '../components/saved/SavedInspectionsPanel.jsx';

// PA-HOM-01 — 홈. 로그인 상태(RequireAuth가 이미 보장)에서 마운트될 때
// preferencesOnboardingSeen 플래그가 없으면(최초 로그인 직후) /preferences로
// 리다이렉트한다(Task 19). 있으면 저장된 점검이 없을 때 EmptyState, 있으면
// SavedInspectionsPanel을 렌더한다(둘 다 Task 17에서 라우터 네비게이션으로 갱신됨 —
// 이 페이지는 그대로 조립만 한다).
export function HomePage() {
  const { inspections } = useInspection();

  if (!hasSeenPreferencesOnboarding()) {
    return <Navigate to="/preferences" replace />;
  }

  return inspections.length === 0 ? <EmptyState /> : <SavedInspectionsPanel />;
}
