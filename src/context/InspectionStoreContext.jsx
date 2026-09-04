import { createContext, useContext } from 'react';
import { useInspectionStore } from '../hooks/useInspectionStore.js';

const InspectionStoreContext = createContext(null);

export function InspectionStoreProvider({ children }) {
  const store = useInspectionStore();
  return (
    <InspectionStoreContext.Provider value={store}>{children}</InspectionStoreContext.Provider>
  );
}

// Provider 밖에서 사용하면(구현 실수를 조기에 드러내기 위해) 명시적으로 에러를 던진다.
export function useInspection() {
  const store = useContext(InspectionStoreContext);
  if (store === null) {
    throw new Error('useInspection은 InspectionStoreProvider 내부에서만 사용할 수 있습니다.');
  }
  return store;
}
