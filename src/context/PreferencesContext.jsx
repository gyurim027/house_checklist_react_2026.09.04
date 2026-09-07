import { createContext, useContext } from 'react';
import { usePreferences } from '../hooks/usePreferences.js';

// InspectionStoreContext.jsx와 같은 패턴: 원본 훅(usePreferences)의 state를
// 컨텍스트로 감싸 앱 전체가 하나의 selected 배열을 공유하게 한다(컨텍스트 없이
// usePreferences를 여러 컴포넌트에서 각자 호출하면 localStorage는 공유되지만
// React state는 컴포넌트마다 따로 놀아 즉시 반영되지 않는다).
const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const preferences = usePreferences();
  return <PreferencesContext.Provider value={preferences}>{children}</PreferencesContext.Provider>;
}

// Provider 밖에서 사용하면(구현 실수를 조기에 드러내기 위해) 명시적으로 에러를 던진다.
export function usePreferencesContext() {
  const ctx = useContext(PreferencesContext);
  if (ctx === null) {
    throw new Error('usePreferencesContext는 PreferencesProvider 내부에서만 사용할 수 있습니다.');
  }
  return ctx;
}
