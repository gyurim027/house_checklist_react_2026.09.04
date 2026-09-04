import { InspectionStoreProvider } from './context/InspectionStoreContext.jsx';
import { UiFeedbackProvider } from './context/UiFeedbackContext.jsx';
import { AppShell } from './components/layout/AppShell.jsx';

function App() {
  return (
    <InspectionStoreProvider>
      <UiFeedbackProvider>
        <AppShell />
      </UiFeedbackProvider>
    </InspectionStoreProvider>
  );
}

export default App;
