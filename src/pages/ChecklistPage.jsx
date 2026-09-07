import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useInspection } from '../context/InspectionStoreContext.jsx';
import { onboardingStepRoute } from './onboarding/onboardingRoutes.js';
import { InspectionView } from '../components/inspection/InspectionView.jsx';

// PA-CKL-01 — 체크리스트 화면. URL의 :id로 해당 점검 레코드를 current로 만들고,
// 아래 가드를 순서대로 통과해야 실제 체크리스트(InspectionView)를 렌더한다.
//   1) :id가 저장소(store.inspections)에 없다 → "/"로.
//   2) 레코드는 있지만 ui.onboardingComplete가 false다(온보딩 중 이탈한 draft) →
//      ui.onboardingStep에 해당하는 /new/*로(진행된 단계까지만, 처음부터 다시 X).
// 통과하면 <InspectionView/>를 그대로 렌더 — 이 페이지 자체는 그 이상의 로직을 갖지 않는다.
export function ChecklistPage() {
  const { id } = useParams();
  const { inspections, currentInspection, loadInspection } = useInspection();

  const record = inspections.find((i) => i.id === id) ?? null;
  const isCurrent = currentInspection?.id === id;

  // loadInspection은 currentInspectionId만 바꾸는 idempotent 호출이라 ref 가드 없이
  // 매 렌더 조건 확인만으로 충분하다(BasicInfoStep의 createInspection과 달리 중복 생성 위험 없음).
  // 렌더 중 setState를 피하기 위해 effect로 옮긴다.
  useEffect(() => {
    if (record && !isCurrent) {
      loadInspection(id);
    }
  }, [record, isCurrent, id, loadInspection]);

  if (!record) {
    return <Navigate to="/" replace />;
  }

  if (!isCurrent) {
    return null; // currentInspectionId 갱신 후 리렌더 대기(1틱)
  }

  if (!record.ui.onboardingComplete) {
    return <Navigate to={onboardingStepRoute(record.ui.onboardingStep)} replace />;
  }

  return <InspectionView />;
}
