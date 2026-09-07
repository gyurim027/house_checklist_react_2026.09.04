import { useNavigate } from 'react-router-dom';
import { useInspection } from '../../context/InspectionStoreContext.jsx';
import styles from './EmptyState.module.css';

// currentInspection이 없을 때 보여주는 빈 상태. "10분 체크 시작하기" 클릭 시 새 점검을 생성하고
// 온보딩 1단계(/new/basic)로 이동한다.
export function EmptyState() {
  const { createInspection } = useInspection();
  const navigate = useNavigate();

  const handleStart = () => {
    createInspection();
    navigate('/new/basic');
  };

  return (
    <div className={styles.empty}>
      <p className={styles.line}>집 보러 가셨나요?</p>
      <p className={styles.line}>주소를 적어두고 10분 체크를 시작해보세요.</p>
      <button type="button" className={styles.cta} onClick={handleStart}>
        10분 체크 시작하기
      </button>
    </div>
  );
}
