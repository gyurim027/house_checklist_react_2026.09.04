import { Navigate, useNavigate } from 'react-router-dom';
import { isLoggedIn, setLoggedIn } from '../lib/authStub.js';
import styles from './LoginPage.module.css';

// Task 16: DB/백엔드 없는 프론트 전용 로그인 스텁. 카카오 버튼 1개만 두고,
// 클릭 시 실제 인증 없이 authStub에 로그인 상태를 기록한 뒤 홈으로 이동한다.
// 다른 provider(네이버/구글 등) 버튼은 이 태스크 범위 밖이므로 만들지 않는다.
export function LoginPage() {
  const navigate = useNavigate();

  // 이미 로그인된 상태로 /login에 직접 접근하면 홈으로 리다이렉트한다.
  if (isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  const handleKakaoLogin = () => {
    setLoggedIn('kakao');
    navigate('/');
  };

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <h1 className={styles.title}>집 보러 갈 때 10분 체크</h1>
        <p className={styles.subtitle}>카카오 계정으로 로그인하고 시작하세요.</p>
      </div>
      <button type="button" className={styles.kakaoBtn} onClick={handleKakaoLogin}>
        {/* 카카오 로그인 버튼 심볼(말풍선). 카카오 공식 디자인 가이드
            (https://developers.kakao.com/docs/ko/kakaologin/design-guide)의
            리소스 다운로드 페이지(/tool/resource/login)는 JS 렌더링 + 클릭 다운로드
            방식이라 직접 스크래핑 가능한 PNG/SVG URL을 신뢰성 있게 확보할 수 없었다.
            아래는 공식 에셋을 다운로드하지 못해 직접 그린 근사치(hand-built
            approximation)이며, 카카오톡 앱 아이콘(CI)이나 워드마크 로고가 아닌
            "말풍선" 심볼 형태만을 단순화해 재현한 것이다. 픽셀 단위 정확도가
            필요하면 위 리소스 페이지에서 공식 PNG/PSD를 받아 교체할 것. */}
        <svg
          className={styles.kakaoSymbol}
          viewBox="0 0 24 20"
          aria-hidden="true"
          focusable="false"
        >
          <rect x="1" y="1" width="22" height="14" rx="7" ry="7" fill="#000000" />
          <path d="M6 14 L4 19 L11 14 Z" fill="#000000" />
        </svg>
        <span className={styles.kakaoLabel}>카카오 로그인</span>
      </button>
    </div>
  );
}
