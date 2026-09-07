import { Navigate, useNavigate } from 'react-router-dom';
import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { RealtorFields } from '../../components/property/RealtorFields.jsx';
import { OnboardingStepLayout } from './OnboardingStepLayout.jsx';
import { useOnboardingStepGuard } from './useOnboardingStepGuard.js';

// PA-IFO-04 — 온보딩 4/4단계: 중개사 정보.
// 순차 가드(useOnboardingStepGuard): draft 없음/이미 완료됨/ui.onboardingStep < 4 중
// 하나라도 해당하면 적절한 라우트로 되돌린다.
// 별도의 5단계 라우트는 없다 — "기본 정보 입력 완료" 클릭 시 completeOnboarding()을 호출하고
// 곧바로 체크리스트 화면(/checklist/:id)으로 이동한다.
export function RealtorStep() {
  const { redirectTo, currentInspection } = useOnboardingStepGuard(4);
  const { completeOnboarding } = useInspection();
  const navigate = useNavigate();

  if (redirectTo) return <Navigate to={redirectTo} replace />;

  const handleComplete = () => {
    const id = currentInspection.id;
    completeOnboarding();
    navigate(`/checklist/${id}`);
  };

  return (
    <OnboardingStepLayout
      step={4}
      title="중개사 정보"
      backTo="/new/terms"
      ctaLabel="기본 정보 입력 완료"
      onNext={handleComplete}
    >
      <RealtorFields />
    </OnboardingStepLayout>
  );
}
