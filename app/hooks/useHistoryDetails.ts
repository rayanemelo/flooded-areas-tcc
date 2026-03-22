import { FlooadAreaService } from '@/service/flood-area';
import { UserHistoryService } from '@/service/user-history';
import { FloodArea } from '@/types/flood-area';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

const floodAreaService = new FlooadAreaService();
const userHistoryService = new UserHistoryService();

export function useHistoryDetails() {
  const { id } = useLocalSearchParams() as { id: string };

  const [details, setDetails] = useState<FloodArea | null>(null);
  const [visibleImages, setVisibleImages] = useState(false);

  async function getHistoryById() {
    try {
      const response = await userHistoryService.getHistoryById(id);

      setDetails(response);
    } catch {
      setDetails(null);
    }
  }

  useEffect(() => {
    getHistoryById();
  }, []);

  async function getImages() {
    const res = await floodAreaService.getImagesByFloodAreaId(id);

    if (res && res?.length > 0) {
      setDetails((prev) => {
        if (prev) {
          return {
            ...prev,
            images: res,
          };
        }
        return null;
      });
    }
  }

  useEffect(() => {
    if (visibleImages) {
      getImages();
    }
  }, [visibleImages]);

  return {
    history: details,
    visibleImages,
    setVisibleImages,
  };
}
