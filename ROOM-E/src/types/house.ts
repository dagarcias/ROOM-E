export type Role = 'admin' | 'member';
export type MemberStatus = 'pending' | 'active';

export interface HouseMember {
  userId: string;
  role: Role;
  status: MemberStatus;
}

export interface House {
  id: string;
  name: string;
  inviteCode: string;
  members: HouseMember[];
}
