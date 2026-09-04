// 만원 단위 숫자(문자열/숫자)를 "1억 5,000만원" 형식의 한글 문자열로 변환.
// value가 빈 문자열/0/NaN/음수면 빈 문자열을 반환한다(호출부에서 보조텍스트 자체를 숨기도록).
export function formatManwon(value) {
  const n = Number(value);
  if (value === '' || value === null || value === undefined || Number.isNaN(n) || n <= 0) {
    return '';
  }
  const eok = Math.floor(n / 10000);
  const rest = n % 10000;
  if (eok > 0 && rest > 0) {
    return `${eok}억 ${rest.toLocaleString('ko-KR')}만원`;
  }
  if (eok > 0 && rest === 0) {
    return `${eok}억원`;
  }
  return `${n.toLocaleString('ko-KR')}만원`;
}
