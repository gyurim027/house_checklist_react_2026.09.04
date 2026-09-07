import { Navigate, useNavigate } from 'react-router-dom';
import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { PropertyTermsFields } from '../../components/property/PropertyTermsFields.jsx';
import { OnboardingStepLayout } from './OnboardingStepLayout.jsx';
import { onboardingStepRoute } from './onboardingRoutes.js';

// PA-IFO-03 — 온보딩 3/4단계: 매물 조건 및 관리비.
// 순차 가드: ui.onboardingStep < 3면 현재 진행된 단계로 되돌린다.
export function TermsStep() {
  const { currentInspection, setOnboardingStep } = useInspection();
  const navigate = useNavigate();

  if (!currentInspection || currentInspection.ui.onboardingStep < 3) {
    return <Navigate to={onboardingStepRoute(currentInspection?.ui.onboardingStep)} replace />;
  }

  const handleNext = () => {
    setOnboardingStep(4);
    navigate('/new/realtor');
  };

  return (
    <OnboardingStepLayout
      step={3}
      title="매물 조건 및 관리비"
      backTo="/new/schedule"
      ctaLabel="다음"
      onNext={handleNext}
    >
      <PropertyTermsFields />
    </OnboardingStepLayout>
  );
}
