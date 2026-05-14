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
        cricketType: '', // tennis, synthetic, season, soft leather
        battingHand: '', // leftie, rightie
        height: '',
        bowlTypePlayed: '',
        bowlingHand: '', // leftie, rightie
        bowlingType: '', // fast, spin, pace
        wicketkeeping: '', // yes, no
        fieldPosition: '',
        matchesPlayed: '',
        levelPlayed: '', // taluka, district, state, national, international
        clubAssociated: '', // yes, no
        clubDetails: '',
        playOutsideClub: '', // yes, no
      },
      updatePlayerProfile: (data) => set((state) => ({ playerProfile: { ...state.playerProfile, ...data } })),

      // Step 5: Media & Tutorials
      media: {
        videoLink: '',
        instagramMediaApproved: false,
        galleryUrls: [],
      },
      updateMedia: (data) => set((state) => ({ media: { ...state.media, ...data } })),

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
          cricketType: '', battingHand: '', height: '', bowlTypePlayed: '', bowlingHand: '', bowlingType: '', wicketkeeping: '', fieldPosition: '', matchesPlayed: '', levelPlayed: '', clubAssociated: '', clubDetails: '', playOutsideClub: ''
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
