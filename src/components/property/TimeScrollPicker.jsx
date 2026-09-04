import { useEffect, useRef, useState } from 'react';
import { cx } from '../../lib/classNames.js';
import styles from './TimeScrollPicker.module.css';

// 각 항목의 높이(px). tokens.css의 --touch-target(44px)과 일치해야 한다(터치 타깃 규칙).
// JS 스크롤 위치 계산에 숫자값이 필요해 CSS 변수 대신 상수로 고정한다.
const ITEM_HEIGHT = 44;
// 한 열에 동시에 보이는 항목 수(홀수 — 가운데 1개가 선택값). 위/아래 패딩으로 첫/끝 항목도
// 가운데까지 스크롤될 수 있게 한다.
const VISIBLE_COUNT = 5;
const PAD = Math.floor(VISIBLE_COUNT / 2) * ITEM_HEIGHT;
// 프로그램에 의한(초기 위치 지정/외부 값 동기화) 스크롤 이벤트를 사용자 커밋으로
// 오인하지 않도록 억제하는 시간(ms). 열별 커밋 debounce(120ms)보다 넉넉히 길게 잡는다.
const SUPPRESS_WINDOW = 400;
const SETTLE_DEBOUNCE = 120;

const PERIOD_ITEMS = [
  { value: 'am', label: '오전' },
  { value: 'pm', label: '오후' },
];
const HOUR_ITEMS = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: String(i + 1) }));
const MINUTE_STEP = 5;
const MINUTE_ITEMS = Array.from({ length: 60 / MINUTE_STEP }, (_, i) => {
  const m = i * MINUTE_STEP;
  return { value: m, label: String(m).padStart(2, '0') };
});

// "HH:mm"(24시간제) 문자열 → {period, hour12, minute} 내부 선택 상태.
// 형식이 잘못됐거나 빈 문자열이면 현재 시각(분은 5분 단위로 반올림) 근처로 초기화한다.
function parseValue(value) {
  const match = typeof value === 'string' && /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (match) {
    const hh = Number(match[1]);
    const mm = Number(match[2]);
    const period = hh < 12 ? 'am' : 'pm';
    let hour12 = hh % 12;
    if (hour12 === 0) hour12 = 12;
    const minute = MINUTE_ITEMS.reduce(
      (closest, item) => (Math.abs(item.value - mm) < Math.abs(closest - mm) ? item.value : closest),
      0
    );
    return { period, hour12, minute };
  }
  const now = new Date();
  const hh = now.getHours();
  const period = hh < 12 ? 'am' : 'pm';
  let hour12 = hh % 12;
  if (hour12 === 0) hour12 = 12;
  const minute = (Math.round(now.getMinutes() / MINUTE_STEP) * MINUTE_STEP) % 60;
  return { period, hour12, minute };
}

