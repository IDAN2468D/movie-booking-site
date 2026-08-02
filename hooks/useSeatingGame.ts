'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Friend, Seat, MovieOption } from '@/types/seatingGame';
import {
  INITIAL_FRIENDS,
  INITIAL_SEATS,
  FEATURED_MOVIES,
  calculateGroupHarmony,
  findOptimalSeating,
} from '@/lib/seatingHarmony';
import { seatingAudio } from '@/lib/seatingAudio';
import { useBookingStore } from '@/lib/store';

export function useSeatingGame() {
  const [friends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [seats] = useState<Seat[]>(INITIAL_SEATS);
  const [movies] = useState<MovieOption[]>(FEATURED_MOVIES);
  const [selectedMovie, setSelectedMovie] = useState<MovieOption>(FEATURED_MOVIES[0]);
  const [selectedShowtime, setSelectedShowtime] = useState<string>(FEATURED_MOVIES[0].showtimes[0]);

  const [assignedSeats, setAssignedSeats] = useState<Record<string, string>>({});
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [draggedFriendId, setDraggedFriendId] = useState<string | null>(null);

  const { setSelectedMovie: setStoreMovie, setSeats: setStoreSeats, setSelectedShowtime: setStoreShowtime } = useBookingStore();

  // Synchronize state live to global Zustand store for live interactive seat map
  useEffect(() => {
    const seatIds = Object.keys(assignedSeats);
    setStoreSeats(seatIds);
    setStoreShowtime(selectedShowtime);
    setStoreMovie({
      id: 999101,
      title: selectedMovie.title,
      displayTitle: selectedMovie.hebrewTitle,
      poster_path: selectedMovie.poster,
      backdrop_path: selectedMovie.poster,
      overview: `סרט נבחר במשחק סידור מושבים: ${selectedMovie.hebrewTitle}`,
      vote_average: 9.5,
      release_date: '2026',
      genre_ids: [28, 12],
    });
  }, [assignedSeats, selectedMovie, selectedShowtime, setStoreSeats, setStoreShowtime, setStoreMovie]);

  const harmonyInfo = useMemo(() => {
    return calculateGroupHarmony(assignedSeats, seats, friends);
  }, [assignedSeats, seats, friends]);

  const unassignedFriends = useMemo(() => {
    const assignedIds = new Set(Object.values(assignedSeats));
    return friends.filter((f) => !assignedIds.has(f.id));
  }, [friends, assignedSeats]);

  const handleSelectMovie = useCallback((movie: MovieOption) => {
    setSelectedMovie(movie);
    if (movie.showtimes.length > 0) {
      setSelectedShowtime(movie.showtimes[0]);
    }
  }, []);

  const assignFriendToSeat = useCallback(
    (friendId: string, seatId: string) => {
      setAssignedSeats((prev) => {
        const next: Record<string, string> = {};
        Object.entries(prev).forEach(([sId, fId]) => {
          if (fId !== friendId && sId !== seatId) {
            next[sId] = fId;
          }
        });
        next[seatId] = friendId;

        const newHarmony = calculateGroupHarmony(next, seats, friends);
        if (newHarmony.totalScore >= 90) {
          seatingAudio.playPerfectHarmonyFanfare();
        } else {
          seatingAudio.playSeatDropSound();
        }
        return next;
      });
      setSelectedFriendId(null);
      setDraggedFriendId(null);
    },
    [seats, friends]
  );

  const unassignFriend = useCallback((friendId: string) => {
    setAssignedSeats((prev) => {
      const next: Record<string, string> = {};
      Object.entries(prev).forEach(([sId, fId]) => {
        if (fId !== friendId) {
          next[sId] = fId;
        }
      });
      return next;
    });
    seatingAudio.playSeatDropSound();
    setSelectedFriendId(null);
  }, []);

  const handleSeatClick = useCallback(
    (seatId: string) => {
      const currentFriendInSeat = assignedSeats[seatId];
      if (selectedFriendId) {
        assignFriendToSeat(selectedFriendId, seatId);
      } else if (currentFriendInSeat) {
        unassignFriend(currentFriendInSeat);
      }
    },
    [selectedFriendId, assignedSeats, assignFriendToSeat, unassignFriend]
  );

  const handleAutoArrange = useCallback(() => {
    const optimal = findOptimalSeating(seats, friends);
    setAssignedSeats(optimal);
    const newHarmony = calculateGroupHarmony(optimal, seats, friends);
    if (newHarmony.totalScore >= 90) {
      seatingAudio.playPerfectHarmonyFanfare();
    } else {
      seatingAudio.playSeatDropSound();
    }
  }, [seats, friends]);

  const handleReset = useCallback(() => {
    setAssignedSeats({});
    setSelectedFriendId(null);
    setDraggedFriendId(null);
    seatingAudio.playResetSound();
  }, []);

  return {
    friends,
    seats,
    movies,
    selectedMovie,
    selectedShowtime,
    assignedSeats,
    unassignedFriends,
    selectedFriendId,
    draggedFriendId,
    harmonyInfo,
    setSelectedMovie: handleSelectMovie,
    setSelectedShowtime,
    setSelectedFriendId,
    setDraggedFriendId,
    assignFriendToSeat,
    unassignFriend,
    handleSeatClick,
    handleAutoArrange,
    handleReset,
  };
}
