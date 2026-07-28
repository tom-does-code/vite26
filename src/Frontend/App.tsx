import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthPage from './Pages/AuthPage';
import TasksPage from './Pages/TasksPage';
import StatsPage from './Pages/StatsPage';
import BudgetPage from './Pages/BudgetPage';
import SettingsPage from './Pages/SettingsPage';
import NotFoundPage from './Pages/NotFoundPage';
import AppLayout from './Components/AppLayout';
import ProtectedRoute from './Components/ProtectedRoute';
import AuthProvider from './Context/AuthProvider';
import PreferencesProvider from './Context/PreferencesProvider';
import ToastProvider from './Context/ToastProvider';
import { useAuth } from './Context/AuthContext';

function LandingRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return user ? <Navigate to="/tasks" replace /> : <AuthPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PreferencesProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<LandingRoute />} />

              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/budget" element={<BudgetPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ToastProvider>
        </PreferencesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
