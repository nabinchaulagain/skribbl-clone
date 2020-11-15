import React from 'react';
import { RoundTime } from './RoundInfo';

interface TimerProps {
  roundTime: RoundTime;
}
const Timer: React.FC<TimerProps> = ({ roundTime }) => {
  const [time, setTime] = React.useState(
    roundTime.timeToComplete + roundTime.startTime - Date.now()
  );
  React.useEffect(() => {
    let isSubscribed = true;
    setTimeout(() => {
      if (isSubscribed) {
        setTime(roundTime.timeToComplete + roundTime.startTime - Date.now());
      }
    }, 250);
    return () => {
      isSubscribed = false;
    };
  }, [time]);
  return <div>&#9200; {Math.round(time / 1000)}</div>;
};
export default Timer;
