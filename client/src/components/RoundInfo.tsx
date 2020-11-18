import React from 'react';
import Timer from './Timer';
import { GameContext, GameContextProps } from '../providers/GameProvider';

export type RoundTime = {
  timeToComplete: number;
  startTime: number;
};

const RoundInfo: React.FC = () => {
  const { isWaitingForNextRd, roundTime, word } = React.useContext(
    GameContext
  ) as GameContextProps;
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
    renderedContent = <div id="round-waiting">Waiting...</div>;
  }
  return <div id="roundinfo-container">{renderedContent}</div>;
};
export default RoundInfo;
