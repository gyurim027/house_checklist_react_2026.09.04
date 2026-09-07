import { createHashRouter } from 'react-router-dom';
import { RequireAuth } from './components/layout/RequireAuth.jsx';
import { AppShell } from './components/layout/AppShell.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { BasicInfoStep } from './pages/onboarding/BasicInfoStep.jsx';
import { ScheduleStep } from './pages/onboarding/ScheduleStep.jsx';
import { TermsStep } from './pages/onboarding/TermsStep.jsx';
import { RealtorStep } from './pages/onboarding/RealtorStep.jsx';
import { ChecklistPage } from './pages/ChecklistPage.jsx';
import { PreferencesPage } from './pages/PreferencesPage.jsx';
import { MePage } from './pages/MePage.jsx';
import { CompareSelectPage } from './pages/compare/CompareSelectPage.jsx';
import { CompareResultPage } from './pages/compare/CompareResultPage.jsx';

// 라우트 트리 골격. 가드는 지금 전부 껍데기(RequireAuth passthrough) — 실제
// 인증/온보딩 가드 로직은 Task 16~20이 채운다.
//
// 레이아웃 없는 라우트(로그인/환경설정/온보딩)는 페이지 컴포넌트를 바로 렌더링하고,
// AppShell을 쓰는 라우트(홈/체크리스트/비교/마이페이지)는 공통 레이아웃 라우트 하나
// 아래 묶어 Header + Outlet을 공유한다.
export const router = createHashRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/preferences',
    element: (
      <RequireAuth>
        <PreferencesPage />
      </RequireAuth>
    ),
  },
  {
    path: '/new/basic',
    element: (
      <RequireAuth>
        <BasicInfoStep />
      </RequireAuth>
    ),
  },
  {
    path: '/new/schedule',
    element: (
      <RequireAuth>
        <ScheduleStep />
      </RequireAuth>
    ),
  },
  {
    path: '/new/terms',
    element: (
      <RequireAuth>
        <TermsStep />
      </RequireAuth>
    ),
  },
  {
    path: '/new/realtor',
    element: (
      <RequireAuth>
        <RealtorStep />
      </RequireAuth>
    ),
  },
  {
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'checklist/:id', element: <ChecklistPage /> },
      { path: 'compare/select', element: <CompareSelectPage /> },
      { path: 'compare', element: <CompareResultPage /> },
      { path: 'me', element: <MePage /> },
    ],
  },
]);
