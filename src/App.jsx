import { RouterProvider } from 'react-router-dom';
import { InspectionStoreProvider } from './context/InspectionStoreContext.jsx';
import { UiFeedbackProvider } from './context/UiFeedbackContext.jsx';
import { PreferencesProvider } from './context/PreferencesContext.jsx';
import { router } from './router.jsx';

function App() {
  return (
    <InspectionStoreProvider>
      <UiFeedbackProvider>
        <PreferencesProvider>
          <RouterProvider router={router} />
        </PreferencesProvider>
      </UiFeedbackProvider>
    </InspectionStoreProvider>
  );
}

export default App;
