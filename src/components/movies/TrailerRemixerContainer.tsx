'use client';

import React, { useEffect } from 'react';
import { useTrailerRemixerState } from '@/hooks/useTrailerRemixerState';
import { remixTrailerAction } from '@/lib/actions/trailer-remixer.actions';
import { EraType } from '@/lib/validations/trailer-remixer.schema';
import { TrailerRemixerCanvasView } from './TrailerRemixerCanvasView';

interface TrailerRemixerContainerProps {
  movieId: string;
}

export const TrailerRemixerContainer: React.FC<TrailerRemixerContainerProps> = ({
  movieId,
}) => {
  const {
    activeEra,
    remixData,
    isLoading,
    setActiveEra,
    setRemixData,
    setIsLoading,
  } = useTrailerRemixerState();

  const handleSelectEra = async (era: EraType) => {
    setActiveEra(era);
    setIsLoading(true);
    const res = await remixTrailerAction({ movieId, era });
    if (res.success && res.data) {
      setRemixData(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    handleSelectEra('80s_synthwave');
  }, [movieId]);

  return (
    <TrailerRemixerCanvasView
      activeEra={activeEra}
      remixData={remixData}
      isLoading={isLoading}
      onSelectEra={handleSelectEra}
    />
  );
};
