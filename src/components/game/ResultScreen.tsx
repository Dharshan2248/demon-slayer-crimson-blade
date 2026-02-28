import React from 'react';
import { Character } from '../../game/types';

interface Props {
  winner: 'player' | 'enemy';
  character: Character;
  onPlayAgain: () => void;
  onTitle: () => void;
}

const ResultScreen: React.FC<Props> = ({ winner, character, onPlayAgain, onTitle }) => {
  const isVictory = winner === 'player';

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-[hsl(240,20%,5%)] select-none">
      <div className="text-center mb-10">
        <h2
          className="text-6xl font-black mb-4"
          style={{
            color: isVictory ? 'hsl(45,100%,60%)' : 'hsl(0,70%,50%)',
            textShadow: isVictory
              ? '0 0 40px hsl(45,100%,50%,0.5)'
              : '0 0 40px hsl(0,70%,50%,0.3)',
          }}
        >
          {isVictory ? 'VICTORY!' : 'DEFEAT'}
        </h2>
        <p className="text-xl text-[hsl(0,0%,60%)]">
          {isVictory
            ? `${character.name} has slain the demon!`
            : 'The demon was too powerful...'}
        </p>
      </div>

      {/* Character display */}
      <div
        className="w-32 h-32 rounded-full mb-10 flex items-center justify-center text-6xl"
        style={{
          background: isVictory ? `${character.color}30` : 'hsl(0,0%,15%)',
          border: `3px solid ${isVictory ? character.color : 'hsl(0,0%,30%)'}`,
          boxShadow: isVictory ? `0 0 40px ${character.color}40` : 'none',
        }}
      >
        {isVictory ? '⚔️' : '💀'}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onPlayAgain}
          className="px-10 py-3 text-sm font-bold tracking-wider uppercase border-2 border-[hsl(15,80%,50%)] text-[hsl(30,90%,70%)] bg-[hsl(15,60%,15%,0.6)] hover:bg-[hsl(15,80%,50%,0.3)] transition-all rounded"
        >
          Play Again
        </button>
        <button
          onClick={onTitle}
          className="px-10 py-3 text-sm font-bold tracking-wider uppercase border border-[hsl(0,0%,30%)] text-[hsl(0,0%,50%)] hover:text-[hsl(0,0%,80%)] hover:border-[hsl(0,0%,50%)] transition-all rounded"
        >
          Title Screen
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
