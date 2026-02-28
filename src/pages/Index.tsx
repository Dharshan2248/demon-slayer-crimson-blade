import React, { useState } from 'react';
import { Character, GameScreen } from '../game/types';
import TitleScreen from '../components/game/TitleScreen';
import CharacterSelect from '../components/game/CharacterSelect';
import BattleArena from '../components/game/BattleArena';
import ResultScreen from '../components/game/ResultScreen';

const Index = () => {
  const [screen, setScreen] = useState<GameScreen>('title');
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [winner, setWinner] = useState<'player' | 'enemy' | null>(null);

  const handleCharSelect = (char: Character) => {
    setSelectedChar(char);
    setScreen('battle');
  };

  const handleBattleEnd = (w: 'player' | 'enemy') => {
    setWinner(w);
    setScreen('result');
  };

  return (
    <>
      {screen === 'title' && <TitleScreen onStart={() => setScreen('select')} />}
      {screen === 'select' && (
        <CharacterSelect onSelect={handleCharSelect} onBack={() => setScreen('title')} />
      )}
      {screen === 'battle' && selectedChar && (
        <BattleArena key={Date.now()} character={selectedChar} onEnd={handleBattleEnd} />
      )}
      {screen === 'result' && selectedChar && winner && (
        <ResultScreen
          winner={winner}
          character={selectedChar}
          onPlayAgain={() => setScreen('battle')}
          onTitle={() => { setScreen('title'); setSelectedChar(null); setWinner(null); }}
        />
      )}
    </>
  );
};

export default Index;
