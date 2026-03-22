import Authentication from '@/components/Authentication';
import Camera from '@/components/Camera';
import ConfirmFloodLocation from '@/components/ConfirmFloodLocation';
import FloodLevel from '@/components/FloodLevel';
import InfoMessage from '@/components/InfoMessage';
import { LocationAccess } from '@/components/LocationAccess';
import CustomMap from '@/components/Map';
import ErrorMessage from '@/components/Messages/error';
import SuccessMessage from '@/components/Messages/success';
import { NotWithinRadius } from '@/components/NotWithinRadius';
import UserAlertFloodedArea from '@/components/UserAlertFloodedArea';
import {
  stepConfirmFloodLocation,
  useMarkerFlood,
} from '@/context/MarkerFloodContext';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function MapScreen() {
  const [alertUser, setAlertUser] = useState(false);

  const {
    send,
    submit,
    update,
    nextStep,
    areaNearby,
    authAction,
    updateCount,
    currentStep,
    setCurrentStep,
    returnToStepOne,
    markerAddressModal,
    isLoadingAlertUser,
    handleConfirmFloodLocation,
  } = useMarkerFlood();

  useEffect(() => {
    if (markerAddressModal) {
      setCurrentStep(stepConfirmFloodLocation);
    }
  }, [markerAddressModal]);

  const getStep = () => {
    const steps: Record<number, React.ReactNode> = {
      1: (
        <InfoMessage text="Ajude a comunidade: marque áreas afetadas por enchentes." />
      ),
      2: (
        <ConfirmFloodLocation
          isVisible={markerAddressModal}
          handleCancel={() => returnToStepOne()}
          handleConfirm={() => handleConfirmFloodLocation()}
        />
      ),
      3: (
        <Camera
          onClose={() => returnToStepOne()}
          sendPhoto={() => nextStep()}
        />
      ),
      4: (
        <FloodLevel
          onClose={() => returnToStepOne()}
          handleContinue={() => submit()}
        />
      ),
      5: (
        <Authentication
          handleCancel={() => returnToStepOne()}
          handleConfirm={() => {
            if (authAction === 'submit') {
              send();
            } else {
              updateCount(alertUser);
            }
          }}
        />
      ),
      6: <SuccessMessage close={() => returnToStepOne()} />,
      7: <ErrorMessage close={() => returnToStepOne()} />,
      8: <NotWithinRadius close={() => returnToStepOne()} />,
      9: <LocationAccess close={() => returnToStepOne()} />,
      10: (
        <UserAlertFloodedArea
          address={areaNearby?.address || ''}
          isLoading={isLoadingAlertUser}
          close={() => returnToStepOne()}
          onPressYes={() => {
            setAlertUser(true);
            update(true);
          }}
          onPressNo={() => {
            setAlertUser(false);
            update(false);
          }}
        />
      ),
    };

    return steps[currentStep];
  };

  return (
    <View style={styles.container}>
      <CustomMap />
      <View style={styles.main}>{getStep()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  main: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
});
