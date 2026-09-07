import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PreferenceTagGrid } from '../components/preferences/PreferenceTagGrid.jsx';
import { usePreferencesContext } from '../context/PreferencesContext.jsx';
import { hasSeenPreferencesOnboarding, markPreferencesOnboardingSeen } from '../hooks/usePreferences.js';
import styles from './PreferencesPage.module.css';

// PA-PRF-01 — 선호 조건 선택. 두 모드로 동작한다(Task 19 브리프):
//   - 온보딩 모드: preferencesOnboardingSeen.v1이 미설정일 때(로그인 직후 최초 진입).
//     "다음에 할래요"(스킵) + "저장하고 계속하기" 버튼. 둘 다 플래그를 설정하고 '/'로
//     이동한다 — 스킵은 선택값 자체는 저장하지 않는다(preferences.v1 미변경).
//   - 수정 모드: 이미 플래그가 설정된 상태(주로 /me에서 진입). 스킵 버튼 없이
//     "저장" 버튼만 있고, 저장 후 /me로 복귀한다.
// 모드는 마운트 시점의 플래그로 한 번만 정해 useState 초기값에 고정한다 — 저장
// 버튼을 누르면 이 페이지 안에서 곧바로 플래그가 true로 바뀌므로, 고정하지 않으면
// "저장하고 계속하기"였던 버튼이 클릭 처리 도중 "저장"으로 리렌더링되는 것처럼
// 보일 위험이 있다.
export function PreferencesPage() {
  const { selected, setSelected } = usePreferencesContext();
  const navigate = useNavigate();
  const [isOnboarding] = useState(() => !hasSeenPreferencesOnboarding());
  const [draft, setDraft] = useState(selected);

  const handleSave = () => {
    setSelected(draft);
    markPreferencesOnboardingSeen();
    navigate(isOnboarding ? '/' : '/me');
  };

  const handleSkip = () => {
    markPreferencesOnboardingSeen();
    navigate('/');
  };

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <h1 className={styles.title}>선호 조건 선택</h1>
        <p className={styles.subtitle}>
          {isOnboarding
            ? '집을 볼 때 특히 중요하게 보는 조건을 골라두면, 나중에 비교할 때 강조해서 보여드려요. 지금 정하지 않아도 괜찮아요.'
            : '선택한 조건은 언제든 다시 바꿀 수 있어요.'}
        </p>
      </div>
      <PreferenceTagGrid selected={draft} onChange={setDraft} />
      <div className={styles.actions}>
        {isOnboarding && (
          <button type="button" className={styles.skipBtn} onClick={handleSkip}>
            다음에 할래요
          </button>
        )}
        <button type="button" className={styles.saveBtn} onClick={handleSave}>
          {isOnboarding ? '저장하고 계속하기' : '저장'}
        </button>
      </div>
    </div>
  );
}
