import { PREFERENCE_TAGS } from '../../data/preferenceMap.js';
import { cx } from '../../lib/classNames.js';
import styles from './PreferenceTagGrid.module.css';

// 최대 다중선택 개수(Task 19 리비전) — 무제한이면 "우선순위" 태그로서 의미가
// 흐려진다는 지적에 따라 4개로 제한한다. 이미 선택된 항목은 언제든 해제 가능하고,
// 4개에 도달하면 나머지 미선택 칩만 비활성화된다(선택 해제는 절대 막지 않는다).
export const MAX_SELECTED_TAGS = 4;

// 12개 선호 태그 다중선택 그리드. 순수 표시 컴포넌트 — 온보딩/수정 모드 분기는
// 전혀 모르고, selected(선택된 tagId 배열)와 onChange(다음 배열)만 주고받는다.
// 온보딩 모드/수정 모드 둘 다 이 컴포넌트를 동일하게 사용한다(PreferencesPage가
// 모드별 버튼/문구만 감싼다). 4개 상한은 모드와 무관한 공통 규칙이라 여기서
// 직접 처리한다 — PreferencesPage는 상한을 전혀 몰라도 된다.
export function PreferenceTagGrid({ selected, onChange }) {
  const selectedSet = new Set(selected);
  const atMax = selected.length >= MAX_SELECTED_TAGS;

  const toggle = (tagId) => {
    const isSelected = selectedSet.has(tagId);
    if (!isSelected && atMax) return; // 상한 도달 시 신규 선택만 차단, 해제는 항상 허용
    const next = isSelected ? selected.filter((id) => id !== tagId) : [...selected, tagId];
    onChange(next);
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.counter} aria-live="polite">
        {selected.length}/{MAX_SELECTED_TAGS} 선택됨
        {atMax && <span className={styles.maxNotice}> · 최대 4개까지 선택할 수 있어요</span>}
      </p>
      <div className={styles.grid} role="group" aria-label="선호 조건 선택">
        {PREFERENCE_TAGS.map((tag) => {
          const active = selectedSet.has(tag.id);
          const disabled = !active && atMax;
          return (
            <button
              key={tag.id}
              type="button"
              className={cx(styles.chip, active && styles.active, disabled && styles.disabled)}
              aria-pressed={active}
              disabled={disabled}
              onClick={() => toggle(tag.id)}
            >
              {tag.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
