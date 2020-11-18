import React from 'react';
import Timer from './Timer';

export type RoundTime = {
  timeToComplete: number;
  startTime: number;
};

interface RoundInfoProps {
  roundTime: RoundTime | null;
  word: string | null;
  isWaitingForNextRd: boolean;
}

const RoundInfo: React.FC<RoundInfoProps> = ({
  roundTime,
  word,
  isWaitingForNextRd,
}) => {
  let renderedContent: JSX.Element;
  if (isWaitingForNextRd) {
    return (
      <div id="roundinfo-container">
        <div id="round-waiting">Waiting...</div>
      </div>
    );
  }
  if (roundTime && word) {
    renderedContent = (
      <>
        <Timer roundTime={roundTime}></Timer>
        <div id="round-word">{word}</div>
      </>
    );
  } else {
    renderedContent = <div id="round-waiting">Waiting for others to join</div>;
  }
  return <div id="roundinfo-container">{renderedContent}</div>;
};
export default RoundInfo;
