import { useNavigate } from 'react-router-dom';
import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { useUiFeedback } from '../../context/UiFeedbackContext.jsx';
import { deriveInspectionDisplay } from '../../lib/inspectionDisplay.js';
import { cx } from '../../lib/classNames.js';
import { onboardingStepRoute } from '../../pages/onboarding/onboardingRoutes.js';
import styles from './SavedInspectionListItem.module.css';

// props: inspection, index(정렬된 목록에서의 0-based 순번, alias 없을 때 "N번째"로 표시)
export function SavedInspectionListItem({ inspection, index }) {
  const { currentInspection, loadInspection, deleteInspection } = useInspection();
  const { showConfirm } = useUiFeedback();
  const navigate = useNavigate();

  const { name, addressLine, rate, scoreLabel } = deriveInspectionDisplay(inspection, index);
  const isCurrent = currentInspection?.id === inspection.id;
  const isDraft = !inspection.ui.onboardingComplete;

  // 온보딩 완료 기록은 체크리스트 화면으로, 중단된 드래프트는 멈춘 온보딩 단계로 이동한다.
  const handleOpen = () => {
    loadInspection(inspection.id);
    if (inspection.ui.onboardingComplete) {
      navigate(`/checklist/${inspection.id}`);
    } else {
      navigate(onboardingStepRoute(inspection.ui.onboardingStep));
    }
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    showConfirm(
      '이 체크 기록을 삭제하시겠습니까?\n삭제된 기록은 복구할 수 없습니다.',
      () => deleteInspection(inspection.id),
      { confirmLabel: '삭제' }
    );
  };

  return (
    <li className={cx(styles.item, isCurrent && styles.current)}>
      <button type="button" className={styles.main} onClick={handleOpen}>
        <p className={styles.name}>
          {name} <span className={styles.score}>{scoreLabel}</span>
          {isDraft && <span className={styles.draftBadge}>이어서 입력하기</span>}
        </p>
        <p className={styles.address}>{addressLine}</p>
        <p className={styles.meta}>
          {inspection.visit.date || ''} · 확인율 {rate}%
        </p>
      </button>
      <button type="button" className={styles.deleteBtn} onClick={handleDelete}>
        기록 삭제
      </button>
    </li>
  );
}
