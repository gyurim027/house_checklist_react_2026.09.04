import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { DEAL_TYPES } from '../../data/checklistData.js';
import { cx } from '../../lib/classNames.js';
import { formatManwon } from '../../lib/formatCurrency.js';
import styles from './VisitInfoCard.module.css';

// 숫자 이외 문자를 제거해 저장한다(만원 단위 숫자 문자열).
function sanitizeDigits(raw) {
  return raw.replace(/\D/g, '');
}

// 금액 입력 1개: 라벨 + 숫자입력(고정 "만원" 단위) + 값이 있으면 formatManwon 보조텍스트. debounce 저장.
function AmountField({ label, value, onChange }) {
  const helper = formatManwon(value);
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <div className={styles.amountInputWrap}>
        <input
          type="text"
          inputMode="numeric"
          className={styles.amountInput}
          value={value}
          onChange={(event) => onChange(sanitizeDigits(event.target.value))}
        />
        <span className={styles.unit}>만원</span>
      </div>
      {helper && <span className={styles.helperText}>{helper}</span>}
    </label>
  );
}

// [있음]/[없음] 세그먼트 버튼 2개. immediate 저장. 값 자체는 지우지 않고 노출 여부만 바꾼다.
function HasNoneToggle({ label, value, onSelect }) {
  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <div className={styles.segmentRow}>
        <button
          type="button"
          className={cx(styles.segmentBtn, value === 'has' && styles.active)}
          aria-pressed={value === 'has'}
          onClick={() => onSelect('has')}
        >
          있음
        </button>
        <button
          type="button"
          className={cx(styles.segmentBtn, value === 'none' && styles.active)}
          aria-pressed={value === 'none'}
          onClick={() => onSelect('none')}
        >
          없음
        </button>
      </div>
    </div>
  );
}

// 방문일/방문시간/거래유형/있음-없음 토글은 즉시 저장, 중개사·금액 숫자 입력은 500ms debounce.
export function VisitInfoCard() {
  const { currentInspection, updateVisitField } = useInspection();
  const visit = currentInspection.visit;

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>방문 정보</h2>

      <h3 className={styles.subtitle}>방문 일정</h3>
      <div className={styles.grid}>
        <label className={styles.field}>
          <span className={styles.label}>방문일</span>
          <input
            type="date"
            className={styles.input}
            value={visit.date}
            onChange={(event) => updateVisitField('date', event.target.value, { immediate: true })}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>방문시간</span>
          <input
            type="time"
            className={styles.input}
            value={visit.time}
            onChange={(event) => updateVisitField('time', event.target.value, { immediate: true })}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>중개사/연락처</span>
          <input
            type="text"
            className={styles.input}
            placeholder="예: ○○공인중개사 010-0000-0000"
            value={visit.realtor}
            onChange={(event) => updateVisitField('realtor', event.target.value)}
          />
        </label>
      </div>

      <h3 className={styles.subtitle}>매물 조건</h3>
      <div className={styles.section}>
        <div className={styles.field}>
          <span className={styles.label}>거래 유형</span>
          <div className={styles.segmentRow}>
            {DEAL_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                className={cx(styles.segmentBtn, visit.dealType === type.id && styles.active)}
                aria-pressed={visit.dealType === type.id}
                onClick={() => updateVisitField('dealType', type.id, { immediate: true })}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {visit.dealType === 'jeonse' && (
          <AmountField
            label="전세금"
            value={visit.jeonseAmount}
            onChange={(value) => updateVisitField('jeonseAmount', value)}
          />
        )}

        {visit.dealType === 'maemae' && (
          <AmountField
            label="매매가"
            value={visit.maemaeAmount}
            onChange={(value) => updateVisitField('maemaeAmount', value)}
          />
        )}

        {visit.dealType === 'wolse' && (
          <>
            <HasNoneToggle
              label="보증금"
              value={visit.wolseDepositType}
              onSelect={(value) => updateVisitField('wolseDepositType', value, { immediate: true })}
            />
            {visit.wolseDepositType === 'has' && (
              <AmountField
                label="보증금 금액"
                value={visit.wolseDeposit}
                onChange={(value) => updateVisitField('wolseDeposit', value)}
              />
            )}
            <AmountField
              label="월세"
              value={visit.wolseRent}
              onChange={(value) => updateVisitField('wolseRent', value)}
            />
          </>
        )}

        <HasNoneToggle
          label="관리비"
          value={visit.managementFeeType}
          onSelect={(value) => updateVisitField('managementFeeType', value, { immediate: true })}
        />
        {visit.managementFeeType === 'has' && (
          <AmountField
            label="관리비 금액"
            value={visit.managementFeeAmount}
            onChange={(value) => updateVisitField('managementFeeAmount', value)}
          />
        )}
      </div>
    </section>
  );
}
