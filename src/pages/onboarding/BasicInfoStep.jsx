import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { AddressCard } from '../../components/property/AddressCard.jsx';
import { OnboardingStepLayout } from './OnboardingStepLayout.jsx';

// PA-IFO-01 — 온보딩 1/4단계: 별칭 · 주소.
// 진입 시 진행 중인 draft(currentInspection)가 없으면 새로 만든다(있으면 그대로 재사용 —
// 예: SavedInspectionsPanel/EmptyState의 "새 집 체크하기"가 먼저 createInspection()을
// 호출해두고 이리로 보내는 경우, 또는 이 단계로 되돌아온 경우).
export function BasicInfoStep() {
  const { currentInspection, createInspection, setOnboardingStep } = useInspection();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  // StrictMode(dev)의 effect 이중 호출로 draft가 2개 생기는 것을 막는 ref 가드.
  const hasEnsuredDraftRef = useRef(false);
  useEffect(() => {
    if (!currentInspection && !hasEnsuredDraftRef.current) {
      hasEnsuredDraftRef.current = true;
      createInspection();
    }
  }, [currentInspection, createInspection]);

  if (!currentInspection) return null; // draft 생성 직후 리렌더 대기(1틱)

  const handleNext = () => {
    const aliasFilled = currentInspection.alias.trim() !== '';
    const addressFilled = currentInspection.property.addressText.trim() !== '';
    if (!aliasFilled && !addressFilled) {
      setError('별칭 또는 주소 중 하나는 입력해주세요.');
      return;
    }
    setError('');
    setOnboardingStep(2);
    navigate('/new/schedule');
  };

  return (
    <OnboardingStepLayout
      step={1}
      title="기본 정보"
      backTo="/"
      ctaLabel="다음"
      onNext={handleNext}
      errorMessage={error}
    >
      <AddressCard />
    </OnboardingStepLayout>
  );
}
