import { Navigate, useNavigate } from 'react-router-dom';
import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { PropertyTermsFields } from '../../components/property/PropertyTermsFields.jsx';
import { OnboardingStepLayout } from './OnboardingStepLayout.jsx';
import { useOnboardingStepGuard } from './useOnboardingStepGuard.js';

// PA-IFO-03 — 온보딩 3/4단계: 매물 조건 및 관리비.
// 순차 가드(useOnboardingStepGuard): draft 없음/이미 완료됨/ui.onboardingStep < 3 중
// 하나라도 해당하면 적절한 라우트(각각 /new/basic, 완료된 레코드의 /checklist/:id,
// 현재 진행된 단계)로 되돌린다.
export function TermsStep() {
  const { redirectTo } = useOnboardingStepGuard(3);
  const { setOnboardingStep } = useInspection();
  const navigate = useNavigate();

  if (redirectTo) return <Navigate to={redirectTo} replace />;

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
