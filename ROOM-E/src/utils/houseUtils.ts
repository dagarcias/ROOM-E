import { House, User } from '../types';

/**
 * Generates a random 6-character uppercase alphanumeric invite code.
 */
export const generateInviteCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

/**
 * Generates a random 8-character ID for new entities.
 */
export const generateHouseId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

/**
 * Pure function to create a new house object.
 * Extracts the logic so it can be tested independently of the store.
 */
export const createNewHouseEntity = (name: string, creator: User): House => {
  const inviteCode = generateInviteCode();
  const id = generateHouseId();
  
  return {
    id,
    name,
    inviteCode,
    members: [{ userId: creator.id, role: 'admin', status: 'active' }]
  };
};
