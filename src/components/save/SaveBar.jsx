import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { useUiFeedback } from '../../context/UiFeedbackContext.jsx';
import { calcCompletionRate, calcGrade, calcScore, coreAnsweredCount } from '../../lib/scoring.js';
import { CORE_ITEM_COUNT } from '../../data/checklistData.js';
import { buildResultsSummaryText } from '../../lib/summaryText.js';
import styles from './SaveBar.module.css';

// Task 4: 저장 상태 텍스트 + 수동 저장 버튼.
// Task 8: 완료 배너(확인율은 항상, 점수·등급은 resultRevealed일 때만) + 결과 복사 버튼 추가.
const SAVE_STATUS_TEXT = {
  idle: '',
  saving: '저장 중...',
  saved: '✓ 저장됨',
  error: '저장하지 못했습니다.',
};

export function SaveBar() {
  const { currentInspection, saveStatus, saveInspectionNow } = useInspection();
  const { showToast } = useUiFeedback();

  const handleSave = () => {
    const ok = saveInspectionNow();
    if (ok) showToast('체크리스트가 저장되었습니다.');
  };

  const handleCopy = async () => {
    const text = buildResultsSummaryText(currentInspection);
    try {
      await navigator.clipboard.writeText(text);
      showToast('복사되었습니다.');
    } catch {
      showToast('복사하지 못했습니다.');
    }
  };

  const { rate } = calcCompletionRate(currentInspection);
  const answered = coreAnsweredCount(currentInspection);
  const revealed = currentInspection.ui.resultRevealed;

  let scoreLine = null;
  if (revealed) {
    const { score, criticalPoorCount } = calcScore(currentInspection);
    const grade = calcGrade(score, criticalPoorCount);
    scoreLine = `결과: ${score}점 · ${grade.label}`;
  }

  return (
    <div className={styles.bar}>
      <div className={styles.summary}>
        <p className={styles.completionLine}>
          핵심 {CORE_ITEM_COUNT}개 중 {answered}개 응답 (확인율 {rate}%)
        </p>
        {scoreLine && <p className={styles.scoreLine}>{scoreLine}</p>}
      </div>
      <div className={styles.actions}>
        <span className={styles.status}>{SAVE_STATUS_TEXT[saveStatus] ?? ''}</span>
        <button type="button" className={styles.copyBtn} onClick={handleCopy}>
          체크 결과 복사
        </button>
        <button type="button" className={styles.saveBtn} onClick={handleSave}>
          현재 내용 저장
        </button>
      </div>
    </div>
  );
}
