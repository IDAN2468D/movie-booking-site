import { create } from 'zustand';
import { PersonaResponse } from '../lib/validations/cine-persona.schema';

interface CinePersonaState {
  personaData: PersonaResponse | null;
  isThinking: boolean;
  userInput: string;
  setPersonaData: (data: PersonaResponse | null) => void;
  setIsThinking: (thinking: boolean) => void;
  setUserInput: (input: string) => void;
}

export const useCinePersonaState = create<CinePersonaState>((set) => ({
  personaData: null,
  isThinking: false,
  userInput: '',
  setPersonaData: (personaData) => set({ personaData }),
  setIsThinking: (isThinking) => set({ isThinking }),
  setUserInput: (userInput) => set({ userInput }),
}));
