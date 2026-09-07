import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { onboardingStepRoute } from './onboardingRoutes.js';

// 온보딩 2~4단계(ScheduleStep/TermsStep/RealtorStep) 공통 가드.
// 다음 세 조건을 순서대로 확인해 "이 라우트를 그대로 렌더해도 되는지"를 판단한다:
//   1) draft가 아예 없다 → /new/basic으로.
//   2) draft가 이미 onboardingComplete(브라우저 뒤로가기로 완료된 레코드에 돌아온 경우
//      포함)다 → 이미 끝난 온보딩을 계속하게 두지 않고 그 레코드의 체크리스트 화면으로.
//   3) onboardingStep이 이 단계에 필요한 최소값보다 낮다(아직 이 단계까지 진행 못함)
//      → 현재 진행된 단계의 라우트로("가장 진행된 단계까지"만 허용, 절대 건너뛰기 금지).
// 셋 다 아니면 redirectTo: null을 반환해 정상 렌더를 허용한다.
export function useOnboardingStepGuard(minStep) {
  const { currentInspection } = useInspection();

  if (!currentInspection) {
    return { redirectTo: onboardingStepRoute(1), currentInspection: null };
  }
  if (currentInspection.ui.onboardingComplete) {
    return { redirectTo: `/checklist/${currentInspection.id}`, currentInspection };
  }
  if (currentInspection.ui.onboardingStep < minStep) {
    return { redirectTo: onboardingStepRoute(currentInspection.ui.onboardingStep), currentInspection };
  }
  return { redirectTo: null, currentInspection };
}
