// 저장 레코드 id/날짜/시각 생성용 순수 유틸.

export function generateId() {
  return 'insp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

// 로컬 타임존 기준 'YYYY-MM-DD' (UTC 변환 없이 사용자가 보는 오늘 날짜).
export function todayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function nowIso() {
  return new Date().toISOString();
}
