import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const UiFeedbackContext = createContext(null);

const TOAST_DURATION_MS = 2200;

// 토스트/확인모달의 "상태 관리" 책임만 이 Task에서 진다. 실제 시각적 렌더링(Toast.jsx,
// ConfirmModal.jsx)은 Task 4가 이 컨텍스트를 구독해 담당하므로, 여기서는 어떤 DOM도
// 그리지 않고 children만 그대로 통과시킨다(자리만 잡아둠).
export function UiFeedbackProvider({ children }) {
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    message: '',
    confirmLabel: '확인',
    onConfirm: null,
  });

  const toastTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = useCallback((message) => {
    setToast({ visible: true, message });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, TOAST_DURATION_MS);
  }, []);

  const hideToast = useCallback(() => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  const showConfirm = useCallback((message, onConfirm, options = {}) => {
    setConfirmModal({
      open: true,
      message,
      confirmLabel: options.confirmLabel || '확인',
      onConfirm: onConfirm || null,
    });
  }, []);

  const confirmModalCancel = useCallback(() => {
    setConfirmModal((prev) => ({ ...prev, open: false, onConfirm: null }));
  }, []);

  // onConfirm은 항상 최신 confirmModal을 가리키는 ref에서 읽어 호출한다. setConfirmModal의
  // 업데이터 함수 안에서 onConfirm(다른 컴포넌트, 예: InspectionStoreProvider의 상태 설정
  // 함수를 호출할 수 있음)을 실행하면 React가 "Cannot update a component while rendering a
  // different component" 오류를 낸다(렌더 단계에서 실행될 수 있는 업데이터는 순수해야 함) —
  // 그래서 onConfirm 호출은 업데이터 밖, 이벤트 핸들러 본문에서 한 번만 수행한다.
  const confirmModalRef = useRef(confirmModal);
  useEffect(() => {
    confirmModalRef.current = confirmModal;
  }, [confirmModal]);

  const confirmModalConfirm = useCallback(() => {
    const onConfirm = confirmModalRef.current.onConfirm;
    setConfirmModal((prev) => ({ ...prev, open: false, onConfirm: null }));
    if (onConfirm) onConfirm();
  }, []);

  const value = {
    // 주 API — 대부분의 화면 컴포넌트는 이 두 함수만 사용한다.
    showToast,
    showConfirm,
    // Task 4의 Toast.jsx / ConfirmModal.jsx가 구독할 내부 상태 + 닫기/확인 핸들러.
    toast,
    hideToast,
    confirmModal,
    confirmModalConfirm,
    confirmModalCancel,
  };

  return <UiFeedbackContext.Provider value={value}>{children}</UiFeedbackContext.Provider>;
}

export function useUiFeedback() {
  const value = useContext(UiFeedbackContext);
  if (value === null) {
    throw new Error('useUiFeedback은 UiFeedbackProvider 내부에서만 사용할 수 있습니다.');
  }
  return value;
}
