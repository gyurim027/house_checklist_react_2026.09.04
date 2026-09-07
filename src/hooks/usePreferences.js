import { useCallback, useState } from 'react';
import { nowIso } from '../lib/id.js';

// 「집 보러 갈 때 10분 체크」 React 재구현 — 선호 조건 localStorage 훅 (Task 19)
// 저장 형태와 키는 태스크 브리프가 정확히 지정한 값을 그대로 쓴다:
//   houseChecklistReact.preferences.v1 = { schemaVersion:1, selected: string[], updatedAt }
//   houseChecklistReact.preferencesOnboardingSeen.v1 — 온보딩 1회 노출 여부 플래그
// authStub.js와 같은 house style: 함수형 localStorage 래핑 + try/catch 무시.

const PREFS_KEY = 'houseChecklistReact.preferences.v1';
const ONBOARDING_SEEN_KEY = 'houseChecklistReact.preferencesOnboardingSeen.v1';
const SCHEMA_VERSION = 1;

function emptyPreferences() {
  return { schemaVersion: SCHEMA_VERSION, selected: [], updatedAt: null };
}

function readPreferences() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return emptyPreferences();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.selected)) return emptyPreferences();
    return {
      schemaVersion: SCHEMA_VERSION,
      selected: parsed.selected,
      updatedAt: parsed.updatedAt ?? null,
    };
  } catch {
    return emptyPreferences();
  }
}

function writePreferences(selected) {
  const record = { schemaVersion: SCHEMA_VERSION, selected, updatedAt: nowIso() };
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(record));
  } catch {
    // localStorage 접근 실패(프라이빗 모드 등) 시 조용히 무시한다.
  }
  return record;
}

// 온보딩 화면을 1회라도 통과(스킵 또는 저장)했는지 — 이 훅 밖(HomePage의 리다이렉트
// 판단)에서도 즉시 필요할 수 있어 순수 함수로도 내보낸다.
export function hasSeenPreferencesOnboarding() {
  try {
    return localStorage.getItem(ONBOARDING_SEEN_KEY) !== null;
  } catch {
    return false;
  }
}

export function markPreferencesOnboardingSeen() {
  try {
    localStorage.setItem(ONBOARDING_SEEN_KEY, JSON.stringify({ seen: true, seenAt: nowIso() }));
  } catch {
    // 무시 — 다음 hasSeenPreferencesOnboarding() 호출이 어차피 false를 반환할 뿐,
    // 앱 동작 자체를 막지 않는다.
  }
}

export function usePreferences() {
  const [preferences, setPreferences] = useState(() => readPreferences());

  const setSelected = useCallback((tagIds) => {
    const record = writePreferences(tagIds);
    setPreferences(record);
  }, []);

  return {
    selected: preferences.selected,
    updatedAt: preferences.updatedAt,
    setSelected,
  };
}
