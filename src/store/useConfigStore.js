import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useConfigStore = create(
  persist(
    (set) => ({
      // Categories & Demographics
      ageGroups: [
        { id: 1, cat: 'Juniors', sub: 'Boys U-13', color: '#3b82f6' },
        { id: 2, cat: 'Juniors', sub: 'Boys U-15', color: '#4f46e5' },
        { id: 3, cat: 'Juniors', sub: 'Girls U-17', color: '#ec4899' },
        { id: 4, cat: 'Juniors', sub: 'Boys U-22', color: '#06b6d4' },
        { id: 5, cat: 'Open', sub: 'Men', color: '#10b981' },
        { id: 6, cat: 'Open', sub: 'Women', color: '#14b8a6' },
        { id: 7, cat: 'Masters', sub: '35+', color: '#f97316' },
        { id: 8, cat: 'Masters', sub: '40+', color: '#f59e0b' },
        { id: 9, cat: 'Masters', sub: '45+', color: '#ef4444' },
        { id: 10, cat: 'Masters', sub: '50+', color: '#a855f7' },
        { id: 11, cat: 'Masters', sub: '55+', color: '#d946ef' },
        { id: 12, cat: 'Masters', sub: '60+', color: '#8b5cf6' }
      ],
      jerseySizes: ['Kid-S', 'Kid-M', 'Kid-L', 'S', 'M', 'L', 'XL', 'XXL'],
      battingStyles: ['Right-hand Bat', 'Left-hand Bat'],
      bowlingStyles: ['Right-arm Fast', 'Right-arm Off Spin', 'Left-arm Orthodox', 'Right-arm Leg Spin', 'None'],
      clubs: ['Mumbai Strikers', 'Delhi Capitals Academy', 'Chennai Super Kings Academy', 'Royal Challengers Academy'],
      ballTypes: [
        { id: 'red', name: 'Red Leather', image: '/images/balls/red.png' },
        { id: 'white', name: 'White Leather', image: '/images/balls/white.png' },
        { id: 'pink', name: 'Pink Leather', image: '/images/balls/pink.png' },
        { id: 'tennis', name: 'Tennis Ball', image: '/images/balls/tennis.png' }
      ],
      landingBgImage: '',
      
      // Text & Policies
      registrationTerms: "By completing this registration, you agree to abide by the rules and regulations of GICL Sports...",
      
      // Pricing & Plans
      plans: [
        { id: 'p1', name: 'Basic Pack', price: 299, features: ['2 Matches Guaranteed', 'Standard Jersey', 'Basic Training Videos'], terms: 'Non-refundable.' },
        { id: 'p2', name: 'Elite Pack', price: 699, features: ['5 Matches Guaranteed', 'Premium Jersey', 'Advance Training Videos', 'One-on-One Coaching Session'], terms: 'Refundable within 7 days.' }
      ],
      
      // Points & Limits
      referralPoints: { perUser: 0.5 },
      maxSquadSize: 20,
      matchTeamSize: 11,

      // Banners
      banners: [
        { id: 1, text: "GICL Mega Tournament Registration Open!", color: "linear-gradient(135deg, #1e3a8a, #3b82f6)", image: null },
        { id: 2, text: "Refer a Friend & Earn ₹50 Cash!", color: "linear-gradient(135deg, #b45309, #f59e0b)", image: null },
        { id: 3, text: "New Training Videos Uploaded", color: "linear-gradient(135deg, #064e3b, #10b981)", image: null }
      ],
      adBanners: [
        { id: 'ab1', text: 'Sponsor Ad 1', color: '#f59e0b', image: '' }
      ],

      // Generic Update Actions
      updateAgeGroups: (newGroups) => set({ ageGroups: newGroups }),
      updateJerseySizes: (sizes) => set({ jerseySizes: sizes }),
      updateBattingStyles: (styles) => set({ battingStyles: styles }),
      updateBowlingStyles: (styles) => set({ bowlingStyles: styles }),
      updateClubs: (newClubs) => set({ clubs: newClubs }),
      updateRegistrationTerms: (text) => set({ registrationTerms: text }),
      updatePlans: (newPlans) => set({ plans: newPlans }),
      updateBanners: (newBanners) => set({ banners: newBanners }),
      updateAdBanners: (newAdBanners) => set({ adBanners: newAdBanners }),
      updateBallTypes: (arr) => set({ ballTypes: arr }),
      updateLandingBgImage: (base64) => set({ landingBgImage: base64 }),
      
      // Specific Updates
      updateReferralPoints: (points) => set({ referralPoints: { perUser: points } }),
      updateMaxSquadSize: (size) => set({ maxSquadSize: size }),
      updateMatchTeamSize: (size) => set({ matchTeamSize: size }),
    }),
    {
      name: 'gicl-admin-config',
      version: 2,
    }
  )
);
