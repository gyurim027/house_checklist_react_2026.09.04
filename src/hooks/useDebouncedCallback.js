import { useCallback, useEffect, useRef } from 'react';

// (fn, wait) => 안정적인 identity를 갖는 debounced 콜백을 반환한다.
// fn은 useRef로 항상 최신 값을 유지하므로(리렌더마다 갱신), 호출부가 매 렌더 새 함수를
// 넘겨도 stale closure 문제 없이 타이머가 만료될 때 최신 fn이 실행된다.
// 언마운트 시 useEffect cleanup으로 대기 중인 타이머를 정리한다.
export function useDebouncedCallback(fn, wait) {
  const fnRef = useRef(fn);
  const timerRef = useRef(null);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return useCallback(
    (...args) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        fnRef.current(...args);
      }, wait);
    },
    [wait]
  );
}
