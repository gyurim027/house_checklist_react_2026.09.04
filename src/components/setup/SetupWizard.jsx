import { useState } from 'react';
import { useInspection } from '../../context/InspectionStoreContext.jsx';
import { AddressCard } from '../property/AddressCard.jsx';
import { VisitScheduleFields } from '../property/VisitScheduleFields.jsx';
import { PropertyTermsFields } from '../property/PropertyTermsFields.jsx';
import { RealtorFields } from '../property/RealtorFields.jsx';
import styles from './SetupWizard.module.css';

// 방문 일정 요약 줄(단계 2가 접혔을 때 보여줄 텍스트). 방문시간이 아직 없으면 방문일만 표시.
function visitSummary(visit) {
  return visit.time ? `방문일: ${visit.date} · 방문시간: ${visit.time}` : `방문일: ${visit.date}`;
}

// 포커스가 그룹(현재 펼쳐진 단계 바디) 밖으로 완전히 나갈 때만 onLeave를 호출한다.
// 같은 그룹 안의 다른 필드로 포커스가 옮겨가는 것(예: 주소 textarea → 별칭 input)은
// "이 단계를 떠난 것"으로 치지 않는다.
function handleGroupBlur(event, onLeave) {
  if (event.currentTarget.contains(event.relatedTarget)) return;
  onLeave();
}

// 게이트가 있는 단계(1·2)의 헤더. 게이트가 아직 충족되지 않은 동안은 접을 방법이 없으므로
// (그 값을 채워야 다음으로 넘어갈 수 있으니) 상호작용 없는 일반 헤더로 보여준다. 게이트가
// 충족된 뒤에만 클릭 가능한 토글로 바뀐다 — 접힌 요약 줄을 클릭하면 다시 펼쳐 값을
// 보거나 수정/삭제할 수 있고, 펼쳐진 상태에서 다시 클릭하면 요약 줄로 되돌린다.
function GatedStepHeader({ number, title, gatePassed, expanded, summary, onToggle }) {
  if (!gatePassed) {
    return (
      <div className={styles.header}>
        <span className={styles.stepBadge}>{number}</span>
        <span className={styles.stepTitle}>{title}</span>
      </div>
    );
  }
  return (
    <button type="button" className={styles.header} aria-expanded={expanded} onClick={onToggle}>
      <span className={styles.stepBadge}>{number}</span>
      <span className={styles.stepTitle}>{title}</span>
      {!expanded && summary && <span className={styles.stepSummary}>{summary}</span>}
    </button>
  );
}

// 게이트 없는 단계(3·4)의 헤더 — 단계 2 통과 시 단계 3·4·CTA가 함께 펼쳐지고 이후 계속
// 펼쳐진 채로 유지된다(별도 접기 상호작용 없음).
function StaticStepHeader({ number, title }) {
  return (
    <div className={styles.header}>
      <span className={styles.stepBadge}>{number}</span>
      <span className={styles.stepTitle}>{title}</span>
    </div>
  );
}

