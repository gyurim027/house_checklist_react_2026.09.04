// 온보딩 4단계 ↔ 라우트 매핑. 순차 가드(ScheduleStep/TermsStep/RealtorStep)와
// SavedInspectionListItem(드래프트 재개)이 공유한다.
export const ONBOARDING_STEP_ROUTES = ['/new/basic', '/new/schedule', '/new/terms', '/new/realtor'];

// step(1~4, 범위를 벗어나면 clamp)에 해당하는 라우트 경로를 반환한다.
export function onboardingStepRoute(step) {
  const clamped = Math.min(Math.max(step || 1, 1), ONBOARDING_STEP_ROUTES.length);
  return ONBOARDING_STEP_ROUTES[clamped - 1];
}
