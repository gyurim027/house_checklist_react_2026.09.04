// 조건부 className 조합용 아주 작은 유틸(외부 의존성 추가 회피).
export function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}
