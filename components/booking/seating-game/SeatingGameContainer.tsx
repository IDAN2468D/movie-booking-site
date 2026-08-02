'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSeatingGame } from '@/hooks/useSeatingGame';
import { MovieSelectorBar } from './MovieSelectorBar';
import { HarmonyMeter } from './HarmonyMeter';
import { CinemaGrid } from './CinemaGrid';
import { FriendsDock } from './FriendsDock';
import { SatisfactionBreakdown } from './SatisfactionBreakdown';
import { CheckoutActionBar } from './CheckoutActionBar';
import { Gamepad2, ArrowRight } from 'lucide-react';

export const SeatingGameContainer: React.FC = () => {
  const router = useRouter();
  const {
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
    setSelectedMovie,
    setSelectedShowtime,
    setSelectedFriendId,
    setDraggedFriendId,
    assignFriendToSeat,
    unassignFriend,
    handleSeatClick,
    handleAutoArrange,
    handleReset,
  } = useSeatingGame();

  const handleDragStart = (e: React.DragEvent, friendId: string) => {
    e.dataTransfer.setData('text/plain', friendId);
    setDraggedFriendId(friendId);
  };

  const handleDragEnd = () => {
    setDraggedFriendId(null);
  };

  const assignedCount = Object.keys(assignedSeats).length;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6" dir="rtl">
      {/* Sleek Hero Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              Seating Matcher Game • Interactive Experience
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              סידור מושבי חברים ומעבר לתשלום
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              בחרו סרט ושעת הקרנה, סדרו את החברים במושבי האולם כדי למקסם את מד ההרמוניה הקבוצתי, ועברו בביטחון לעמוד התשלום.
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="self-start md:self-center flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-bold text-sm border border-slate-700/80 shadow-xl transition-all hover:scale-105 active:scale-95 flex-shrink-0"
          >
            <ArrowRight className="w-5 h-5 text-cyan-400" />
            <span>חזרה</span>
          </button>
        </div>
      </div>

      {/* Movie & Showtime Selection Bar */}
      <MovieSelectorBar
        movies={movies}
        selectedMovie={selectedMovie}
        selectedShowtime={selectedShowtime}
        onSelectMovie={setSelectedMovie}
        onSelectShowtime={setSelectedShowtime}
      />

      {/* Real-time Harmony Score Dashboard */}
      <HarmonyMeter
        score={harmonyInfo.totalScore}
        statusText={harmonyInfo.textStatus}
        satisfactions={harmonyInfo.satisfactions}
        friends={friends}
        assignedCount={assignedCount}
      />

      {/* Main Grid & Dock Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 xl:col-span-8">
          <CinemaGrid
            seats={seats}
            assignedSeats={assignedSeats}
            friends={friends}
            satisfactions={harmonyInfo.satisfactions}
            selectedFriendId={selectedFriendId}
            draggedFriendId={draggedFriendId}
            onSeatClick={handleSeatClick}
            onDropFriend={assignFriendToSeat}
          />
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <FriendsDock
            unassignedFriends={unassignedFriends}
            allFriends={friends}
            selectedFriendId={selectedFriendId}
            draggedFriendId={draggedFriendId}
            satisfactions={harmonyInfo.satisfactions}
            onSelectFriend={(fId) =>
              setSelectedFriendId(selectedFriendId === fId ? null : fId)
            }
            onDragStartFriend={handleDragStart}
            onDragEndFriend={handleDragEnd}
            onDropToDock={unassignFriend}
            onAutoArrange={handleAutoArrange}
            onReset={handleReset}
          />
        </div>
      </div>

      {/* Satisfaction Breakdown Grid */}
      <SatisfactionBreakdown
        friends={friends}
        assignedSeats={assignedSeats}
        satisfactions={harmonyInfo.satisfactions}
      />

      {/* Sticky Proceed to Checkout Action Bar */}
      <CheckoutActionBar
        selectedMovie={selectedMovie}
        selectedShowtime={selectedShowtime}
        assignedSeats={assignedSeats}
        totalScore={harmonyInfo.totalScore}
      />
    </div>
  );
};
