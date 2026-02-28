import React, { useState, useCallback, useRef } from 'react';
import { Character, Fighter, HitEffect, GameState } from '../../game/types';
import { DEMON, ARENA_WIDTH, ARENA_HEIGHT, GROUND_Y, FIGHTER_WIDTH, FIGHTER_HEIGHT, METER_GAIN_HIT, SPECIAL_COST } from '../../game/characters';
import { createFighter, handlePlayerInput, updateFighter, updateAI, checkHit, applyHit } from '../../game/engine';
import { useKeyboard, useGameLoop } from '../../hooks/useGameHooks';

interface Props {
  character: Character;
  onEnd: (winner: 'player' | 'enemy') => void;
}

const BattleArena: React.FC<Props> = ({ character, onEnd }) => {
  const keys = useKeyboard();
  const [player, setPlayer] = useState<Fighter>(() => createFighter(character, 150, 'right'));
  const [enemy, setEnemy] = useState<Fighter>(() => createFighter(DEMON, ARENA_WIDTH - 150, 'left'));
  const [effects, setEffects] = useState<HitEffect[]>([]);
  const [shake, setShake] = useState(0);
  const [flash, setFlash] = useState(false);
  const ended = useRef(false);

  const tick = useCallback(() => {
    if (ended.current) return;

    setPlayer(prev => {
      let p = handlePlayerInput(prev, keys.current);
      p = updateFighter(p);
      return p;
    });

    setEnemy(prev => {
      setPlayer(currentPlayer => {
        let e = updateAI(prev, currentPlayer);
        e = updateFighter(e);

        // Check player hitting enemy
        const pHit = checkHit(currentPlayer, prev);
        if (pHit.hit) {
          const newEnemy = applyHit(prev, pHit.damage);
          const newPlayer = { ...currentPlayer, specialMeter: Math.min(SPECIAL_COST, currentPlayer.specialMeter + METER_GAIN_HIT) };
          setEffects(ef => [...ef, ...pHit.effects]);
          setShake(pHit.effects[0]?.type === 'special' ? 12 : pHit.effects[0]?.type === 'heavy' ? 8 : 4);
          setFlash(true);
          setTimeout(() => setFlash(false), 80);

          if (newEnemy.health <= 0 && !ended.current) {
            ended.current = true;
            setTimeout(() => onEnd('player'), 1000);
          }

          setEnemy(newEnemy);
          return newPlayer;
        }

        // Check enemy hitting player
        const eHit = checkHit(e, currentPlayer);
        if (eHit.hit) {
          const hitPlayer = applyHit(currentPlayer, eHit.damage);
          const newE = { ...e, specialMeter: Math.min(SPECIAL_COST, e.specialMeter + METER_GAIN_HIT) };
          setEffects(ef => [...ef, ...eHit.effects]);
          setShake(eHit.effects[0]?.type === 'heavy' ? 8 : 4);

          if (hitPlayer.health <= 0 && !ended.current) {
            ended.current = true;
            setTimeout(() => onEnd('enemy'), 1000);
          }

          setEnemy(newE);
          return hitPlayer;
        }

        setEnemy(e);
        return currentPlayer;
      });
      return prev;
    });

    // Decay effects
    setEffects(prev => prev.map(e => ({ ...e, timer: e.timer - 1 })).filter(e => e.timer > 0));
    setShake(prev => Math.max(0, prev - 1));
  }, [keys, onEnd]);

  useGameLoop(tick, true);

  const shakeX = shake > 0 ? (Math.random() - 0.5) * shake * 2 : 0;
  const shakeY = shake > 0 ? (Math.random() - 0.5) * shake * 2 : 0;

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-[hsl(240,20%,5%)] select-none">
      {/* HUD */}
      <div className="flex items-center gap-4 mb-4 w-[800px]">
        {/* Player health */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold" style={{ color: character.color }}>{character.name}</span>
            <span className="text-xs text-[hsl(0,0%,50%)]">{player.health}/{player.maxHealth}</span>
          </div>
          <div className="h-4 bg-[hsl(0,0%,15%)] rounded-full overflow-hidden border border-[hsl(0,0%,25%)]">
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${(player.health / player.maxHealth) * 100}%`,
                background: player.health > 60 ? 'hsl(120,70%,45%)' : player.health > 30 ? 'hsl(45,90%,50%)' : 'hsl(0,80%,50%)',
              }}
            />
          </div>
          {/* Special meter */}
          <div className="h-2 mt-1 bg-[hsl(0,0%,10%)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${(player.specialMeter / SPECIAL_COST) * 100}%`,
                background: player.specialMeter >= SPECIAL_COST ? character.color : `${character.color}80`,
              }}
            />
          </div>
        </div>

        <span className="text-2xl font-black text-[hsl(15,80%,50%)]">VS</span>

        {/* Enemy health */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[hsl(0,0%,50%)]">{enemy.health}/{enemy.maxHealth}</span>
            <span className="text-sm font-bold" style={{ color: DEMON.color }}>{DEMON.name}</span>
          </div>
          <div className="h-4 bg-[hsl(0,0%,15%)] rounded-full overflow-hidden border border-[hsl(0,0%,25%)]">
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${(enemy.health / enemy.maxHealth) * 100}%`,
                background: enemy.health > 60 ? 'hsl(120,70%,45%)' : enemy.health > 30 ? 'hsl(45,90%,50%)' : 'hsl(0,80%,50%)',
              }}
            />
          </div>
          <div className="h-2 mt-1 bg-[hsl(0,0%,10%)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${(enemy.specialMeter / SPECIAL_COST) * 100}%`,
                background: enemy.specialMeter >= SPECIAL_COST ? DEMON.color : `${DEMON.color}80`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Arena */}
      <div
        className="relative overflow-hidden rounded-lg border-2 border-[hsl(0,0%,15%)]"
        style={{
          width: ARENA_WIDTH,
          height: ARENA_HEIGHT,
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        {/* Background - night forest */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,30%,8%)] via-[hsl(200,20%,12%)] to-[hsl(120,25%,10%)]" />
        {/* Moon */}
        <div className="absolute top-6 right-16 w-12 h-12 rounded-full bg-[hsl(45,60%,85%)] shadow-[0_0_30px_hsl(45,60%,70%,0.5)]" />
        {/* Trees */}
        {[80, 200, 400, 600, 720].map((tx, i) => (
          <div key={i} className="absolute bottom-0" style={{ left: tx, opacity: 0.3 }}>
            <div className="w-1 bg-[hsl(30,20%,15%)]" style={{ height: 120 + i * 20, marginLeft: 8 }} />
            <div
              className="absolute rounded-full bg-[hsl(140,30%,12%)]"
              style={{ width: 40 + i * 5, height: 60 + i * 8, top: -(40 + i * 10), left: -(12 + i * 2) }}
            />
          </div>
        ))}
        {/* Ground */}
        <div
          className="absolute left-0 right-0 bg-gradient-to-b from-[hsl(30,15%,15%)] to-[hsl(30,10%,10%)]"
          style={{ top: GROUND_Y + FIGHTER_HEIGHT / 2, bottom: 0 }}
        />

        {/* Flash overlay */}
        {flash && <div className="absolute inset-0 bg-[hsl(0,0%,100%,0.15)] z-50 pointer-events-none" />}

        {/* Hit effects */}
        {effects.map((e) => (
          <div
            key={e.id}
            className="absolute pointer-events-none z-40"
            style={{
              left: e.x - 30,
              top: e.y - 30,
              width: e.type === 'special' ? 80 : e.type === 'heavy' ? 60 : 40,
              height: e.type === 'special' ? 80 : e.type === 'heavy' ? 60 : 40,
            }}
          >
            {/* Slash effect */}
            <div
              className="w-full h-full rounded-full animate-ping"
              style={{
                background: `radial-gradient(circle, ${e.color}, transparent)`,
                opacity: 0.8,
              }}
            />
            {e.type === 'special' && (
              <div
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  background: `radial-gradient(circle, ${e.color}60, transparent)`,
                  transform: 'scale(1.5)',
                }}
              />
            )}
          </div>
        ))}

        {/* Player */}
        <FighterSprite fighter={player} />
        {/* Enemy */}
        <FighterSprite fighter={enemy} />
      </div>

      {/* Controls hint */}
      <div className="flex gap-6 mt-4 text-xs text-[hsl(0,0%,40%)]">
        <span>← → Move</span>
        <span>↑ Jump</span>
        <span>Z Attack</span>
        <span>X Heavy</span>
        <span>C Special</span>
        <span>Space Dodge</span>
      </div>
    </div>
  );
};