// {period, hour12, minute} → "HH:mm"(24시간제). 오전 12시=00:00(자정), 오후 12시=12:00(정오).
function toValue({ period, hour12, minute }) {
  let hh;
  if (period === 'am') {
    hh = hour12 === 12 ? 0 : hour12;
  } else {
    hh = hour12 === 12 ? 12 : hour12 + 12;
  }
  return `${String(hh).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function clampIndex(idx, length) {
  return Math.min(length - 1, Math.max(0, idx));
}

// 스크롤-스냅 1개 열. 부모가 넘긴 value에 해당하는 항목이 가운데로 오도록 위치를 맞추고,
// 스크롤이 멈추면(scroll debounce 또는 scrollend) 그 시점에 가운데 있는 항목을 커밋한다.
// suppressRef.current가 true인 동안(초기 배치/외부 동기화 직후)에는 커밋을 무시한다.
function PickerColumn({ items, value, onCommit, suppressRef, ariaLabel }) {
  const scrollRef = useRef(null);
  const index = items.findIndex((item) => item.value === value);

  const onCommitRef = useRef(onCommit);
  useEffect(() => {
    onCommitRef.current = onCommit;
  });

  // 선택된 인덱스가 바뀌면(사용자 스크롤 결과이든 외부 값 동기화이든) 해당 위치로 맞춘다.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || index < 0) return;
    const targetTop = index * ITEM_HEIGHT;
    if (Math.abs(el.scrollTop - targetTop) > 1) {
      el.scrollTop = targetTop;
    }
  }, [index]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    let debounceTimer = null;

    const commit = () => {
      const idx = clampIndex(Math.round(el.scrollTop / ITEM_HEIGHT), items.length);
      const item = items[idx];
      if (item && !suppressRef.current) {
        onCommitRef.current(item.value);
      }
    };

    const handleScroll = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(commit, SETTLE_DEBOUNCE);
    };
    const handleScrollEnd = () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
      commit();
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    el.addEventListener('scrollend', handleScrollEnd, { passive: true });
    return () => {
      el.removeEventListener('scroll', handleScroll);
      el.removeEventListener('scrollend', handleScrollEnd);
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [items, suppressRef]);

  return (
    <div
      ref={scrollRef}
      className={styles.column}
      style={{ paddingTop: PAD, paddingBottom: PAD }}
      role="listbox"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      {items.map((item, i) => (
        <div
          key={item.value}
          className={cx(styles.item, i === index && styles.itemActive)}
          role="option"
          aria-selected={i === index}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}

// 방문시간 입력용 3열(오전/오후, 시, 분) 스크롤-스냅 선택기. 저장 형식은 그대로 "HH:mm"
// 24시간제 문자열이며, 이 컴포넌트는 순수 입력 UI만 담당하는 controlled 컴포넌트다
// (자체 지속 상태를 갖지 않음 — value/onChange props로만 동작).
export function TimeScrollPicker({ value, onChange }) {
  const [selection, setSelection] = useState(() => parseValue(value));
  const selectionRef = useRef(selection);
  useEffect(() => {
    selectionRef.current = selection;
  }, [selection]);

  // 사용자가 스크롤로 값을 확정하기 전(초기 마운트 포함) 또는 외부에서 value가 바뀐 직후
  // 잠깐 동안은 프로그램에 의한 위치 조정 스크롤을 커밋으로 오인하지 않도록 억제한다.
  const suppressRef = useRef(true);
  const lastEmittedRef = useRef(undefined);

  useEffect(() => {
    if (value === lastEmittedRef.current) return undefined; // 우리가 방금 emit한 값의 반영(echo) — 무시
    setSelection(parseValue(value));
    suppressRef.current = true;
    const timer = setTimeout(() => {
      suppressRef.current = false;
    }, SUPPRESS_WINDOW);
    return () => clearTimeout(timer);
  }, [value]);

  const commitColumn = (key, val) => {
    const next = { ...selectionRef.current, [key]: val };
    selectionRef.current = next;
    setSelection(next);
    const formatted = toValue(next);
    lastEmittedRef.current = formatted;
    onChange(formatted);
  };

  return (
    <div className={styles.picker}>
      <PickerColumn
        items={PERIOD_ITEMS}
        value={selection.period}
        onCommit={(v) => commitColumn('period', v)}
        suppressRef={suppressRef}
        ariaLabel="오전/오후"
      />
      <PickerColumn
        items={HOUR_ITEMS}
        value={selection.hour12}
        onCommit={(v) => commitColumn('hour12', v)}
        suppressRef={suppressRef}
        ariaLabel="시"
      />
      <PickerColumn
        items={MINUTE_ITEMS}
        value={selection.minute}
        onCommit={(v) => commitColumn('minute', v)}
        suppressRef={suppressRef}
        ariaLabel="분"
      />
      <div className={styles.centerBand} aria-hidden="true" />
      <div className={styles.fadeTop} aria-hidden="true" />
      <div className={styles.fadeBottom} aria-hidden="true" />
    </div>
  );
}
