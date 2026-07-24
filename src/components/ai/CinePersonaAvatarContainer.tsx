'use client';

import React from 'react';
import { useCinePersonaState } from '@/hooks/useCinePersonaState';
import { askCinePersonaAction } from '@/lib/actions/cine-persona.actions';
import { CinePersonaAvatarView } from './CinePersonaAvatarView';

export const CinePersonaAvatarContainer: React.FC = () => {
  const {
    personaData,
    isThinking,
    userInput,
    setPersonaData,
    setIsThinking,
    setUserInput,
  } = useCinePersonaState();

  const handleSubmit = async () => {
    if (!userInput.trim()) return;
    setIsThinking(true);
    const res = await askCinePersonaAction({ userPrompt: userInput });
    if (res.success && res.data) {
      setPersonaData(res.data);
    }
    setIsThinking(false);
  };

  return (
    <CinePersonaAvatarView
      personaData={personaData}
      isThinking={isThinking}
      userInput={userInput}
      onInputChange={(val) => setUserInput(val)}
      onSubmitPrompt={handleSubmit}
    />
  );
};
