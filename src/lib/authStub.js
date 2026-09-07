// 「집 보러 갈 때 10분 체크」 React 재구현 — 로그인 스텁 (Task 16)
// DB/백엔드 없는 프론트 전용 스텁. 실제 OAuth 인증은 하지 않고 localStorage에
// 로그인 여부만 기록한다. 카카오 SDK 연동 등 실제 인증 로직은 이 파일의 범위 밖이다.

const AUTH_STORAGE_KEY = 'houseChecklistReact.auth.v1';

// provider를 문자열로 받아, 나중에 네이버/구글 등을 추가하기 쉽게 열어둔다.
export function setLoggedIn(provider) {
  const record = { loggedIn: true, provider, loggedInAt: new Date().toISOString() };
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // localStorage 접근 실패(프라이빗 모드 등) 시 조용히 무시한다.
  }
}

export function isLoggedIn() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return Boolean(parsed && parsed.loggedIn === true);
  } catch {
    return false;
  }
}

export function logout() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // 무시 — 다음 isLoggedIn() 호출이 어차피 false를 반환한다.
  }
}
