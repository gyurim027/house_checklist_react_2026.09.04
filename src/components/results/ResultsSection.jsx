import { useEffect, useState } from 'react';
import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { getResultsGateInfo } from '../../lib/scoring.js';
import { ResultsGatePrompt } from './ResultsGatePrompt.jsx';
import { ScoreGradeCard } from './ScoreGradeCard.jsx';
import { IssuesList } from './IssuesList.jsx';
import { HighlightsList } from './HighlightsList.jsx';
import styles from './ResultsSection.module.css';

// 결과 공개 게이트 상태 기계.
// - resultRevealed===false && hasAttemptedReveal===false: 버튼만.
// - resultRevealed===false && hasAttemptedReveal===true (클릭했지만 게이트 미통과): 안내 프롬프트.
//   이후 사용자가 응답을 추가해 게이트를 넘기면(매 렌더 getResultsGateInfo 재계산) 재클릭 없이
//   자동으로 결과로 전환한다 — 이를 위해 isUnlocked 변화를 useEffect로 감지해 revealResults()를 호출한다.
// - resultRevealed===true: 항상 결과(점수/등급/미흡목록/좋았던점)를 실시간으로 렌더.
//   ui.resultRevealed가 저장 레코드에 영속되므로, 새로고침해도 버튼 없이 바로 결과가 보인다.
export function ResultsSection() {
  const { currentInspection, revealResults } = useInspection();
  // 세션 한정 로컬 상태: "결과 확인하기"를 한 번이라도 클릭했는지. 저장하지 않는다.
  const [hasAttemptedReveal, setHasAttemptedReveal] = useState(false);

  const revealed = currentInspection.ui.resultRevealed;
  const gate = getResultsGateInfo(currentInspection);

  useEffect(() => {
    if (!revealed && hasAttemptedReveal && gate.isUnlocked) {
      revealResults();
    }
  }, [revealed, hasAttemptedReveal, gate.isUnlocked, revealResults]);

  if (revealed) {
    return (
      <section className={styles.section}>
        <ScoreGradeCard />
        <IssuesList />
        <HighlightsList />
      </section>
    );
  }

  if (!hasAttemptedReveal) {
    const handleReveal = () => {
      setHasAttemptedReveal(true);
      if (gate.isUnlocked) revealResults();
    };
    return (
      <section className={styles.section}>
        <button type="button" className={styles.revealBtn} onClick={handleReveal}>
          결과 확인하기
        </button>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <ResultsGatePrompt />
    </section>
  );
}
