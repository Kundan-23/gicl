import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useConfigStore = create(
  persist(
    (set) => ({
      // Default Global Configurations
      ageGroups: [
        { id: 1, cat: 'Juniors', sub: 'Boys U-13', color: '#3b82f6' }, // Blue
        { id: 2, cat: 'Juniors', sub: 'Boys U-15', color: '#4f46e5' }, // Indigo
        { id: 3, cat: 'Juniors', sub: 'Girls U-17', color: '#ec4899' }, // Pink
        { id: 4, cat: 'Juniors', sub: 'Boys U-22', color: '#06b6d4' }, // Cyan
        { id: 5, cat: 'Open', sub: 'Men', color: '#10b981' }, // Green
        { id: 6, cat: 'Open', sub: 'Women', color: '#14b8a6' }, // Teal
        { id: 7, cat: 'Masters', sub: '35+', color: '#f97316' }, // Orange
        { id: 8, cat: 'Masters', sub: '40+', color: '#f59e0b' }, // Amber
        { id: 9, cat: 'Masters', sub: '45+', color: '#ef4444' }, // Red
        { id: 10, cat: 'Masters', sub: '50+', color: '#a855f7' }, // Purple
        { id: 11, cat: 'Masters', sub: '55+', color: '#d946ef' }, // Fuchsia
        { id: 12, cat: 'Masters', sub: '60+', color: '#8b5cf6' }  // Violet
      ],
      pricing: {
        basic: 299,
        elite: 699,
      },
      referralPoints: {
        perUser: 0.5,
      },
      
      // Admin Actions
      updateAgeGroups: (newGroups) => set({ ageGroups: newGroups }),
      updatePricing: (basic, elite) => set({ pricing: { basic, elite } }),
      updateReferralPoints: (points) => set({ referralPoints: { perUser: points } }),
    }),
    {
      name: 'gicl-admin-config',
      version: 1,
    }
  )
);
