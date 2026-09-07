// Gemini API 키 조회 (Task 20 §4 재설계). 사용자 화면에는 절대 노출하지 않는다 —
// 이 키는 서비스 운영자(현재는 개발자 본인) 소유이며, 빌드 시점 환경변수로만 관리한다.
// 로컬에서는 .env(gitignore 대상, .env.example 참고)에 VITE_GEMINI_API_KEY=...를
// 넣으면 Vite가 이 값을 읽는다.
//
// 주의: Vite의 VITE_ 접두사 env var는 빌드 결과물(클라이언트 번들)에 그대로 인라인된다.
// 즉 배포하면 이 키가 정적 파일 안에 평문으로 존재한다 — 백엔드가 붙기 전까지의 임시
// 조치이며, 공개 배포 시에는 서버 프록시로 옮겨야 한다.
export function getGeminiApiKey() {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
}

export function hasGeminiApiKey() {
  return Boolean(getGeminiApiKey());
}
