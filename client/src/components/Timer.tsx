import React from 'react';
export type RoundTime = {
  timeToComplete: number;
  startTime: number;
};
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
  return <div id="timer">{Math.round(time / 1000)} seconds to go</div>;
};
export default Timer;
