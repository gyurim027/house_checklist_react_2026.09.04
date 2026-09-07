import { Navigate } from 'react-router-dom';
import { hasSeenPreferencesOnboarding } from '../hooks/usePreferences.js';
import { HomeHero } from '../components/home/HomeHero.jsx';
import { RecentNotesSection } from '../components/home/RecentNotesSection.jsx';

// PA-HOM-01 — 홈. 로그인 상태(RequireAuth가 이미 보장)에서 마운트될 때
// preferencesOnboardingSeen 플래그가 없으면(최초 로그인 직후) /preferences로
// 리다이렉트한다(Task 19). 그 외에는 노트 개수와 무관하게 항상 같은 레이아웃
// (원형 일러스트+추가 버튼 → 날짜별 노트 목록)을 렌더한다 — 기존 EmptyState/
// SavedInspectionsPanel 두 갈래 분기를 홈 리디자인에서 하나로 통합했다.
export function HomePage() {
  if (!hasSeenPreferencesOnboarding()) {
    return <Navigate to="/preferences" replace />;
  }

  return (
    <>
      <HomeHero />
      <RecentNotesSection />
    </>
  );
}
