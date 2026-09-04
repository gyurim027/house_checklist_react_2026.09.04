import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { getResultsGateInfo, categoriesWithUnansweredCoreItems } from '../../lib/scoring.js';
import styles from './ResultsGatePrompt.module.css';

// resultRevealed===false인데 "결과 확인하기"를 이미 클릭한 상태(게이트 미통과)에서 렌더된다.
// 색상 사용 규칙: 확인율 관련 안내는 무채색만 사용한다(결과 등급 화면이 아니므로 4색 미사용).
export function ResultsGatePrompt() {
  const { currentInspection, expandCategoriesWithUnansweredItems } = useInspection();
  const gate = getResultsGateInfo(currentInspection);

  const handleShowUnanswered = () => {
    const categoryIds = categoriesWithUnansweredCoreItems(currentInspection);
    expandCategoriesWithUnansweredItems(categoryIds);
  };

  return (
    <div className={styles.prompt}>
      <p className={styles.title}>정보가 더 필요해요 (확인율 {gate.rate}%)</p>
      <p className={styles.detail}>
        {gate.itemsNeeded}개 항목을 더 확인해 주세요. (핵심 {gate.coreTotal}개 중 {gate.coreAnswered}개
        응답)
      </p>
      <p className={styles.hint}>확인율 60%를 넘으면 점수와 등급을 보여드립니다.</p>
      <button type="button" className={styles.showBtn} onClick={handleShowUnanswered}>
        아직 확인 안 한 항목 보기
      </button>
    </div>
  );
}
