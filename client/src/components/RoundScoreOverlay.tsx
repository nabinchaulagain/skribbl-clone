import React from 'react';
import { RoundScore } from './Game';
interface RoundScoreOverlayProps {
  isWaitingForNextRd: boolean;
  roundScores: RoundScore[];
  word: string | null;
}
const RoundScoreOverlay: React.FC<RoundScoreOverlayProps> = (props) => {
  if (!props.isWaitingForNextRd) {
    return <></>;
  }
  return (
    <div id="overlay">
      <h4>Scores</h4>
      {props.roundScores.map((roundScore) => (
        <div
          className="round-score"
          key={roundScore.userId}
          style={{ color: roundScore.score === 0 ? 'red' : 'green' }}
        >
          <b>{roundScore.username}:</b> {roundScore.score}
        </div>
      ))}
    </div>
  );
};
export default RoundScoreOverlay;
