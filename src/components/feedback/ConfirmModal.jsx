import { useUiFeedback } from '../../context/UiFeedbackContext.jsx';
import { cx } from '../../lib/classNames.js';
import styles from './ConfirmModal.module.css';

// UiFeedbackContext의 confirmModal 상태를 구독해 실제로 그리는 컴포넌트.
export function ConfirmModal() {
  const { confirmModal, confirmModalConfirm, confirmModalCancel } = useUiFeedback();

  if (!confirmModal.open) return null;

  return (
    <div className={styles.backdrop} onClick={confirmModalCancel}>
      <div
        className={styles.modal}
        role="alertdialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <p className={styles.message}>{confirmModal.message}</p>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={confirmModalCancel}>
            취소
          </button>
          <button
            type="button"
            className={cx(styles.confirmBtn, confirmModal.tone === 'neutral' && styles.confirmBtnNeutral)}
            onClick={confirmModalConfirm}
          >
            {confirmModal.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
