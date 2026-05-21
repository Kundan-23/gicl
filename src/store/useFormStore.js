import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFormStore = create(
  persist(
    (set) => ({
      // Step 2: Basic Registration Data
      basicInfo: {
        referralPhone: '',
        referralFirstName: '',
        referralLastName: '',
        firstName: '',
        lastName: '',
        dob: '',
        email: '',
        whatsapp: '+91',
        jerseySize: '',
        address: '',
        city: '',
        pincode: '',
        instagramLink: '',
        instagramApproved: false,
        acceptedTerms: false,
      },
      updateBasicInfo: (data) => set((state) => ({ basicInfo: { ...state.basicInfo, ...data } })),

      // Step 4: Player Profile
      playerProfile: {
        height: '',
        weight: '',
        age: '', // Auto-calculated
        instagramLink: '',
        ballsSelected: [], // Red, White, Pink, Tennis, None
        battingStyle: '', // RHB, LHB, None
        bowlingStyle: '', // Right-Arm Fast, etc.
        fieldPositions: [], // Selected field positions
        cricketHistory: [{ level: 'International', matches: 0 }, { level: 'National', matches: 0 }, { level: 'State', matches: 0 }, { level: 'District', matches: 0 }, { level: 'Taluka', matches: 0 }],
        clubAssociated: 'no',
        clubName: '',
      },
      updatePlayerProfile: (data) => set((state) => ({ playerProfile: { ...state.playerProfile, ...data } })),

      // Step 5: Media & Tutorials
      media: {
        videoLink: '',
        instagramMediaApproved: false,
        galleryUrls: [],
      },
      updateMedia: (data) => set((state) => ({ media: { ...state.media, ...data } })),

      // Dashboard State
      dashboardState: {
        isDashboardUnlocked: false, // Locked to tutorials initially
        profilePhotoUrl: '',
        referralBalance: 0, // INR balance
        myReferralCode: 'GICL-' + Math.floor(1000 + Math.random() * 9000),
        referrals: [], // { name, status, amountEarned }
        upcomingMatches: [
          { id: 1, date: '2026-06-01T10:00:00Z', opponent: 'Mumbai Strikers', location: 'Oval Maidan', type: 'League Match' },
          { id: 2, date: '2026-06-15T14:30:00Z', opponent: 'Pune Royals', location: 'DY Patil Stadium', type: 'Quarter Final' }
        ]
      },
      updateDashboard: (data) => set((state) => ({ dashboardState: { ...state.dashboardState, ...data } })),
      unlockDashboard: () => set((state) => ({ dashboardState: { ...state.dashboardState, isDashboardUnlocked: true } })),
      simulateFriendRegistration: () => set((state) => {
        const referralCount = state.dashboardState.referrals.length;
        let amountEarned = 0;
        if (referralCount === 0) amountEarned = 50;
        else if (referralCount === 1) amountEarned = 20;
        else amountEarned = 10;

        const newReferral = { name: `Player ${referralCount + 1}`, status: 'Completed', amountEarned };
        return {
          dashboardState: {
            ...state.dashboardState,
            referralBalance: state.dashboardState.referralBalance + amountEarned,
            referrals: [...state.dashboardState.referrals, newReferral]
          }
        };
      }),

      // Global actions
      resetForm: () => set({
        basicInfo: {
          referralPhone: '',
          referralFirstName: '',
          referralLastName: '',
          firstName: '',
          lastName: '',
          dob: '',
          email: '',
          whatsapp: '+91',
          jerseySize: '',
          address: '',
          city: '',
          pincode: '',
          instagramLink: '',
          instagramApproved: false,
          acceptedTerms: false,
        },
        playerProfile: {
          height: '', weight: '', age: '', instagramLink: '', ballsSelected: [], battingStyle: '', bowlingStyle: '', fieldPositions: [], cricketHistory: [{ level: 'International', matches: 0 }, { level: 'National', matches: 0 }, { level: 'State', matches: 0 }, { level: 'District', matches: 0 }, { level: 'Taluka', matches: 0 }], clubAssociated: 'no', clubName: ''
        },
        media: { videoLink: '', instagramMediaApproved: false, galleryUrls: [] }
      })
    }),
    {
      name: 'gicl-registration-storage',
      version: 1, // Incremented to clear old cached defaults
    }
  )
);
