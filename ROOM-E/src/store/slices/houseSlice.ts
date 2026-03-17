import { StateCreator } from 'zustand';
import { House, User } from '../../types';
import { StoreState } from '../types';
import { createNewHouseEntity } from '../../utils/houseUtils';

export interface HouseSlice {
  currentHouseId: string | null;
  houses: House[];
  houseMembers: User[];
  createHouse: (name: string) => void;
  requestJoinHouse: (code: string) => 'success' | 'invalid' | 'already_in';
  approveMember: (houseId: string, userId: string) => void;
  resetHouseState: () => void;
}

export const createHouseSlice: StateCreator<
  StoreState,
  [],
  [],
  HouseSlice
> = (set, get) => ({
  currentHouseId: null,
  houses: [],
  houseMembers: [], // populated dynamically when user creates/joins a house

  createHouse: (name) => set((state) => {
    // Cross-domain access: reading user from AuthSlice
    const currentUser = state.user;
    if (!currentUser) return state;
    
    // Use pure utility function to decouple generation logic
    const newHouse = createNewHouseEntity(name, currentUser);

    return {
      houses: [...state.houses, newHouse],
      currentHouseId: newHouse.id,
    };
  }),

  requestJoinHouse: (code) => {
    let result: 'success' | 'invalid' | 'already_in' = 'invalid';
    
    set((state) => {
      const currentUser = state.user;
      if (!currentUser) return state;

      const houseIndex = state.houses.findIndex(h => h.inviteCode === code);
      if (houseIndex === -1) {
        result = 'invalid';
        return state;
      }

      const house = state.houses[houseIndex];
      const existingMember = house.members.find(m => m.userId === currentUser.id);
      
      if (existingMember) {
        result = 'already_in';
        return { currentHouseId: house.id };
      }

      // Add user as pending member
      const updatedHouses = [...state.houses];
      updatedHouses[houseIndex] = {
        ...house,
        members: [...house.members, { userId: currentUser.id, role: 'member', status: 'pending' }]
      };

      result = 'success';
      return { houses: updatedHouses, currentHouseId: house.id };
    });

    return result;
  },

  approveMember: (houseId, userId) => set((state) => {
    const updatedHouses = state.houses.map(house => {
      if (house.id === houseId) {
        return {
          ...house,
          members: house.members.map(member => 
            member.userId === userId ? { ...member, status: 'active' as const } : member
          )
        };
      }
      return house;
    });

    return { houses: updatedHouses };
  }),

  resetHouseState: () => set({ currentHouseId: null }),
});
