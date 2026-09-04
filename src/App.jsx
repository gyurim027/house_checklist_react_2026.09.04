// Task 3 임시 검증용 App.jsx — 저장소 레이어(useInspectionStore/InspectionStoreContext)의
// round-trip(생성 → 필드 변경 → localStorage 저장 → 새로고침 후 복원)을 눈으로 확인하기 위한
// 최소 배선. Task 4가 정식 AppShell로 이 파일 전체를 교체한다.
import { InspectionStoreProvider, useInspection } from './context/InspectionStoreContext.jsx';
import { UiFeedbackProvider } from './context/UiFeedbackContext.jsx';

function StoreProbe() {
  const { currentInspection, saveStatus, createInspection, setAlias, saveInspectionNow } = useInspection();

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Task 3 저장소 레이어 검증</h1>
      <p>saveStatus: {saveStatus}</p>
      <button type="button" onClick={() => createInspection()}>
        새 점검 생성
      </button>
      <button type="button" onClick={() => setAlias('테스트')} disabled={!currentInspection}>
        alias를 '테스트'로 설정 (debounce)
      </button>
      <button type="button" onClick={() => saveInspectionNow()} disabled={!currentInspection}>
        지금 저장
      </button>
      <p>currentInspection?.alias: {JSON.stringify(currentInspection?.alias ?? null)}</p>
      <p>currentInspection?.id: {JSON.stringify(currentInspection?.id ?? null)}</p>
      <pre style={{ background: '#f4f4f4', padding: 12, maxWidth: 640, overflow: 'auto' }}>
        {JSON.stringify(currentInspection, null, 2)}
      </pre>
    </div>
  );
}

function App() {
  return (
    <InspectionStoreProvider>
      <UiFeedbackProvider>
        <StoreProbe />
      </UiFeedbackProvider>
    </InspectionStoreProvider>
  );
}

export default App;
