import React, { useState } from 'react';
import { Character } from '../../game/types';
import { CHARACTERS } from '../../game/characters';

interface Props {
  onSelect: (char: Character) => void;
  onBack: () => void;
}

const CharacterSelect: React.FC<Props> = ({ onSelect, onBack }) => {
  const [selected, setSelected] = useState<string>(CHARACTERS[0].id);
  const char = CHARACTERS.find(c => c.id === selected)!;

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-[hsl(240,20%,5%)] select-none">
      <h2 className="text-4xl font-black tracking-wider text-[hsl(30,90%,65%)] mb-10">
        SELECT YOUR FIGHTER
      </h2>

      <div className="flex gap-8 mb-10">
        {CHARACTERS.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelected(c.id)}
            className={`relative flex flex-col items-center p-6 w-56 rounded-lg border-2 transition-all duration-300 ${
              selected === c.id
                ? 'border-current shadow-[0_0_25px_currentColor] scale-105'
                : 'border-[hsl(0,0%,20%)] hover:border-[hsl(0,0%,40%)]'
            }`}
            style={{ color: c.color, background: selected === c.id ? `${c.color}15` : 'hsl(240,15%,10%)' }}
          >
            {/* Character avatar placeholder */}
            <div
              className="w-24 h-24 rounded-full mb-4 flex items-center justify-center text-4xl font-black"
              style={{ background: `${c.color}30`, border: `2px solid ${c.color}` }}
            >
              {c.id === 'tanjiro' ? '🗡️' : '🔥'}
            </div>
            <h3 className="text-xl font-bold text-[hsl(0,0%,90%)]">{c.name}</h3>
            <p className="text-sm font-medium" style={{ color: c.color }}>{c.title}</p>

            {/* Stats */}
            <div className="w-full mt-4 space-y-2">
              {(['attack', 'speed', 'defense'] as const).map((stat) => (
                <div key={stat} className="flex items-center gap-2 text-xs">
                  <span className="w-14 text-[hsl(0,0%,60%)] uppercase">{stat}</span>
                  <div className="flex-1 h-2 bg-[hsl(0,0%,15%)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${c.stats[stat] * 10}%`,
                        background: c.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-3 text-xs text-[hsl(0,0%,50%)]">Special: {c.specialName}</p>
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="px-8 py-3 text-sm font-bold tracking-wider uppercase border border-[hsl(0,0%,30%)] text-[hsl(0,0%,50%)] hover:text-[hsl(0,0%,80%)] hover:border-[hsl(0,0%,50%)] transition-all rounded"
        >
          Back
        </button>
        <button
          onClick={() => onSelect(char)}
          className="px-8 py-3 text-sm font-bold tracking-wider uppercase rounded transition-all"
          style={{
            border: `2px solid ${char.color}`,
            color: char.accentColor,
            background: `${char.color}20`,
          }}
        >
          Fight! ⚔️
        </button>
      </div>
    </div>
  );
};

export default CharacterSelect;
