import { create } from 'zustand';
import { checkLiveTrafficAction } from '@/app/actions/trafficActions';

interface TimeShiftState {
  isPolling: boolean;
  trafficStatus: 'CLEAR' | 'MODERATE' | 'HEAVY' | 'SEVERE' | null;
  delayMinutes: number;
  route: string;
  activeTicketId: string | null;
  ticketTime: string | null;
  isDismissed: boolean;

  // Actions
  setActiveTicket: (ticketId: string, time: string) => void;
  startLiveTrafficPoll: (origin: string, destination: string) => Promise<void>;
  dismissAlert: () => void;
  triggerMockTraffic: () => void; // For dev panel
}

export const useTimeShiftStore = create<TimeShiftState>((set, get) => ({
  isPolling: false,
  trafficStatus: null,
  delayMinutes: 0,
  route: '',
  activeTicketId: null,
  ticketTime: null,
  isDismissed: false,

  setActiveTicket: (ticketId, time) => {
    set({ activeTicketId: ticketId, ticketTime: time, isDismissed: false });
  },

  startLiveTrafficPoll: async (origin, destination) => {
    // Prevent overlapping polls or polling if dismissed
    if (get().isPolling || get().isDismissed) return;
    set({ isPolling: true });

    try {
      const response = await checkLiveTrafficAction(origin, destination);
      
      if (response.success && response.data) {
        set({
          trafficStatus: response.data.status,
          delayMinutes: response.data.estimatedDelayMinutes,
          route: response.data.route,
        });
      } else {
        console.error('Traffic Poll Failed:', response.error);
      }
    } catch (err) {
      console.error('Traffic Poll Exception:', err);
    } finally {
      set({ isPolling: false });
    }
  },

  dismissAlert: () => {
    set({ trafficStatus: null, delayMinutes: 0, isDismissed: true });
  },

  triggerMockTraffic: () => {
    set({
      trafficStatus: 'HEAVY',
      delayMinutes: 45,
      route: 'Ayalon Highway (Route 20) - MOCKED',
      activeTicketId: 'TKT-9981-MOCK',
      ticketTime: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30 mins from now
      isDismissed: false
    });
  }
}));
