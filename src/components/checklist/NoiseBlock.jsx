import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { NOISE_LEVELS } from '../../data/checklistData.js';
import { cx } from '../../lib/classNames.js';
import styles from './NoiseBlock.module.css';

// E_noise 카테고리 카드 안에서만 렌더되는 소음 정도 라디오 그룹. 상태 변경은 즉시 저장.
export function NoiseBlock() {
  const { currentInspection, setNoiseLevel } = useInspection();

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>소음 정도</legend>
      <div className={styles.options}>
        {NOISE_LEVELS.map((level) => {
          const checked = currentInspection.noiseLevel === level.id;
          return (
            <label key={level.id} className={cx(styles.option, checked && styles.checked)}>
              <input
                type="radio"
                name="noiseLevel"
                className={styles.radio}
                value={level.id}
                checked={checked}
                onChange={() => setNoiseLevel(level.id)}
              />
              {level.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
