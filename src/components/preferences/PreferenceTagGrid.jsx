import { PREFERENCE_TAGS } from '../../data/preferenceMap.js';
import { cx } from '../../lib/classNames.js';
import styles from './PreferenceTagGrid.module.css';

// 12개 선호 태그 다중선택 그리드. 순수 표시 컴포넌트 — 온보딩/수정 모드 분기는
// 전혀 모르고, selected(선택된 tagId 배열)와 onChange(다음 배열)만 주고받는다.
// 온보딩 모드/수정 모드 둘 다 이 컴포넌트를 동일하게 사용한다(PreferencesPage가
// 모드별 버튼/문구만 감싼다).
export function PreferenceTagGrid({ selected, onChange }) {
  const selectedSet = new Set(selected);

  const toggle = (tagId) => {
    const next = selectedSet.has(tagId) ? selected.filter((id) => id !== tagId) : [...selected, tagId];
    onChange(next);
  };

  return (
    <div className={styles.grid} role="group" aria-label="선호 조건 선택">
      {PREFERENCE_TAGS.map((tag) => {
        const active = selectedSet.has(tag.id);
        return (
          <button
            key={tag.id}
            type="button"
            className={cx(styles.chip, active && styles.active)}
            aria-pressed={active}
            onClick={() => toggle(tag.id)}
          >
            {tag.label}
          </button>
        );
      })}
    </div>
  );
}
