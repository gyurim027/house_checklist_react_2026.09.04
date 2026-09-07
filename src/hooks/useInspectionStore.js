import { useCallback, useEffect, useRef, useState } from 'react';
import { STATUS, ITEMS_BY_ID } from '../data/checklistData.js';
import {
  readStoreFromLocalStorage,
  writeStoreToLocalStorage,
  buildInspectionRecord,
} from '../lib/storage.js';
import { nowIso } from '../lib/id.js';
import { useDebouncedCallback } from './useDebouncedCallback.js';

const DEBOUNCE_WAIT = 500;

// 점검 저장소(store) 상태를 소유하고 localStorage와 동기화하는 훅.
// 레거시(storage.js)와 달리 모듈 전역 mutable state가 없다 — React state가 유일한 진실
// 소스이며, 이 훅이 그 상태의 소유자다.
//
// 저장 정책: 상태값/토글류(버튼, 라디오, 체크박스)는 즉시(commit) 저장하고,
// 텍스트 입력류는 500ms debounce 후 저장한다(둘 다 React state 자체는 즉시 갱신되어
// 화면에는 지연 없이 반영된다 — debounce는 오직 localStorage 쓰기 타이밍에만 적용).
export function useInspectionStore() {
  const [store, setStore] = useState(() => readStoreFromLocalStorage());
  const [saveStatus, setSaveStatus] = useState('idle');

  // 최신 store를 항상 가리키는 ref. debounced 저장이 타이머 만료 시점의
  // "가장 최근" store를 읽어야 하므로(레거시 debouncedSave와 동일 동작) 필요하다.
  const storeRef = useRef(store);
  useEffect(() => {
    storeRef.current = store;
  }, [store]);

  const currentInspection = store.inspections.find((i) => i.id === store.currentInspectionId) ?? null;

  // 구조적 변경(생성/전환/삭제) 전용 저장 — updatedAt을 건드리지 않는다(레거시 persist()와 동일).
  const commitStore = useCallback((nextStore) => {
    storeRef.current = nextStore;
    setSaveStatus('saving');
    const ok = writeStoreToLocalStorage(nextStore);
    setSaveStatus(ok ? 'saved' : 'error');
    return ok;
  }, []);

  // 필드 저장 — 현재 점검 레코드의 updatedAt을 저장 시점으로 갱신한 뒤 저장한다
  // (레거시 saveInspection()과 동일). storeRef.current를 읽으므로 debounce로 지연된
  // 호출이라도 항상 그 시점 기준 최신 데이터를 저장한다.
  const commitCurrentInspection = useCallback(() => {
    const snapshot = storeRef.current;
    const current = snapshot.inspections.find((i) => i.id === snapshot.currentInspectionId);
    if (!current) return false;
    const bumped = { ...current, updatedAt: nowIso() };
    const nextStore = {
      ...snapshot,
      inspections: snapshot.inspections.map((i) => (i.id === bumped.id ? bumped : i)),
    };
    storeRef.current = nextStore;
    setStore(nextStore);
    setSaveStatus('saving');
    const ok = writeStoreToLocalStorage(nextStore);
    setSaveStatus(ok ? 'saved' : 'error');
    return ok;
  }, []);

  const debouncedCommitCurrentInspection = useDebouncedCallback(commitCurrentInspection, DEBOUNCE_WAIT);

  // 현재 점검 레코드에 transform을 적용해 React state를 즉시 갱신하고,
  // immediate면 즉시, 아니면 debounce로 localStorage에 저장한다.
  // transform이 변경 없음을 뜻하는 동일 참조를 반환하면 no-op으로 처리한다.
  //
  // 렌더 클로저의 `store`가 아니라 `storeRef.current`를 기준(base)으로 계산한다 — 같은
  // 동기 실행(tick) 안에서 setter가 연속 호출되는 경우(예: setNegotiationMemo 직후
  // setDecisionSummary), setStore는 비동기라 `store` 클로저가 아직 이전 값이므로 그 값을
  // 기준으로 삼으면 먼저 호출된 변경이 나중 호출에 덮어써진다. storeRef.current는 각
  // 호출이 끝날 때마다 동기적으로 갱신되므로 이 문제가 없다.
  const updateCurrentInspection = useCallback(
    (transform, { immediate = true } = {}) => {
      const base = storeRef.current;
      const current = base.inspections.find((i) => i.id === base.currentInspectionId);
      if (!current) return;
      const nextInspection = transform(current);
      if (nextInspection === current) return;
      const nextStore = {
        ...base,
        inspections: base.inspections.map((i) => (i.id === nextInspection.id ? nextInspection : i)),
      };
      storeRef.current = nextStore;
      setStore(nextStore);
      if (immediate) {
        commitCurrentInspection();
      } else {
        setSaveStatus('saving');
        debouncedCommitCurrentInspection();
      }
    },
    [commitCurrentInspection, debouncedCommitCurrentInspection]
  );

  // ---------- CRUD ----------

  const createInspection = useCallback(() => {
    const inspection = buildInspectionRecord();
    const base = storeRef.current;
    const nextStore = {
      ...base,
      inspections: [...base.inspections, inspection],
      currentInspectionId: inspection.id,
    };
    storeRef.current = nextStore;
    setStore(nextStore);
    commitStore(nextStore);
    return inspection;
  }, [commitStore]);

  const loadInspection = useCallback(
    (id) => {
      const base = storeRef.current;
      const nextStore = { ...base, currentInspectionId: id };
      storeRef.current = nextStore;
      setStore(nextStore);
      commitStore(nextStore);
    },
    [commitStore]
  );

  const deleteInspection = useCallback(
    (id) => {
      const base = storeRef.current;
      const nextInspections = base.inspections.filter((i) => i.id !== id);
      const nextCurrentId =
        base.currentInspectionId === id
          ? nextInspections[0]
            ? nextInspections[0].id
            : null
          : base.currentInspectionId;
      const nextStore = {
        ...base,
        inspections: nextInspections,
        currentInspectionId: nextCurrentId,
      };
      storeRef.current = nextStore;
      setStore(nextStore);
      commitStore(nextStore);
    },
    [commitStore]
  );

  const saveInspectionNow = useCallback(() => commitCurrentInspection(), [commitCurrentInspection]);

  // ---------- 체크리스트 항목 ----------

  const setItemStatus = useCallback(
    (itemId, newStatus) => {
      const item = ITEMS_BY_ID[itemId];
      if (!item) return;
      if (newStatus === STATUS.NA && !item.allowNA) return;
      updateCurrentInspection((insp) => {
        const existing = insp.items[itemId];
        const existingStatus = existing ? existing.status : null;
        const memo = existing ? existing.memo : '';
        const resultStatus = existingStatus === newStatus ? null : newStatus; // 같은 상태 재클릭 → 미응답
        const nextItems = { ...insp.items };
        if (resultStatus === null && !memo) {
          delete nextItems[itemId]; // 미응답 + 메모 없음 → 키 자체를 만들지 않는다
        } else {
          nextItems[itemId] = { status: resultStatus, memo };
        }
        return { ...insp, items: nextItems };
      });
    },
    [updateCurrentInspection]
  );

  const setItemMemo = useCallback(
    (itemId, text) => {
      updateCurrentInspection(
        (insp) => {
          const existing = insp.items[itemId] || { status: null, memo: '' };
          return { ...insp, items: { ...insp.items, [itemId]: { ...existing, memo: text } } };
        },
        { immediate: false }
      );
    },
    [updateCurrentInspection]
  );

  const setCategoryMemo = useCallback(
    (categoryId, text) => {
      updateCurrentInspection(
        (insp) => ({ ...insp, categoryMemos: { ...insp.categoryMemos, [categoryId]: text } }),
        { immediate: false }
      );
    },
    [updateCurrentInspection]
  );

  const toggleCategoryExpanded = useCallback(
    (categoryId) => {
      updateCurrentInspection((insp) => {
        const isOpen = insp.ui.expandedCategories.includes(categoryId);
        const nextExpanded = isOpen
          ? insp.ui.expandedCategories.filter((id) => id !== categoryId)
          : [...insp.ui.expandedCategories, categoryId];
        return { ...insp, ui: { ...insp.ui, expandedCategories: nextExpanded } };
      });
    },
    [updateCurrentInspection]
  );

  const expandCategory = useCallback(
    (categoryId) => {
      updateCurrentInspection((insp) => {
        if (insp.ui.expandedCategories.includes(categoryId)) return insp; // idempotent
        return { ...insp, ui: { ...insp.ui, expandedCategories: [...insp.ui.expandedCategories, categoryId] } };
      });
    },
    [updateCurrentInspection]
  );

  const toggleOptionalExpanded = useCallback(
    (categoryId) => {
      updateCurrentInspection((insp) => {
        const isOpen = insp.ui.optionalExpanded.includes(categoryId);
        const nextOpen = isOpen
          ? insp.ui.optionalExpanded.filter((id) => id !== categoryId)
          : [...insp.ui.optionalExpanded, categoryId];
        return { ...insp, ui: { ...insp.ui, optionalExpanded: nextOpen } };
      });
    },
    [updateCurrentInspection]
  );

  const setNoiseLevel = useCallback(
    (level) => {
      updateCurrentInspection((insp) => ({ ...insp, noiseLevel: level }));
    },
    [updateCurrentInspection]
  );

  // ---------- 매물/방문 정보 ----------

  const setAlias = useCallback(
    (text) => {
      updateCurrentInspection((insp) => ({ ...insp, alias: text }), { immediate: false });
    },
    [updateCurrentInspection]
  );

  const setAddressText = useCallback(
    (text) => {
      updateCurrentInspection(
        (insp) => ({ ...insp, property: { ...insp.property, addressText: text } }),
        { immediate: false }
      );
    },
    [updateCurrentInspection]
  );

  const updateVisitField = useCallback(
    (field, value, { immediate } = {}) => {
      updateCurrentInspection((insp) => ({ ...insp, visit: { ...insp.visit, [field]: value } }), {
        immediate: !!immediate,
      });
    },
    [updateCurrentInspection]
  );

  // ---------- 중개사에게 물어볼 것 ----------

  const setQuestionAnswer = useCallback(
    (questionId, text) => {
      updateCurrentInspection(
        (insp) => ({ ...insp, questions: { ...insp.questions, [questionId]: text } }),
        { immediate: false }
      );
    },
    [updateCurrentInspection]
  );

  // ---------- 좋았던 점(직접 추가) ----------

  const addHighlightPro = useCallback(
    (text) => {
      updateCurrentInspection((insp) => {
        if (insp.evaluation.pros.length >= 3) return insp; // no-op
        return { ...insp, evaluation: { ...insp.evaluation, pros: [...insp.evaluation.pros, text] } };
      });
    },
    [updateCurrentInspection]
  );

  const removeHighlightPro = useCallback(
    (index) => {
      updateCurrentInspection((insp) => ({
        ...insp,
        evaluation: { ...insp.evaluation, pros: insp.evaluation.pros.filter((_, i) => i !== index) },
      }));
    },
    [updateCurrentInspection]
  );

  // ---------- 최종 판단 ----------

  const setDecisionResult = useCallback(
    (result) => {
      updateCurrentInspection((insp) => ({ ...insp, decision: { ...insp.decision, result } }));
    },
    [updateCurrentInspection]
  );

  const toggleNeedsNegotiation = useCallback(() => {
    updateCurrentInspection((insp) => ({
      ...insp,
      decision: { ...insp.decision, needsNegotiation: !insp.decision.needsNegotiation },
    }));
  }, [updateCurrentInspection]);

  const setNegotiationMemo = useCallback(
    (text) => {
      updateCurrentInspection((insp) => ({ ...insp, decision: { ...insp.decision, negotiationMemo: text } }), {
        immediate: false,
      });
    },
    [updateCurrentInspection]
  );

  const setDecisionSummary = useCallback(
    (text) => {
      updateCurrentInspection((insp) => ({ ...insp, decision: { ...insp.decision, summary: text } }), {
        immediate: false,
      });
    },
    [updateCurrentInspection]
  );

  // ---------- 결과 화면 ----------

  const revealResults = useCallback(() => {
    updateCurrentInspection((insp) => ({ ...insp, ui: { ...insp.ui, resultRevealed: true } }));
  }, [updateCurrentInspection]);

  // ---------- 온보딩 ----------

  const completeOnboarding = useCallback(() => {
    updateCurrentInspection((insp) => ({ ...insp, ui: { ...insp.ui, onboardingComplete: true } }));
  }, [updateCurrentInspection]);

  // 온보딩 진행 단계(1~4) — 상향식 high-water mark. step이 현재 저장된 값보다 클 때만
  // 갱신한다(뒤로 가서 이전 단계를 다시 통과해도 절대 감소하지 않는다).
  const setOnboardingStep = useCallback(
    (step) => {
      updateCurrentInspection((insp) => {
        const next = Math.max(insp.ui.onboardingStep, step);
        if (next === insp.ui.onboardingStep) return insp; // no-op
        return { ...insp, ui: { ...insp.ui, onboardingStep: next } };
      });
    },
    [updateCurrentInspection]
  );

  const expandCategoriesWithUnansweredItems = useCallback(
    (categoryIds) => {
      updateCurrentInspection((insp) => {
        const merged = new Set(insp.ui.expandedCategories);
        categoryIds.forEach((id) => merged.add(id));
        return { ...insp, ui: { ...insp.ui, expandedCategories: Array.from(merged) } };
      });
    },
    [updateCurrentInspection]
  );

  return {
    inspections: store.inspections,
    currentInspection,
    saveStatus,
    createInspection,
    loadInspection,
    deleteInspection,
    saveInspectionNow,
    setItemStatus,
    setItemMemo,
    setCategoryMemo,
    toggleCategoryExpanded,
    expandCategory,
    toggleOptionalExpanded,
    setNoiseLevel,
    setAlias,
    setAddressText,
    updateVisitField,
    setQuestionAnswer,
    addHighlightPro,
    removeHighlightPro,
    setDecisionResult,
    toggleNeedsNegotiation,
    setNegotiationMemo,
    setDecisionSummary,
    revealResults,
    expandCategoriesWithUnansweredItems,
    completeOnboarding,
    setOnboardingStep,
  };
}