// Fighter visual component
const FighterSprite: React.FC<{ fighter: Fighter }> = ({ fighter }) => {
  const isAttack = ['light1', 'light2', 'light3', 'heavy', 'special'].includes(fighter.state);
  const isHit = fighter.state === 'hit';
  const isDead = fighter.state === 'defeated';
  const isDodge = fighter.state === 'dodge';

  return (
    <div
      className="absolute transition-none"
      style={{
        left: fighter.x - FIGHTER_WIDTH / 2,
        top: fighter.y - FIGHTER_HEIGHT / 2,
        width: FIGHTER_WIDTH,
        height: FIGHTER_HEIGHT,
        transform: `scaleX(${fighter.facing === 'left' ? -1 : 1}) ${isDead ? 'rotate(90deg)' : ''}`,
        opacity: fighter.invincible ? 0.5 : 1,
      }}
    >
      {/* Body */}
      <div
        className="relative w-full h-full rounded-md transition-colors duration-100"
        style={{
          background: isHit ? 'hsl(0,80%,50%)' : isDodge ? `${fighter.character.color}40`
            : `linear-gradient(180deg, ${fighter.character.color}, ${fighter.character.color}90)`,
          border: `2px solid ${isAttack ? fighter.character.accentColor : fighter.character.color}`,
          boxShadow: isAttack ? `0 0 20px ${fighter.character.color}60` : 'none',
        }}
      >
        {/* Eyes */}
        <div className="absolute flex gap-1.5" style={{ top: 14, left: 10 }}>
          <div className="w-2 h-2 rounded-full bg-[hsl(0,0%,95%)]" />
          <div className="w-2 h-2 rounded-full bg-[hsl(0,0%,95%)]" />
        </div>

        {/* Attack arm extension */}
        {isAttack && (
          <div
            className="absolute"
            style={{
              right: -25,
              top: 25,
              width: 30,
              height: 6,
              background: fighter.character.accentColor,
              borderRadius: 3,
              boxShadow: `0 0 12px ${fighter.character.color}`,
              transform: fighter.state === 'heavy' ? 'rotate(-20deg)' : 'rotate(0deg)',
            }}
          />
        )}

        {/* Special aura */}
        {fighter.state === 'special' && (
          <div
            className="absolute -inset-4 rounded-full animate-pulse"
            style={{
              background: `radial-gradient(circle, ${fighter.character.color}40, transparent)`,
              boxShadow: `0 0 40px ${fighter.character.color}60`,
            }}
          />
        )}
      </div>

      {/* Name tag */}
      <div
        className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold whitespace-nowrap"
        style={{
          color: fighter.character.accentColor,
          transform: `scaleX(${fighter.facing === 'left' ? -1 : 1}) translateX(-50%)`,
        }}
      >
        {fighter.character.name}
      </div>
    </div>
  );
};

export default BattleArena;