// 온보딩 마법사 — 체크리스트 화면과 완전히 분리된 별도 화면(라우터 없이 AppShell의 내부
// 뷰 상태로 전환). 4단계 아코디언 흐름:
//  1) 별칭·주소 — 게이트: alias.trim() !== ''
//  2) 방문 일정 — 게이트: visit.date !== '' (단계 1 게이트 통과 후에만 노출)
//  3) 매물 조건 및 관리비 } 단계 2 게이트 통과 시 셋이 한번에 노출(Ruling: 3·4 둘 다
//  4) 중개사 정보           필수 항목이 없어 "입력 완료"를 판정할 게이트가 없으므로).
//  CTA "기본 정보 입력 완료"
//
// 게이트는 라이브(반응형)다 — 한번 통과해도 해당 값을 지우면 이후 단계가 다시 숨는다.
//
// 단계 1·2 각각의 "접힘"은 게이트 충족 여부 + 그 상태에서 포커스가 그룹을 떠났는지(blur)로
// 결정한다 — 게이트가 충족되는 키 입력 "즉시" 접으면(예: 별칭 첫 글자를 입력하는 순간
// 입력 필드가 사라짐) 나머지 글자를 입력할 곳이 없어지는 문제가 생기기 때문이다. 게이트가
// 미충족일 때는 헤더가 아예 토글 불가능(상호작용 없는 일반 헤더)이므로, 접힌 상태에서
// 값을 지워 게이트가 다시 깨지는 경우는 발생할 수 없다(값을 지우려면 먼저 헤더를 클릭해
// 펼쳐야 하고, 그 순간 이미 접힘 상태가 풀려 있다) — 그래서 별도의 "게이트 실패 시 접힘
// 초기화" 로직이 필요 없다.
//
// 반면 단계 3/4/CTA의 "노출 여부"(laterVisible)는 이 접힘 타이밍과 무관하게 순수 게이트
// 값(aliasFilled && dateFilled)만으로 즉시 결정된다 — Ruling이 요구하는 "게이트 충족
// 즉시" 동작은 여기서 지킨다.
export function SetupWizard() {
  const { currentInspection, completeOnboarding } = useInspection();
  const { alias, visit } = currentInspection;

  const aliasFilled = alias.trim() !== '';
  const dateFilled = visit.date !== '';

  // collapsed1/2: 이 단계를 "요약 줄"로 보여줄지. 게이트가 충족된 상태에서 그룹 밖으로
  // blur 되거나, 사용자가 헤더를 클릭해 수동으로 접을 때만 true가 된다.
  const [collapsed1, setCollapsed1] = useState(() => aliasFilled);
  const [collapsed2, setCollapsed2] = useState(() => dateFilled);

  const step1Expanded = !aliasFilled || !collapsed1;
  const step2Visible = aliasFilled;
  const step2Expanded = step2Visible && (!dateFilled || !collapsed2);
  const laterVisible = aliasFilled && dateFilled;

  return (
    <div className={styles.wizard}>
      <h1 className={styles.heading}>기본 정보 입력</h1>
      <p className={styles.intro}>별칭과 방문일만 입력하면 바로 체크리스트를 시작할 수 있어요.</p>

      <section className={styles.step}>
        <GatedStepHeader
          number={1}
          title="별칭 · 주소"
          gatePassed={aliasFilled}
          expanded={step1Expanded}
          summary={`별칭: ${alias}`}
          onToggle={() => setCollapsed1((collapsed) => !collapsed)}
        />
        {step1Expanded && (
          <div
            className={styles.stepBody}
            onBlur={(event) => handleGroupBlur(event, () => aliasFilled && setCollapsed1(true))}
          >
            <AddressCard />
          </div>
        )}
      </section>

      {step2Visible && (
        <section className={styles.step}>
          <GatedStepHeader
            number={2}
            title="방문 일정"
            gatePassed={dateFilled}
            expanded={step2Expanded}
            summary={visitSummary(visit)}
            onToggle={() => setCollapsed2((collapsed) => !collapsed)}
          />
          {step2Expanded && (
            <div
              className={styles.stepBody}
              onBlur={(event) => handleGroupBlur(event, () => dateFilled && setCollapsed2(true))}
            >
              <VisitScheduleFields />
            </div>
          )}
        </section>
      )}

      {laterVisible && (
        <>
          <section className={styles.step}>
            <StaticStepHeader number={3} title="매물 조건 및 관리비" />
            <div className={styles.stepBody}>
              <PropertyTermsFields />
            </div>
          </section>

          <section className={styles.step}>
            <StaticStepHeader number={4} title="중개사 정보" />
            <p className={styles.optionalHint}>이름·연락처 모두 선택 입력이에요.</p>
            <div className={styles.stepBody}>
              <RealtorFields />
            </div>
          </section>

          <button type="button" className={styles.cta} onClick={() => completeOnboarding()}>
            기본 정보 입력 완료
          </button>
        </>
      )}
    </div>
  );
}
