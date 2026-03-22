import { useEffect, useState } from 'react';

const VALUE = 60;

export function useCountdown() {
  const [countdown, setCountdown] = useState(VALUE);
  const [isCounting, setIsCounting] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isCounting && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsCounting(false);
      setCountdown(VALUE); // Reseta o countdown
    }

    return () => clearInterval(timer); // Limpa o intervalo ao desmontar
  }, [isCounting, countdown]);

  return {
    isCounting,
    setIsCounting,
    countdown,
  };
}
