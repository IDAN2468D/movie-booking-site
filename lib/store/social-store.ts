import { create } from 'zustand';

export interface GroupMember {
  id: string;
  name: string;
  email: string;
  isPaid: boolean;
  isOwner: boolean;
}

interface SocialState {
  isSocialMode: boolean;
  groupId: string | null;
  groupMembers: GroupMember[];
  inviteCode: string | null;
  
  // Actions
  setSocialMode: (val: boolean) => void;
  initializeGroup: (ownerName: string, ownerEmail: string) => void;
  joinGroup: (inviteCode: string, name: string, email: string) => void;
  addGroupMember: (name: string, email: string) => void;
  removeGroupMember: (id: string) => void;
  togglePaymentStatus: (id: string) => void;
  resetGroup: () => void;
  generateInviteCode: () => string;
}

export const useSocialStore = create<SocialState>((set, get) => ({
  isSocialMode: false,
  groupId: null,
  groupMembers: [],
  inviteCode: null,

  setSocialMode: (val) => set({ isSocialMode: val }),

  generateInviteCode: () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    set({ inviteCode: code });
    return code;
  },

  initializeGroup: (name, email) => {
    const code = get().generateInviteCode();
    set({
      isSocialMode: true,
      groupId: `group_${Date.now()}`,
      inviteCode: code,
      groupMembers: [{
        id: 'owner',
        name,
        email,
        isPaid: false,
        isOwner: true
      }]
    });
  },

  joinGroup: (inviteCode, name, email) => {
    // In a real app, this would verify with a backend
    set((state) => ({
      isSocialMode: true,
      inviteCode,
      groupMembers: [
        ...state.groupMembers,
        {
          id: Math.random().toString(36).substring(2, 9),
          name,
          email,
          isPaid: false,
          isOwner: false
        }
      ]
    }));
  },

  addGroupMember: (name, email) => set((state) => ({
    groupMembers: [
      ...state.groupMembers,
      {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        isPaid: false,
        isOwner: false
      }
    ]
  })),

  removeGroupMember: (id) => set((state) => ({
    groupMembers: state.groupMembers.filter(m => m.id !== id)
  })),

  togglePaymentStatus: (id) => set((state) => ({
    groupMembers: state.groupMembers.map(m => 
      m.id === id ? { ...m, isPaid: !m.isPaid } : m
    )
  })),

  resetGroup: () => set({
    isSocialMode: false,
    groupId: null,
    groupMembers: [],
    inviteCode: null
  }),
}));
