import { useState } from 'react';
import { hasGeminiApiKey, getGeminiApiKey } from '../../lib/geminiKeyStore.js';
import { getComparisonSummary, truncateToLines } from '../../lib/geminiClient.js';
import styles from './GeminiSummarySection.module.css';

// props: facts(string) — CompareResultPage가 §3 결과로부터 만든 사실 요약 텍스트.
// 키는 서비스 운영자 소유(geminiKeyStore.js, 빌드 시점 환경변수)로만 관리되고
// 사용자 화면에는 키 관리 개념 자체를 노출하지 않는다 — 키가 없으면(로컬 개발 중
// .env 미설정 등) 이 섹션을 통째로 렌더링하지 않는다(안내 문구도 없음). 키가 없으면
// 클릭 핸들러에 도달할 코드 경로 자체가 없으므로 네트워크 호출 0건이 구조적으로
// 보장된다.
export function GeminiSummarySection({ facts }) {
  const [state, setState] = useState('idle'); // idle | loading | done | error
  const [summary, setSummary] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!hasGeminiApiKey()) return null;

  const handleClick = async () => {
    setState('loading');
    setErrorMessage('');
    try {
      const result = await getComparisonSummary(facts, getGeminiApiKey());
      setSummary(truncateToLines(result, 3));
      setState('done');
    } catch (error) {
      setErrorMessage(error.message || 'AI 요약을 가져오지 못했습니다.');
      setState('error');
    }
  };

  return (
    <section className={styles.section}>
      <button type="button" className={styles.button} onClick={handleClick} disabled={state === 'loading'}>
        {state === 'loading' ? '불러오는 중…' : 'AI 요약 보기'}
      </button>
      {state === 'done' && <p className={styles.summary}>{summary}</p>}
      {state === 'error' && <p className={styles.error}>{errorMessage}</p>}
    </section>
  );
}
