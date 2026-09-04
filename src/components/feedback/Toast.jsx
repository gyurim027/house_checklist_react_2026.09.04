import { useUiFeedback } from '../../context/UiFeedbackContext.jsx';
import styles from './Toast.module.css';

// UiFeedbackContext의 toast 상태를 구독해 실제로 그리는 컴포넌트.
export function Toast() {
  const { toast } = useUiFeedback();

  if (!toast.visible) return null;

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      {toast.message}
    </div>
  );
}
