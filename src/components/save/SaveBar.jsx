import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { useUiFeedback } from '../../context/UiFeedbackContext.jsx';
import styles from './SaveBar.module.css';

// 이번 Task에서는 저장 상태 텍스트 + 수동 저장 버튼만 구현한다.
// 완료율/점수 요약 줄과 복사 버튼은 Task 8에서 이 파일에 추가된다.
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
        현재 내용 저장
      </button>
    </div>
  );
}
