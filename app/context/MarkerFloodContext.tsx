import { useFloodLocation } from '@/hooks/useFloodLocation';
import { useUserLocation } from '@/hooks/useUserLocation';
import { FlooadAreaService } from '@/service/flood-area';
import { isWithinRadius } from '@/utils/functions/is-within-radius';
import { createContext, useContext, useEffect, useState } from 'react';
import { MapPressEvent, LatLng } from 'react-native-maps';
import { useAuth } from './AuthContext';

import { useFloodedAreas } from '@/hooks/useFloodedAreas';
import { useUserAccess } from '@/stores/user-access';
import { getDistanceInMeters } from '@/utils/functions/get-distance-in-meters';
import { FloodArea } from '@/types/flood-area';
import { useFloodedAreaStorage } from '@/hooks/useFloodedAreaStorage';

export const stepInfoMessage = 1;
export const stepConfirmFloodLocation = 2;
export const stepCamera = 3;
export const stepFloodLevel = 4;
export const stepAuthentication = 5;
export const stepSuccess = 6;
export const stepError = 7;
export const stepNotWithinRadius = 8;
export const stepLocationAccess = 9;
export const stepUserAlertFloodedArea = 10;

type MarkerFloodProps = {
  isLoading: boolean;
  currentStep: number;
  isLoadingAlertUser: {
    yes: boolean;
    no: boolean;
  };
  markerAddressModal: boolean;
  areaNearby: FloodArea | null;
  authentication: {
    authenticated: boolean;
    token: string | null;
  };
  authAction: 'submit' | 'update' | null;
  floodLocationCoordinates: LatLng | null;
  nextStep: () => void;
  send: () => Promise<void>;
  submit: () => Promise<void>;
  returnToStepOne: () => void;
  resetFloodedAreaMarking: () => void;
  setCurrentStep: (step: number) => void;
  handleConfirmFloodLocation: () => void;
  update: (isFlooded: boolean) => Promise<void>;
  handleMapPress: (event: MapPressEvent) => void;
  updateCount: (isFlooded: boolean) => Promise<void>;
  setFloodLocationCoordinates: (coordinates: LatLng | null) => void;
};

type MarkerFloodProviderProps = { children: JSX.Element | JSX.Element[] };

const MarkerFloodContext = createContext<MarkerFloodProps>(
  {} as MarkerFloodProps
);

const floodAreaService = new FlooadAreaService();

export const MarkerFloodProvider = ({ children }: MarkerFloodProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAlertUser, setIsLoadingAlertUser] = useState({
    yes: false,
    no: false,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [areaNearby, setAreaNearby] = useState<FloodArea | null>(null);
  const [authAction, setAuthAction] = useState<'submit' | 'update' | null>(
    null
  );

  const { authentication } = useAuth();
  const { userLocation } = useUserLocation();
  const { publicFloodedAreas } = useFloodedAreas();
  const { user } = useUserAccess();

  const { hasUserResponded, storeUserResponse } = useFloodedAreaStorage();

  const {
    floodAreaForm,
    markerAddressModal,
    floodLocationCoordinates,
    handleMapPress,
    setFloodLocationCoordinates,
    resetFloodedAreaMarking,
  } = useFloodLocation();

  useEffect(() => {
    if (!userLocation || publicFloodedAreas.length === 0) return;

    const checkNearbyArea = async () => {
      for (const area of publicFloodedAreas) {
        const isFromSameUser = area.userId === user.id;
        const distance = getDistanceInMeters(
          userLocation.latitude,
          userLocation.longitude,
          area.latitude,
          area.longitude
        );

        if (!isFromSameUser && distance <= 30) {
          const alreadyResponded = await hasUserResponded(user.id, area.id);
          if (!alreadyResponded) {
            setCurrentStep(stepUserAlertFloodedArea);
            setAreaNearby(area);
          }
          break;
        }
      }
    };

    checkNearbyArea();
  }, [userLocation, publicFloodedAreas, user.id]);

  function handleValidateLocation() {
    if (!userLocation) {
      setCurrentStep(stepLocationAccess);
      return false;
    }

    const coordinates = {
      latArea: Number(floodAreaForm.latitude),
      lonArea: Number(floodAreaForm.longitude),
      latUser: Number(userLocation.latitude),
      lonUser: Number(userLocation.longitude),
    };

    if (!isWithinRadius(coordinates)) {
      setCurrentStep(stepNotWithinRadius);
      return false;
    }
    return true;
  }

  function handleConfirmFloodLocation() {
    const isValidLocation = handleValidateLocation();

    if (!isValidLocation) {
      return;
    }

    nextStep();
  }

  function returnToStepOne() {
    resetFloodedAreaMarking();
    setCurrentStep(1);
  }

  function nextStep() {
    setCurrentStep(currentStep + 1);
  }

  async function send() {
    setIsLoading(true);

    if (!userLocation) {
      setIsLoading(false);
      return;
    }

    const payload = {
      ...floodAreaForm,
      latitude: floodAreaForm.latitude.toString(),
      longitude: floodAreaForm.longitude.toString(),
      status: 'pending',
      userLocation: {
        latitude: userLocation.latitude.toString(),
        longitude: userLocation.longitude.toString(),
      },
    };

    const res = await floodAreaService.sendFloodArea(payload);

    setIsLoading(false);

    if (res?.status === 201) {
      setCurrentStep(stepSuccess);
    } else {
      setCurrentStep(stepError);
    }
    return;
  }

  async function submit() {
    if (!authentication.authenticated) {
      setAuthAction('submit');
      setCurrentStep(stepAuthentication);

      return;
    }

    await send();
    setAuthAction(null);
  }

  async function update(isFlooded: boolean) {
    console.log('authentication.authenticated: ', authentication.authenticated);
    if (!authentication.authenticated) {
      setAuthAction('update');
      setCurrentStep(stepAuthentication);

      return;
    }

    await updateCount(isFlooded);
    setAuthAction(null);
  }

  async function updateCount(isFlooded: boolean) {
    if (isFlooded) {
      setIsLoadingAlertUser({ yes: true, no: false });
    } else {
      setIsLoadingAlertUser({ yes: false, no: true });
    }

    if (!areaNearby) return;

    let payload = {
      id: areaNearby.id,
      yesCount: areaNearby.yesCount,
      noCount: areaNearby.noCount,
    };

    if (isFlooded) {
      payload.yesCount += 1;
    } else {
      payload.noCount += 1;
    }

    console.log(payload);

    const res = await floodAreaService.updateFloodAreaAlert(payload);
    await storeUserResponse(user.id, areaNearby.id);

    if (res.status !== 200) setCurrentStep(stepSuccess);
    else setCurrentStep(stepError);
    setIsLoadingAlertUser({ yes: false, no: false });
  }

  return (
    <MarkerFloodContext.Provider
      value={{
        send,
        submit,
        update,
        updateCount,
        nextStep,
        isLoading,
        authAction,
        areaNearby,
        currentStep,
        authentication,
        handleMapPress,
        setCurrentStep,
        returnToStepOne,
        isLoadingAlertUser,
        markerAddressModal,
        resetFloodedAreaMarking,
        floodLocationCoordinates,
        handleConfirmFloodLocation,
        setFloodLocationCoordinates,
      }}
    >
      {children}
    </MarkerFloodContext.Provider>
  );
};

export const useMarkerFlood = () => {
  return useContext(MarkerFloodContext);
};
