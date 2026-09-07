// TODO(Task 16): authStub.isLoggedIn() 실제 체크로 교체
// 지금은 구조적 통과(passthrough)만 한다 — children을 그대로 렌더링한다.
export function RequireAuth({ children }) {
  return children;
}
