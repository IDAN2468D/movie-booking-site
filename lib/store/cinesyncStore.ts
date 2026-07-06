import { create } from 'zustand';
import { CineSyncParticipant } from '@/types/cinesync';
import { createLoungeRoom, joinLoungeRoom, updateLoungeSync, leaveLoungeRoom } from '@/lib/actions/cinesync';
import { Movie } from '@/lib/tmdb';

interface CineSyncState {
  activeRoomId: string | null;
  myUserId: string | null;
  myName: string | null;
  participants: CineSyncParticipant[];
  isReady: boolean;
  isLoungeLoading: boolean;
  loungeError: string | null;
  
  createLounge: (movie: Movie, branchId: string, showtime: string, date: string) => Promise<boolean>;
  joinLounge: (roomId: string) => Promise<boolean>;
  syncLounge: (cursorX: number, cursorY: number, selectedSeat: string | null) => Promise<void>;
  toggleReady: () => void;
  leaveLounge: () => Promise<void>;
}

export const useCineSyncStore = create<CineSyncState>((set, get) => ({
  activeRoomId: null,
  myUserId: null,
  myName: null,
  participants: [],
  isReady: false,
  isLoungeLoading: false,
  loungeError: null,

  createLounge: async (movie, branchId, showtime, date) => {
    set({ isLoungeLoading: true, loungeError: null });
    try {
      const payload = {
        movieId: movie.id.toString(),
        showtime,
        date,
        branchId,
      };
      const result = await createLoungeRoom(payload);
      if (result.success && result.data) {
        set({
          activeRoomId: result.data.roomId,
          myUserId: result.data.userId,
          myName: result.data.name,
          isLoungeLoading: false,
          isReady: false,
        });
        return true;
      } else {
        set({ loungeError: result.error || 'Failed to create lounge', isLoungeLoading: false });
        return false;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      set({ loungeError: 'Network error creating lounge', isLoungeLoading: false });
      return false;
    }
  },

  joinLounge: async (roomId) => {
    set({ isLoungeLoading: true, loungeError: null });
    try {
      // Create local guest fallbacks if not logged in (handled by server, but client can persist)
      const storedGuestId = typeof window !== 'undefined' ? localStorage.getItem('cinesync_guest_id') || undefined : undefined;
      const storedGuestName = typeof window !== 'undefined' ? localStorage.getItem('cinesync_guest_name') || undefined : undefined;

      const result = await joinLoungeRoom(roomId, storedGuestId, storedGuestName);
      if (result.success && result.data) {
        const roomData = result.data;
        if (typeof window !== 'undefined' && roomData.userId.startsWith('guest_')) {
          localStorage.setItem('cinesync_guest_id', roomData.userId);
          localStorage.setItem('cinesync_guest_name', roomData.name);
        }

        set({
          activeRoomId: roomData.roomId,
          myUserId: roomData.userId,
          myName: roomData.name,
          isLoungeLoading: false,
          isReady: false,
        });

        // Set matching movie/branch in standard booking store
        try {
          const { useBookingStore } = await import('@/lib/store');
          const bookingStore = useBookingStore.getState();
          // Find movie from allMovies list
          const matchedMovie = bookingStore.allMovies.find(m => m.id.toString() === roomData.movieId);
          if (matchedMovie) {
            bookingStore.setSelectedMovie(matchedMovie);
          }
          bookingStore.setSelectedShowtime(roomData.showtime);
          bookingStore.setSelectedDate(roomData.date);
          bookingStore.setSelectedBranchId(roomData.branchId);
        } catch (e) {
          console.error("Failed to sync booking store with lounge details", e);
        }

        return true;
      } else {
        set({ loungeError: result.error || 'Failed to join lounge', isLoungeLoading: false });
        return false;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      set({ loungeError: 'Network error joining lounge', isLoungeLoading: false });
      return false;
    }
  },

  syncLounge: async (cursorX, cursorY, selectedSeat) => {
    const { activeRoomId, myUserId, myName, isReady } = get();
    if (!activeRoomId || !myUserId) return;

    try {
      const payload = {
        roomId: activeRoomId,
        cursorX,
        cursorY,
        selectedSeat,
        isReady,
        guestId: myUserId.startsWith('guest_') ? myUserId : undefined,
        guestName: myName || undefined
      };

      const result = await updateLoungeSync(payload);
      if (result.success && result.data) {
        set({ participants: result.data.participants });

        // Update booking store live seat previews of lobby users
        try {
          const { useBookingStore } = await import('@/lib/store');
          const bookingStore = useBookingStore.getState();
          
          // Map participant cursors to lobbyUsers format
          const mappedUsers = result.data.participants
            .filter(p => p.userId !== myUserId)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map((p, idx) => ({
              id: p.userId,
              name: p.name,
              x: p.cursorX,
              y: p.cursorY,
              seat: p.selectedSeat || undefined
            }));

          bookingStore.setLobbyUsers(mappedUsers);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      console.error("CineSync polling failed:", err);
    }
  },

  toggleReady: () => {
    set((state) => ({ isReady: !state.isReady }));
  },

  leaveLounge: async () => {
    const { activeRoomId, myUserId } = get();
    if (activeRoomId && myUserId) {
      try {
        await leaveLoungeRoom(activeRoomId, myUserId);
      } catch (err) {
        console.error("Error leaving room:", err);
      }
    }
    set({
      activeRoomId: null,
      myUserId: null,
      myName: null,
      participants: [],
      isReady: false,
      loungeError: null
    });
  }
}));
