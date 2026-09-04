import { AddressCard } from '../property/AddressCard.jsx';
import { VisitInfoCard } from '../property/VisitInfoCard.jsx';
import { ProgressBar } from '../progress/ProgressBar.jsx';
import { ChecklistSection } from '../checklist/ChecklistSection.jsx';
import { RealtorQuestions } from '../questions/RealtorQuestions.jsx';
import { ResultsSection } from '../results/ResultsSection.jsx';
import { SaveBar } from '../save/SaveBar.jsx';
import styles from './InspectionView.module.css';

// AppShell 브리핑에서 언급된 "InspectionView" 합성 컴포넌트.
// 브리핑의 컴포넌트 목록에 별도 항목으로 명시되진 않았지만, AppShell이 참조하는
// 매물정보/진행률/체크리스트/저장바를 하나로 묶는 자리가 필요해 추가했다(자유 판단 영역).
export function InspectionView() {
  return (
    <div className={styles.view}>
      <AddressCard />
      <VisitInfoCard />
      <ProgressBar />
      <ChecklistSection />
      <RealtorQuestions />
      {/* Task 7(FinalDecision)이 ResultsSection과 SaveBar 사이에 삽입될 예정. */}
      <ResultsSection />
      <SaveBar />
    </div>
  );
}
