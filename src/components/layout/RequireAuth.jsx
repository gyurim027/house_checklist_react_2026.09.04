import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../../lib/authStub.js';

// Task 16: authStub 기반 실제 로그인 체크. 로그인 상태가 아니면 /login으로
// 리다이렉트하고, 로그인 상태면 children을 그대로 렌더링한다.
export function RequireAuth({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
