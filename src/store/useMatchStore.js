import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMatchStore = create(
  persist(
    (set, get) => ({
      matches: [
        { 
          id: 'M1', 
          date: '2026-06-05T10:00:00Z', 
          opponent: 'Delhi Capitals', 
          location: 'Arun Jaitley Stadium', 
          type: 'League Match',
          minSquadSize: 11,
          maxSquadSize: 15
        },
        { 
          id: 'M2', 
          date: '2026-06-20T14:30:00Z', 
          opponent: 'Chennai Super Kings', 
          location: 'Chepauk Stadium', 
          type: 'Semi Final',
          minSquadSize: 11,
          maxSquadSize: 16
        }
      ],
      
      addMatch: (match) => set((state) => ({
        matches: [...state.matches, { ...match, id: `M${Date.now()}` }]
      })),

      updateMatch: (updatedMatch) => set((state) => ({
        matches: state.matches.map(m => m.id === updatedMatch.id ? updatedMatch : m)
      })),

      deleteMatch: (id) => set((state) => ({
        matches: state.matches.filter(m => m.id !== id)
      })),
    }),
    {
      name: 'gicl-match-storage',
      version: 1,
    }
  )
);
