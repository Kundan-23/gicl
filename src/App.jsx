import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MobileLayout from './components/layout/MobileLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Step1_Terms from './pages/PlayerOnboarding/Step1_Terms';
import Step2_BasicRegistration from './pages/PlayerOnboarding/Step2_BasicRegistration';
import Step3_Payment from './pages/PlayerOnboarding/Step3_Payment';
import Step4_PlayerProfile from './pages/PlayerOnboarding/Step4_PlayerProfile';
import Step5_MyGameplay from './pages/PlayerOnboarding/Step5_MyGameplay';
import DashboardLayout from './components/layout/DashboardLayout';
import PlayerDashboard from './pages/Dashboard/PlayerDashboard';
import MatchesCalendar from './pages/Dashboard/MatchesCalendar';
import ReferralSystem from './pages/Dashboard/ReferralSystem';
import Tutorials from './pages/Dashboard/Tutorials';

// Coach Imports
import CoachRegistrationFlow from './pages/CoachOnboarding/CoachRegistrationFlow';
import CoachDashboardLayout from './components/layout/CoachDashboardLayout';
import CoachDashboardHome from './pages/CoachDashboard/CoachDashboardHome';
import SquadOverview from './pages/CoachDashboard/SquadOverview';
import VideoScrutiny from './pages/CoachDashboard/VideoScrutiny';
import TeamBuilder from './pages/CoachDashboard/TeamBuilder';
import CoachMatchesCalendar from './pages/CoachDashboard/CoachMatchesCalendar';
import CoachReferralSystem from './pages/CoachDashboard/CoachReferralSystem';
import CoachUploads from './pages/CoachDashboard/CoachUploads';

// Admin Imports
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboardLayout from './components/layout/AdminDashboardLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AppConfig from './pages/Admin/AppConfig';
import PlayerConfig from './pages/Admin/PlayerConfig';
import PlayerManagement from './pages/Admin/PlayerManagement';
import CoachManagement from './pages/Admin/CoachManagement';
import PlayerAllotment from './pages/Admin/PlayerAllotment';
import AdminVideoScrutiny from './pages/Admin/VideoScrutiny';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MobileLayout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="onboarding/step1" element={<Step1_Terms />} />
          <Route path="onboarding/step2" element={<Step2_BasicRegistration />} />
          <Route path="onboarding/payment" element={<Step3_Payment />} />
          <Route path="onboarding/step4" element={<Step4_PlayerProfile />} />
          <Route path="onboarding/step5" element={<Step5_MyGameplay />} />
        </Route>
        
        {/* Coach Onboarding Route */}
        <Route path="/coach-onboarding" element={
          <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', color: 'var(--text-primary)' }}>
            <CoachRegistrationFlow />
          </div>
        } />
        
        {/* Player Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<PlayerDashboard />} />
          <Route path="matches" element={<MatchesCalendar />} />
          <Route path="referral" element={<ReferralSystem />} />
          <Route path="tutorials" element={<Tutorials />} />
        </Route>

        {/* Coach Dashboard Routes */}
        <Route path="/coach-dashboard" element={<CoachDashboardLayout />}>
          <Route index element={<CoachDashboardHome />} />
          <Route path="squad" element={<SquadOverview />} />
          <Route path="uploads" element={<CoachUploads />} />
          <Route path="scrutiny" element={<VideoScrutiny />} />
          <Route path="teams" element={<TeamBuilder />} />
          <Route path="matches" element={<CoachMatchesCalendar />} />
          <Route path="referral" element={<CoachReferralSystem />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="config" element={<AppConfig />} />
          <Route path="player-config" element={<PlayerConfig />} />
          <Route path="players" element={<PlayerManagement />} />
          <Route path="coaches" element={<CoachManagement />} />
          <Route path="allotment" element={<PlayerAllotment />} />
          <Route path="scrutiny" element={<AdminVideoScrutiny />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
