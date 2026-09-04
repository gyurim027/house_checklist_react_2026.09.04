// 「집 보러 갈 때 10분 체크」 React 재구현 — localStorage 저장소 (순수 함수만)
// 레거시 04_house_checklist/js/storage.js와 달리 모듈 전역 mutable state를 갖지 않는다.
// React가 상태(store)를 소유하고, 이 파일은 그 상태를 읽고/쓰는 순수 함수만 제공한다.
// 지도(Leaflet/GPS) 관련 필드(property.location, ui.mapExpanded)와 v1 마이그레이션은
// 계획서 Global Constraints에 따라 명시적으로 제외한다.

import { CATEGORIES, QUESTIONS } from '../data/checklistData.js';
import { generateId, todayDateString, nowIso } from './id.js';

export const STORAGE_KEY = 'houseChecklistReact.v1';

export function buildEmptyCategoryMemos() {
  const memos = {};
  CATEGORIES.forEach((cat) => {
    memos[cat.id] = '';
  });
  return memos;
}

export function buildEmptyQuestions() {
  const questions = {};
  QUESTIONS.forEach((q) => {
    questions[q.id] = '';
  });
  return questions;
}

// 저장 레코드 공통 스키마의 기본값으로 레코드를 생성하고, overrides로 최상위 필드를 덮어쓴다.
export function buildInspectionRecord(overrides) {
  const now = nowIso();
  const base = {
    schemaVersion: 2,
    id: generateId(),
    alias: '',
    property: { addressText: '' },
    visit: {
      date: todayDateString(),
      time: '',
      realtorName: '',
      realtorContact: '',
      dealType: '',
      jeonseAmount: '',
      maemaeAmount: '',
      wolseDepositType: '',
      wolseDeposit: '',
      wolseRent: '',
      managementFeeType: '',
      managementFeeAmount: '',
    },
    items: {},
    noiseLevel: '',
    questions: buildEmptyQuestions(),
    categoryMemos: buildEmptyCategoryMemos(),
    evaluation: { pros: [] },
    decision: { result: '', needsNegotiation: false, negotiationMemo: '', summary: '' },
    cache: {
      completionRate: 0,
      score: null,
      grade: null,
      issueCount: { critical: 0, major: 0, minor: 0 },
    },
    ui: { expandedCategories: ['A_exterior_common'], optionalExpanded: [], resultRevealed: false },
    createdAt: now,
    updatedAt: now,
  };
  return Object.assign(base, overrides || {});
}

// localStorage에서 스토어를 읽는다. 데이터가 없거나 파싱/형태 검증에 실패하면 빈 스토어를 반환한다.
export function readStoreFromLocalStorage() {
  const emptyStore = { schemaVersion: 2, inspections: [], currentInspectionId: null };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.inspections)) return emptyStore;
    return {
      schemaVersion: 2,
      inspections: parsed.inspections,
      currentInspectionId: parsed.currentInspectionId ?? null,
    };
  } catch {
    return emptyStore;
  }
}

// 스토어를 JSON으로 직렬화해 localStorage에 저장한다. 성공 시 true, 실패 시 false.
export function writeStoreToLocalStorage(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}
