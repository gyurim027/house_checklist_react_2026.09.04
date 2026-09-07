import { Navigate, useNavigate } from 'react-router-dom';
import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { VisitScheduleFields } from '../../components/property/VisitScheduleFields.jsx';
import { OnboardingStepLayout } from './OnboardingStepLayout.jsx';
import { useOnboardingStepGuard } from './useOnboardingStepGuard.js';

// PA-IFO-02 — 온보딩 2/4단계: 방문 일정.
// 순차 가드(useOnboardingStepGuard): draft가 없거나, 이미 완료된 draft거나(뒤로가기로
// 돌아온 경우 — 완료된 레코드를 온보딩 UI로 계속 편집하지 못하도록 그 레코드의 체크리스트
// 화면으로 돌려보낸다), ui.onboardingStep < 2(1단계를 아직 통과하지 못함)면 현재 진행된
// 단계의 라우트로 되돌린다. 뒤로 와서 이 단계를 다시 보는 것은 항상 허용된다(onboardingStep은
// 여기서 감소시키지 않는다).
export function ScheduleStep() {
  const { redirectTo } = useOnboardingStepGuard(2);
  const { setOnboardingStep } = useInspection();
  const navigate = useNavigate();

  if (redirectTo) return <Navigate to={redirectTo} replace />;

  const handleNext = () => {
    setOnboardingStep(3);
    navigate('/new/terms');
  };

  return (
    <OnboardingStepLayout step={2} title="방문 일정" backTo="/new/basic" ctaLabel="다음" onNext={handleNext}>
      <VisitScheduleFields />
    </OnboardingStepLayout>
  );
}
