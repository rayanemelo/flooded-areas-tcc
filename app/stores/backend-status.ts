import { create } from 'zustand';

type BackendStatusState = {
  isOutageModalVisible: boolean;
  showOutageModal: () => void;
  hideOutageModal: () => void;
};

export const useBackendStatus = create<BackendStatusState>((set) => ({
  isOutageModalVisible: false,
  showOutageModal: () =>
    set(() => ({
      isOutageModalVisible: true,
    })),
  hideOutageModal: () =>
    set(() => ({
      isOutageModalVisible: false,
    })),
}));
