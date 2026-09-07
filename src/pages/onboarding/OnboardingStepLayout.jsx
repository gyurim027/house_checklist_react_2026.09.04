import { Link } from 'react-router-dom';
import styles from './OnboardingStepLayout.module.css';

// 온보딩 4단계(신규 매물 등록)가 공유하는 화면 chrome — 진행 표시("1/4") + 제목 +
// children(각 단계의 필드 컴포넌트) + 하단 CTA + 뒤로가기 링크.
// 순차 가드/스토어 호출 등 단계별 로직은 여기 두지 않는다 — 각 Step 페이지가 소유한다
// (이 레이아웃이 특정 단계를 알게 되는 순간 special-case가 쌓이기 시작하므로 의도적으로 얇게 유지).
export function OnboardingStepLayout({
  step,
  title,
  backTo,
  ctaLabel = '다음',
  onNext,
  errorMessage,
  children,
}) {
  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <Link to={backTo} className={styles.backLink}>
          ← 뒤로
        </Link>
        <span className={styles.progress}>{step}/4</span>
      </div>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.body}>{children}</div>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      <button type="button" className={styles.cta} onClick={onNext}>
        {ctaLabel}
      </button>
    </div>
  );
}
