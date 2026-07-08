import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TicketPayload {
  ticketId: string;
  encryptedPayload: string;
  validUntil: string; // ISO string
  offlineProof: string;
}

interface OfflineTicketStore {
  tickets: Record<string, TicketPayload>;
  addTicket: (ticket: TicketPayload) => void;
  removeTicket: (ticketId: string) => void;
  getTicket: (ticketId: string) => TicketPayload | undefined;
}

export const useOfflineTicketStore = create<OfflineTicketStore>()(
  persist(
    (set, get) => ({
      tickets: {},
      addTicket: (ticket) => set((state) => ({
        tickets: { ...state.tickets, [ticket.ticketId]: ticket }
      })),
      removeTicket: (ticketId) => set((state) => {
        const { [ticketId]: _, ...rest } = state.tickets;
        return { tickets: rest };
      }),
      getTicket: (ticketId) => get().tickets[ticketId],
    }),
    {
      name: 'liquid-glass-ticket-vault',
    }
  )
);
