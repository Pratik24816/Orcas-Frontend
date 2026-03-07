import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import TeamLeadDashboard from './pages/TeamLeadDashboard';
import WorkplaceDashboard from './pages/WorkplaceDashboard';
import DeveloperDetail from './pages/DeveloperDetail';
import InviteAcceptPage from './pages/InviteAcceptPage';
import DeveloperDashboard from './pages/DeveloperDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/invite/:token" element={<InviteAcceptPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="team_lead">
              <TeamLeadDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace/:id"
          element={
            <ProtectedRoute role="team_lead">
              <WorkplaceDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace/:id/developer/:devId"
          element={
            <ProtectedRoute role="team_lead">
              <DeveloperDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dev"
          element={
            <ProtectedRoute role="developer">
              <DeveloperDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;

