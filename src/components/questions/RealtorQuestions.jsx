import { QUESTIONS } from '../../data/checklistData.js';
import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { cx } from '../../lib/classNames.js';
import styles from './RealtorQuestions.module.css';

// q_pet 전용 3버튼 세그먼트 컨트롤(가능/불가/문의 안 함). 즉시 저장(버튼류 정책).
// 저장된 값이 options 중 어느 것과도 일치하지 않으면(예: 이 필드가 자유텍스트였던
// 과거 레코드의 잔여 문자열) 방어적으로 "미답변"처럼 렌더링한다 — 어떤 버튼도 active로
// 표시하지 않을 뿐, 클릭하면 정상적으로 유효한 enum 값으로 덮어써진다.
function PetAnswerControl({ question, value, onSelect }) {
  const isKnownValue = question.options.some((opt) => opt.id === value);
  const safeValue = isKnownValue ? value : null;
  return (
    <div className={styles.field}>
      <span className={styles.label}>{question.text}</span>
      <div className={styles.segmentRow}>
        {question.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={cx(styles.segmentBtn, safeValue === opt.id && styles.active)}
            aria-pressed={safeValue === opt.id}
            onClick={() => onSelect(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// 중개사에게 물어볼 것 (8개, 선택사항, 확인율·점수 계산 제외)
// q_pet만 3지선다 enum 컨트롤, 나머지 7개는 기존과 동일한 자유텍스트 인풋.
export function RealtorQuestions() {
  const { currentInspection, setQuestionAnswer } = useInspection();
  const questions = currentInspection.questions;

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>중개사에게 물어볼 것</h2>
      <div className={styles.list}>
        {QUESTIONS.map((question) => (
          <div key={question.id} className={styles.item}>
            {question.type === 'enum' ? (
              <PetAnswerControl
                question={question}
                value={questions[question.id]}
                onSelect={(optionId) => setQuestionAnswer(question.id, optionId, { immediate: true })}
              />
            ) : (
              <label className={styles.field}>
                <span className={styles.label}>{question.text}</span>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="답변을 입력해 주세요"
                  value={questions[question.id] || ''}
                  onChange={(event) => setQuestionAnswer(question.id, event.target.value)}
                />
              </label>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
