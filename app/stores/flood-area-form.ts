import { FloodAreaForm } from '@/types/flood-area';
import { create } from 'zustand';

type StateProps = {
  floodAreaForm: FloodAreaForm;
  setFloodAreaForm: (floodAreaForm: Partial<FloodAreaForm>) => void;
};

export const useFloodAreaForm = create<StateProps>((set) => ({
  floodAreaForm: {} as FloodAreaForm,
  setFloodAreaForm: (area: Partial<FloodAreaForm>) =>
    set((state) => ({ floodAreaForm: { ...state.floodAreaForm, ...area } })),
}));
