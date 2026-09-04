import { useEffect, useRef, useState } from 'react';
import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { calcCompletionRate } from '../../lib/scoring.js';
import styles from './ProgressBar.module.css';

const HIDE_DELAY_MS = 200;

// 확인율 표시. 색상 사용 규칙(계획 Global Constraints)에 따라 무채색만 사용한다.
// Task 12: sticky 상단 바 — 스크롤 중에만 opacity/transform으로 부드럽게 나타나고,
// 스크롤이 멈추면 자동으로 숨긴다. 문서 흐름 공간은 항상 0으로 유지해(레이아웃 시프트 없음)
// 보이는 동안에는 절대 위치 오버레이로 그려진다.
export function ProgressBar() {
  const { currentInspection } = useInspection();
  const { rate } = calcCompletionRate(currentInspection);
  const [visible, setVisible] = useState(false);
  const hideTimerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => setVisible(false), HIDE_DELAY_MS);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  return (
    <div className={styles.wrap}>
      <section className={`${styles.inner} ${visible ? styles.visible : ''}`}>
        <span className={styles.label}>확인율 {rate}%</span>
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${rate}%` }} />
        </div>
      </section>
    </div>
  );
}
