export type GameScreen = 'title' | 'select' | 'battle' | 'result';

export interface CharacterStats {
  attack: number;
  speed: number;
  defense: number;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  stats: CharacterStats;
  specialName: string;
  color: string; // hsl string
  accentColor: string;
}

export interface Fighter {
  character: Character;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  health: number;
  maxHealth: number;
  specialMeter: number;
  facing: 'left' | 'right';
  state: FighterState;
  stateTimer: number;
  comboCount: number;
  comboTimer: number;
  isGrounded: boolean;
  invincible: boolean;
  invincibleTimer: number;
}

export type FighterState =
  | 'idle'
  | 'walk'
  | 'jump'
  | 'light1'
  | 'light2'
  | 'light3'
  | 'heavy'
  | 'special'
  | 'dodge'
  | 'hit'
  | 'defeated';

export interface HitEffect {
  id: number;
  x: number;
  y: number;
  type: 'light' | 'heavy' | 'special';
  timer: number;
  color: string;
}

export interface GameState {
  screen: GameScreen;
  selectedCharacter: Character | null;
  player: Fighter | null;
  enemy: Fighter | null;
  hitEffects: HitEffect[];
  screenShake: number;
  winner: 'player' | 'enemy' | null;
  paused: boolean;
}

export interface KeyState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  attack: boolean;
  heavy: boolean;
  special: boolean;
  dodge: boolean;
}
