import { useState } from 'react';
import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { DECISIONS } from '../../data/checklistData.js';
import { cx } from '../../lib/classNames.js';
import styles from './FinalDecision.module.css';

// Task 7: 최종 판단 섹션
// - 3지선다 라디오 그룹(decision.result, 즉시 저장)
// - 조건 협의 필요 체크박스(decision.needsNegotiation, 즉시 저장)
// - 협의 메모 textarea(decision.negotiationMemo, debounce, 체크박스 체크 시만 표시)
// - 한 줄 평가(decision.summary, debounce, placeholder + 예시)
export function FinalDecision() {
  const { currentInspection, setDecisionResult, toggleNeedsNegotiation, setNegotiationMemo, setDecisionSummary } =
    useInspection();

  const decision = currentInspection.decision;
  const [summaryInput, setSummaryInput] = useState(decision.summary);

  const handleDecisionChange = (resultId) => {
    setDecisionResult(resultId);
  };

  const handleNegotiationToggle = () => {
    toggleNeedsNegotiation();
  };

  const handleMemoChange = (text) => {
    setNegotiationMemo(text);
  };

  const handleSummaryChange = (text) => {
    setSummaryInput(text);
    setDecisionSummary(text);
  };

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>최종 판단</h2>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>이 집, 어떻게 하시겠어요?</legend>
        <div className={styles.radioGroup}>
          {DECISIONS.map((decision) => {
            const checked = currentInspection.decision.result === decision.id;
            return (
              <label key={decision.id} className={cx(styles.radioOption, checked && styles.radioChecked)}>
                <input
                  type="radio"
                  name="decision"
                  className={styles.radioInput}
                  value={decision.id}
                  checked={checked}
                  onChange={() => handleDecisionChange(decision.id)}
                />
                {decision.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className={styles.negotiationSection}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={decision.needsNegotiation}
            onChange={handleNegotiationToggle}
          />
          <span>조건 협의가 필요하다 (가격 / 수리 / 입주일 등)</span>
        </label>

        {decision.needsNegotiation && (
          <textarea
            className={styles.textarea}
            placeholder="무엇을 협의할지 메모해주세요"
            value={decision.negotiationMemo}
            onChange={(e) => handleMemoChange(e.target.value)}
            rows={4}
          />
        )}
      </div>

      <label className={styles.summaryField}>
        <span className={styles.summaryLabel}>한 줄 평가</span>
        <input
          type="text"
          className={styles.summaryInput}
          placeholder="이 집에 대한 느낌을 한 줄로 남겨보세요."
          value={summaryInput}
          onChange={(e) => handleSummaryChange(e.target.value)}
        />
        <div className={styles.summaryHint}>예: 채광과 위치는 좋지만 위층 발소리가 계속 들렸다.</div>
      </label>
    </section>
  );
}
