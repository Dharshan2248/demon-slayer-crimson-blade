import { Character } from './types';

export const TANJIRO: Character = {
  id: 'tanjiro',
  name: 'Tanjiro',
  title: 'Water Breathing',
  stats: { attack: 7, speed: 6, defense: 7 },
  specialName: 'Water Wheel',
  color: 'hsl(200, 80%, 55%)',
  accentColor: 'hsl(200, 90%, 70%)',
};

export const NEZUKO: Character = {
  id: 'nezuko',
  name: 'Nezuko',
  title: 'Blood Demon Art',
  stats: { attack: 8, speed: 8, defense: 5 },
  specialName: 'Exploding Blood',
  color: 'hsl(330, 80%, 60%)',
  accentColor: 'hsl(330, 90%, 75%)',
};

export const DEMON: Character = {
  id: 'demon',
  name: 'Demon',
  title: 'Lower Moon',
  stats: { attack: 6, speed: 5, defense: 8 },
  specialName: 'Dark Slash',
  color: 'hsl(270, 70%, 50%)',
  accentColor: 'hsl(270, 80%, 65%)',
};

export const CHARACTERS = [TANJIRO, NEZUKO];

// Game constants
export const ARENA_WIDTH = 800;
export const ARENA_HEIGHT = 400;
export const GROUND_Y = 320;
export const GRAVITY = 0.6;
export const JUMP_FORCE = -12;
export const MOVE_SPEED = 4;
export const DODGE_SPEED = 8;
export const DODGE_DURATION = 12;
export const ATTACK_RANGE = 70;
export const LIGHT_DAMAGE = 8;
export const HEAVY_DAMAGE = 18;
export const SPECIAL_DAMAGE = 30;
export const SPECIAL_COST = 100;
export const METER_GAIN_HIT = 15;
export const METER_GAIN_TAKE = 10;
export const COMBO_WINDOW = 20;
export const HIT_STUN = 15;
export const FIGHTER_WIDTH = 50;
export const FIGHTER_HEIGHT = 80;
