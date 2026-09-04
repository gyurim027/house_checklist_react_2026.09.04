import { QUESTIONS } from '../../data/checklistData.js';
import { useInspection } from '../../context/InspectionStoreContext.jsx';
import styles from './RealtorQuestions.module.css';

// 중개사에게 물어볼 것 (8개, 선택사항, 확인율·점수 계산 제외)
export function RealtorQuestions() {
  const { currentInspection, setQuestionAnswer } = useInspection();
  const questions = currentInspection.questions;

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>중개사에게 물어볼 것</h2>
      <div className={styles.list}>
        {QUESTIONS.map((question) => (
          <div key={question.id} className={styles.item}>
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
          </div>
        ))}
      </div>
    </section>
  );
}
