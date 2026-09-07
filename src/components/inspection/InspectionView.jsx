import { PropertyOverviewCard } from '../property/PropertyOverviewCard.jsx';
import { ProgressBar } from '../progress/ProgressBar.jsx';
import { ChecklistSection } from '../checklist/ChecklistSection.jsx';
import { RealtorQuestions } from '../questions/RealtorQuestions.jsx';
import { ResultsSection } from '../results/ResultsSection.jsx';
import { FinalDecision } from '../decision/FinalDecision.jsx';
import { SaveBar } from '../save/SaveBar.jsx';
import styles from './InspectionView.module.css';

// AppShell 브리핑에서 언급된 "InspectionView" 합성 컴포넌트.
// 브리핑의 컴포넌트 목록에 별도 항목으로 명시되진 않았지만, AppShell이 참조하는
// 매물정보/진행률/체크리스트/저장바를 하나로 묶는 자리가 필요해 추가했다(자유 판단 영역).
// Task 18: 최상단 AddressCard+VisitInfoCard 두 줄을 접힘 요약 카드(PropertyOverviewCard)
// 하나로 교체. "체크 결과 복사" 버튼(F-036)은 완전 삭제 — SaveBar는 여전히 마지막에
// 렌더되어 sticky bottom을 유지한다.
export function InspectionView() {
  return (
    <div className={styles.view}>
      <PropertyOverviewCard />
      <ProgressBar />
      <ChecklistSection />
      <RealtorQuestions />
      <ResultsSection />
      <FinalDecision />
      <SaveBar />
    </div>
  );
}
