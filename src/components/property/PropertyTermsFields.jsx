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

// 거래유형(전세/매매/월세) 세그먼트 + 유형별 금액 입력 + 관리비 있음/없음 토글.
// Task 9에서 만든 로직/검증 규칙 그대로(변경 없음) — 재사용 가능한 조각으로 위치만 옮김.
// 거래 유형/있음-없음 토글은 즉시 저장, 금액 숫자 입력은 500ms debounce.
export function PropertyTermsFields() {
  const { currentInspection, updateVisitField } = useInspection();
  const visit = currentInspection.visit;

  return (
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
  );
}
