import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useConfigStore } from './useConfigStore';

const generateMockPlayers = () => {
  const players = [];
  const styles = ['Right-hand Bat', 'Left-hand Bat'];
  const bowls = ['Right-arm Fast', 'Right-arm Off Spin', 'Left-arm Orthodox', 'Right-arm Leg Spin', 'None'];
  
  const ageGroups = useConfigStore.getState().ageGroups;

  for (let i = 1; i <= 16; i++) {
    const ag = ageGroups[Math.floor(Math.random() * ageGroups.length)];
    players.push({
      id: `P${i}`,
      name: `Player ${i}`,
      age: Math.floor(Math.random() * 30) + 12,
      height: Math.floor(Math.random() * 30) + 160,
      battingStyle: styles[Math.floor(Math.random() * styles.length)],
      bowlingStyle: bowls[Math.floor(Math.random() * bowls.length)],
      matchesPlayed: Math.floor(Math.random() * 50),
      profilePic: `https://ui-avatars.com/api/?name=Player+${i}&background=0f172a&color=ffc72c`,
      category: ag.cat,
      subCategory: ag.sub,
      color: ag.color
    });
  }
  return players;
};

// Helper to generate mock videos for scrutiny
const generateMockVideos = (players) => {
  const videos = [];
  // Randomly assign a video to 5 of the players initially
  for (let i = 0; i < 5; i++) {
    const player = players[Math.floor(Math.random() * players.length)];
    videos.push({
      id: `V${i}`,
      playerId: player.id,
      playerName: player.name,
      title: 'Net Practice - Batting Footwork',
      thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&h=300&fit=crop',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      status: 'Pending', // Pending, Reviewed
      reviewComment: '',
      reviewFlag: null, // 'green', 'yellow', 'red'
      dateUploaded: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
    });
  }
  return videos;
};

const initialPlayers = generateMockPlayers();
const initialVideos = generateMockVideos(initialPlayers);

export const useCoachStore = create(
  persist(
    (set, get) => ({
      // Onboarding State
      onboardingData: {
        name: '',
        age: '',
        cricketHistory: '',
        coachingHistory: '',
        referralPhone: '',
      },
      updateOnboardingData: (data) => set((state) => ({ onboardingData: { ...state.onboardingData, ...data } })),

      // Dashboard State
      dashboardData: {
        allocatedPlayers: initialPlayers,
        videos: initialVideos,
        teams: [], // Array of { id, name, playerIds: [] }
        myUploads: [
          { id: 'U1', title: 'Basic Batting Stance Drill', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', date: new Date().toISOString() }
        ],
        notifications: initialVideos.map(v => ({
          id: `N${Math.random()}`,
          message: `${v.playerName} uploaded a new video for scrutiny.`,
          isRead: false,
          date: v.dateUploaded
        })),
        upcomingMatches: [
          { id: 1, date: '2026-06-05T10:00:00Z', opponent: 'Delhi Capitals', location: 'Arun Jaitley Stadium', type: 'League Match' },
          { id: 2, date: '2026-06-20T14:30:00Z', opponent: 'Chennai Super Kings', location: 'Chepauk Stadium', type: 'Semi Final' }
        ],
        referralPoints: 0,
        myReferralCode: 'COACH-' + Math.floor(1000 + Math.random() * 9000),
        referrals: [], 
      },
      
      // Dashboard Actions
      addUpload: (title, url) => set((state) => {
        const newUpload = { id: `U${Date.now()}`, title, url, date: new Date().toISOString() };
        const currentUploads = state.dashboardData.myUploads || [];
        return { dashboardData: { ...state.dashboardData, myUploads: [newUpload, ...currentUploads] } };
      }),

      submitVideoReview: (videoId, comment, flag) => set((state) => {
        const updatedVideos = state.dashboardData.videos.map(v => 
          v.id === videoId ? { ...v, status: 'Reviewed', reviewComment: comment, reviewFlag: flag } : v
        );
        return { dashboardData: { ...state.dashboardData, videos: updatedVideos } };
      }),

      markNotificationsRead: () => set((state) => {
        const updatedNotifs = state.dashboardData.notifications.map(n => ({ ...n, isRead: true }));
        return { dashboardData: { ...state.dashboardData, notifications: updatedNotifs } };
      }),

      createTeam: (teamName, playerIds) => set((state) => {
        const newTeam = {
          id: `T${Date.now()}`,
          name: teamName,
          playerIds: playerIds
        };
        return { dashboardData: { ...state.dashboardData, teams: [...state.dashboardData.teams, newTeam] } };
      }),

      simulateCoachReferral: () => set((state) => {
        const newReferral = { name: `Coach/Player ${state.dashboardData.referrals.length + 1}`, status: 'Completed', pointsEarned: 0.5 };
        return {
          dashboardData: {
            ...state.dashboardData,
            referralPoints: state.dashboardData.referralPoints + 0.5,
            referrals: [...state.dashboardData.referrals, newReferral]
          }
        };
      }),

      resetCoachForm: () => set({
        onboardingData: { name: '', age: '', cricketHistory: '', coachingHistory: '', referralPhone: '' }
      })
    }),
    {
      name: 'gicl-coach-storage',
      version: 3,
    }
  )
);
