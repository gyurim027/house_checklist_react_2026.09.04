import { useNavigate } from 'react-router-dom';
import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { useUiFeedback } from '../../context/UiFeedbackContext.jsx';
import styles from './SaveBar.module.css';

// Task 4: 저장 상태 텍스트 + 수동 저장 버튼.
// Task 12: 완료 배너(확인율/점수·등급)와 결과 복사 버튼을 제거해 저장 상태 텍스트 +
// "저장" 버튼만 남긴다.
// Task 18(F-036): 결과 복사 기능(CopyResultsButton) 자체를 완전 삭제했다.
// 체크리스트 화면 커밋 후 리비전: 체크리스트에서 NavBar를 숨기면서(Task 19 리비전)
// 이탈 수단이 아예 없어졌던 문제를 고쳐, "홈으로" 버튼을 왼쪽에 추가한다.
const SAVE_STATUS_TEXT = {
  idle: '',
  saving: '저장 중...',
  saved: '✓ 저장됨',
  error: '저장하지 못했습니다.',
};

export function SaveBar() {
  const { saveStatus, saveInspectionNow } = useInspection();
  const { showToast, showConfirm } = useUiFeedback();
  const navigate = useNavigate();

  const handleSave = () => {
    const ok = saveInspectionNow();
    if (ok) showToast('체크리스트가 저장되었습니다.');
  };

  const handleGoHome = () => {
    showConfirm(
      '지금까지 기록한 내용을 저장하고 홈으로 이동할까요?',
      () => {
        saveInspectionNow();
        navigate('/');
      },
      { confirmLabel: '저장하고 홈으로', tone: 'neutral' }
    );
  };

  return (
    <div className={styles.bar}>
      <button type="button" className={styles.homeBtn} onClick={handleGoHome}>
        홈으로
      </button>
      <div className={styles.saveGroup}>
        <span className={styles.status}>{SAVE_STATUS_TEXT[saveStatus] ?? ''}</span>
        <button type="button" className={styles.saveBtn} onClick={handleSave}>
          저장
        </button>
      </div>
    </div>
  );
}
