import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MobileLayout from './components/layout/MobileLayout';
import Landing from './pages/Landing';
import Step1_Terms from './pages/PlayerOnboarding/Step1_Terms';
import Step2_BasicRegistration from './pages/PlayerOnboarding/Step2_BasicRegistration';
import Step3_Payment from './pages/PlayerOnboarding/Step3_Payment';
import Step4_PlayerProfile from './pages/PlayerOnboarding/Step4_PlayerProfile';
import Step5_MediaTutorials from './pages/PlayerOnboarding/Step5_MediaTutorials';
import DashboardLayout from './components/layout/DashboardLayout';
import PlayerDashboard from './pages/Dashboard/PlayerDashboard';
import MatchesCalendar from './pages/Dashboard/MatchesCalendar';
import ReferralSystem from './pages/Dashboard/ReferralSystem';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MobileLayout />}>
          <Route index element={<Landing />} />
          <Route path="onboarding/step1" element={<Step1_Terms />} />
          <Route path="onboarding/step2" element={<Step2_BasicRegistration />} />
          <Route path="onboarding/payment" element={<Step3_Payment />} />
          <Route path="onboarding/step4" element={<Step4_PlayerProfile />} />
          <Route path="onboarding/step5" element={<Step5_MediaTutorials />} />
        </Route>
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<PlayerDashboard />} />
          <Route path="matches" element={<MatchesCalendar />} />
          <Route path="referral" element={<ReferralSystem />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
