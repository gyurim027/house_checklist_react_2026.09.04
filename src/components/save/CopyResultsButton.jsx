import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { useUiFeedback } from '../../context/UiFeedbackContext.jsx';
import { buildResultsSummaryText } from '../../lib/summaryText.js';
import styles from './CopyResultsButton.module.css';

// Task 12: "체크 결과 복사" 버튼을 SaveBar(고정 바)에서 분리해 InspectionView 콘텐츠
// 맨 끝의 일반 CTA 버튼으로 재배치한 것. 복사 로직(buildResultsSummaryText)은 그대로 재사용한다.
export function CopyResultsButton() {
  const { currentInspection } = useInspection();
  const { showToast } = useUiFeedback();

  const handleCopy = async () => {
    const text = buildResultsSummaryText(currentInspection);
    try {
      await navigator.clipboard.writeText(text);
      showToast('복사되었습니다.');
    } catch {
      showToast('복사하지 못했습니다.');
    }
  };

  return (
    <button type="button" className={styles.copyBtn} onClick={handleCopy}>
      체크 결과 복사
    </button>
  );
}
