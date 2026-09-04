import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { useUiFeedback } from '../../context/UiFeedbackContext.jsx';
import styles from './SaveBar.module.css';

// Task 4: 저장 상태 텍스트 + 수동 저장 버튼.
// Task 12: 완료 배너(확인율/점수·등급)와 결과 복사 버튼을 제거해 저장 상태 텍스트 +
// "저장" 버튼만 남긴다. 결과 복사 버튼은 InspectionView 최하단으로 이동했다(CopyResultsButton).
const SAVE_STATUS_TEXT = {
  idle: '',
  saving: '저장 중...',
  saved: '✓ 저장됨',
  error: '저장하지 못했습니다.',
};

export function SaveBar() {
  const { saveStatus, saveInspectionNow } = useInspection();
  const { showToast } = useUiFeedback();

  const handleSave = () => {
    const ok = saveInspectionNow();
    if (ok) showToast('체크리스트가 저장되었습니다.');
  };

  return (
    <div className={styles.bar}>
      <span className={styles.status}>{SAVE_STATUS_TEXT[saveStatus] ?? ''}</span>
      <button type="button" className={styles.saveBtn} onClick={handleSave}>
        저장
      </button>
    </div>
  );
}
