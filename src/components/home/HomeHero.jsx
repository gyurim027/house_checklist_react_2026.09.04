import { useNavigate } from 'react-router-dom';
import { useInspection } from '../../context/InspectionStoreContext.jsx';
import styles from './HomeHero.module.css';

// 홈 화면 상단 — 원형 일러스트 + "새 집 노트 추가" 버튼. 노트 개수와 무관하게 항상
// 같은 모양으로 보인다(기존 EmptyState/SavedInspectionsPanel 두 갈래 분기를 통합).
export function HomeHero() {
  const { createInspection } = useInspection();
  const navigate = useNavigate();

  const handleAdd = () => {
    createInspection();
    navigate('/new/basic');
  };

  return (
    <div className={styles.hero}>
      <div className={styles.imageWrap}>
        <img
          src={`${import.meta.env.BASE_URL}home_illust.png`}
          alt=""
          className={styles.image}
        />
      </div>
      <button type="button" className={styles.addBtn} onClick={handleAdd}>
        <span className={styles.plus} aria-hidden="true">
          +
        </span>
        새 집 노트 추가
      </button>
    </div>
  );
}
