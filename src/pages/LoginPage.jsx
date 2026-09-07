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
        카카오로 로그인
      </button>
    </div>
  );
}
