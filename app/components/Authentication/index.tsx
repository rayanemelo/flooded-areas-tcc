import CustomAlert from '../shared/CustomAlert';
import PhoneNumber from './PhoneNumber';
import VerificationCode from './VerificationCode';
import { useAuthComponent } from '@/hooks/useAuthComponent';
import { useUserLocation } from '@/hooks/useUserLocation';

type Props = {
  handleCancel: () => void;
  handleConfirm: () => void;
};

const Authentication = ({ handleCancel, handleConfirm }: Props) => {
  const { userLocation } = useUserLocation();
  const { form, setForm, prevStep, currentStep, sendCode, confirmCode } =
    useAuthComponent();

  const getStep = () => {
    const steps: Record<number, JSX.Element> = {
      1: (
        <PhoneNumber
          form={form}
          setForm={setForm}
          handleContinue={() => {
            if (form.phone.length >= 11) {
              sendCode(userLocation);
            }
          }}
          handleCancel={handleCancel}
        />
      ),
      2: (
        <VerificationCode
          form={form}
          setForm={setForm}
          handleCancel={() => prevStep()}
          handleConfirm={async () => {
            await confirmCode();

            handleConfirm();
          }}
          handleResend={async () => {
            sendCode(userLocation);
          }}
        />
      ),
    };

    return steps[currentStep];
  };

  return <CustomAlert>{getStep()}</CustomAlert>;
};

export default Authentication;
