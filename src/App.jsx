import { RouterProvider } from 'react-router-dom';
import { InspectionStoreProvider } from './context/InspectionStoreContext.jsx';
import { UiFeedbackProvider } from './context/UiFeedbackContext.jsx';
import { router } from './router.jsx';

function App() {
  return (
    <InspectionStoreProvider>
      <UiFeedbackProvider>
        <RouterProvider router={router} />
      </UiFeedbackProvider>
    </InspectionStoreProvider>
  );
}

export default App;
