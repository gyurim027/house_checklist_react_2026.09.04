// 매물 비교 AI 요약 (Task 20 §4, 선택 기능). 서버 프록시 없이 브라우저에서 Gemini API를
// 직접 호출한다 — "DB/백엔드 없음" 원칙은 유지하되, 사용자 본인의 API 키로 호출하는
// 이 한 곳만 예외(design spec 문서에 기록된 의도된 이탈).
//
// 모델명은 Google 쪽 값이라 시간이 지나면 바뀔 수 있다 — 오류가 나면 Google AI Studio
// 문서에서 현재 무료 티어 flash 모델명을 다시 확인한다.
const GEMINI_MODEL = 'gemini-2.0-flash';

function endpoint(apiKey) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
}

// facts: summarizePreferenceVerdicts 등으로 이미 계산된 사실만 담은 한국어 텍스트.
// 이 함수는 그 사실을 3줄 이내로 요약해 달라는 프롬프트로 감쌀 뿐, 새로운 판단 기준을
// 추가하지 않는다.
export async function getComparisonSummary(facts, apiKey) {
  if (!apiKey) throw new Error('Gemini API 키가 없습니다.');

  const prompt =
    '아래는 사용자가 직접 확인한 매물 비교 정보입니다. 한국어로 3줄 이내로, ' +
    '주어진 사실에만 근거해 어떤 매물이 더 적합해 보이는지 요약하세요. ' +
    '새로운 정보를 추측하거나 지어내지 마세요.\n\n' +
    facts;

  let response;
  try {
    response = await fetch(endpoint(apiKey), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
  } catch {
    throw new Error('네트워크 오류로 AI 요약을 가져오지 못했습니다.');
  }

  if (!response.ok) {
    if (response.status === 400 || response.status === 403) {
      throw new Error('Gemini API 키가 올바르지 않습니다.');
    }
    if (response.status === 429) {
      throw new Error('요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
    }
    throw new Error(`AI 요약 요청이 실패했습니다. (${response.status})`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('AI 응답을 이해할 수 없습니다.');
  return text.trim();
}

// 모델이 3줄 지시를 무시할 경우를 대비한 클라이언트 쪽 안전장치.
export function truncateToLines(text, maxLines) {
  return text
    .split('\n')
    .filter((line) => line.trim() !== '')
    .slice(0, maxLines)
    .join('\n');
}
