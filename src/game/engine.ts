import {
  Fighter, KeyState, HitEffect, FighterState, Character,
} from './types';
import {
  GRAVITY, GROUND_Y, JUMP_FORCE, MOVE_SPEED, DODGE_SPEED, DODGE_DURATION,
  ATTACK_RANGE, LIGHT_DAMAGE, HEAVY_DAMAGE, SPECIAL_DAMAGE, SPECIAL_COST,
  METER_GAIN_HIT, METER_GAIN_TAKE, COMBO_WINDOW, HIT_STUN,
  ARENA_WIDTH, FIGHTER_WIDTH,
} from './characters';

let effectId = 0;

export function createFighter(character: Character, x: number, facing: 'left' | 'right'): Fighter {
  return {
    character, x, y: GROUND_Y, velocityX: 0, velocityY: 0,
    health: 100, maxHealth: 100, specialMeter: 0,
    facing, state: 'idle', stateTimer: 0,
    comboCount: 0, comboTimer: 0,
    isGrounded: true, invincible: false, invincibleTimer: 0,
  };
}

function isAttacking(state: FighterState) {
  return ['light1', 'light2', 'light3', 'heavy', 'special'].includes(state);
}

function attackFrame(state: FighterState): number {
  switch (state) {
    case 'light1': case 'light2': case 'light3': return 5;
    case 'heavy': return 8;
    case 'special': return 12;
    default: return 0;
  }
}

function attackDuration(state: FighterState): number {
  switch (state) {
    case 'light1': case 'light2': case 'light3': return 12;
    case 'heavy': return 20;
    case 'special': return 30;
    default: return 0;
  }
}

function getDamage(state: FighterState): number {
  switch (state) {
    case 'light1': case 'light2': case 'light3': return LIGHT_DAMAGE;
    case 'heavy': return HEAVY_DAMAGE;
    case 'special': return SPECIAL_DAMAGE;
    default: return 0;
  }
}

export function handlePlayerInput(player: Fighter, keys: KeyState): Fighter {
  let p = { ...player };

  if (p.state === 'hit' || p.state === 'defeated') return p;

  // Movement
  if (p.state === 'idle' || p.state === 'walk' || p.state === 'jump') {
    if (keys.left) { p.velocityX = -MOVE_SPEED; p.facing = 'left'; if (p.isGrounded) p.state = 'walk'; }
    else if (keys.right) { p.velocityX = MOVE_SPEED; p.facing = 'right'; if (p.isGrounded) p.state = 'walk'; }
    else { p.velocityX = 0; if (p.isGrounded && p.state === 'walk') p.state = 'idle'; }

    if (keys.up && p.isGrounded) {
      p.velocityY = JUMP_FORCE;
      p.isGrounded = false;
      p.state = 'jump';
    }

    // Attacks
    if (keys.attack && p.isGrounded) {
      if (p.comboTimer > 0 && p.comboCount === 1) p.state = 'light2';
      else if (p.comboTimer > 0 && p.comboCount === 2) p.state = 'light3';
      else { p.state = 'light1'; p.comboCount = 0; }
      p.stateTimer = 0;
      p.velocityX = 0;
    }
    if (keys.heavy && p.isGrounded) {
      p.state = 'heavy';
      p.stateTimer = 0;
      p.velocityX = 0;
    }
    if (keys.special && p.specialMeter >= SPECIAL_COST && p.isGrounded) {
      p.state = 'special';
      p.stateTimer = 0;
      p.specialMeter -= SPECIAL_COST;
      p.velocityX = 0;
    }
    if (keys.dodge && p.isGrounded) {
      p.state = 'dodge' as const;
      p.stateTimer = 0;
      p.invincible = true;
      p.invincibleTimer = DODGE_DURATION;
      p.velocityX = p.facing === 'right' ? DODGE_SPEED : -DODGE_SPEED;
    }
  }

  return p;
}

export function updateFighter(f: Fighter): Fighter {
  let fighter = { ...f };

  // Physics
  fighter.velocityY += GRAVITY;
  fighter.x += fighter.velocityX;
  fighter.y += fighter.velocityY;

  // Ground
  if (fighter.y >= GROUND_Y) {
    fighter.y = GROUND_Y;
    fighter.velocityY = 0;
    fighter.isGrounded = true;
  } else {
    fighter.isGrounded = false;
  }

  // Arena bounds
  fighter.x = Math.max(FIGHTER_WIDTH / 2, Math.min(ARENA_WIDTH - FIGHTER_WIDTH / 2, fighter.x));

  // State timers
  if (isAttacking(fighter.state) || fighter.state === 'dodge' || fighter.state === 'hit') {
    fighter.stateTimer++;
    const dur = fighter.state === 'dodge' ? DODGE_DURATION
      : fighter.state === 'hit' ? HIT_STUN
      : attackDuration(fighter.state);

    if (fighter.stateTimer >= dur) {
      if (fighter.state === 'light1') { fighter.comboCount = 1; fighter.comboTimer = COMBO_WINDOW; }
      else if (fighter.state === 'light2') { fighter.comboCount = 2; fighter.comboTimer = COMBO_WINDOW; }
      else if (fighter.state === 'light3') { fighter.comboCount = 0; fighter.comboTimer = 0; }

      fighter.state = fighter.isGrounded ? 'idle' : 'jump';
      fighter.stateTimer = 0;
      fighter.velocityX = 0;
    }
  }

  // Combo window
  if (fighter.comboTimer > 0) {
    fighter.comboTimer--;
    if (fighter.comboTimer <= 0) { fighter.comboCount = 0; }
  }

  // Invincibility
  if (fighter.invincibleTimer > 0) {
    fighter.invincibleTimer--;
    if (fighter.invincibleTimer <= 0) fighter.invincible = false;
  }

  return fighter;
}

export function checkHit(attacker: Fighter, defender: Fighter): { hit: boolean; damage: number; effects: HitEffect[] } {
  if (!isAttacking(attacker.state)) return { hit: false, damage: 0, effects: [] };
  if (attacker.stateTimer !== attackFrame(attacker.state)) return { hit: false, damage: 0, effects: [] };
  if (defender.invincible || defender.state === 'defeated') return { hit: false, damage: 0, effects: [] };

  const dist = Math.abs(attacker.x - defender.x);
  const range = attacker.state === 'special' ? ATTACK_RANGE * 1.5 : ATTACK_RANGE;

  if (dist <= range) {
    const damage = getDamage(attacker.state);
    const effectType = attacker.state === 'special' ? 'special'
      : attacker.state === 'heavy' ? 'heavy' : 'light';
    const fx: HitEffect = {
      id: effectId++,
      x: (attacker.x + defender.x) / 2,
      y: defender.y - 40,
      type: effectType,
      timer: effectType === 'special' ? 25 : effectType === 'heavy' ? 18 : 12,
      color: attacker.character.color,
    };
    return { hit: true, damage, effects: [fx] };
  }

  return { hit: false, damage: 0, effects: [] };
}

export function applyHit(defender: Fighter, damage: number): Fighter {
  let d = { ...defender };
  d.health = Math.max(0, d.health - damage);
  d.specialMeter = Math.min(SPECIAL_COST, d.specialMeter + METER_GAIN_TAKE);
  if (d.health <= 0) {
    d.state = 'defeated';
    d.stateTimer = 0;
  } else {
    d.state = 'hit';
    d.stateTimer = 0;
  }
  return d;
}

// Simple AI
export function updateAI(enemy: Fighter, player: Fighter): Fighter {
  let e = { ...enemy };
  if (e.state === 'hit' || e.state === 'defeated') return e;
  if (isAttacking(e.state)) return e;
  if (e.state === 'dodge') return e;

  const dist = Math.abs(e.x - player.x);
  e.facing = player.x < e.x ? 'left' : 'right';

  // Random behavior
  const r = Math.random();

  if (dist > ATTACK_RANGE + 30) {
    // Approach
    e.velocityX = e.facing === 'left' ? -MOVE_SPEED * 0.7 : MOVE_SPEED * 0.7;
    e.state = 'walk';
  } else if (dist <= ATTACK_RANGE) {
    // Attack or dodge
    if (r < 0.04) {
      e.state = 'light1'; e.stateTimer = 0; e.velocityX = 0;
    } else if (r < 0.06) {
      e.state = 'heavy'; e.stateTimer = 0; e.velocityX = 0;
    } else if (r < 0.065 && e.specialMeter >= SPECIAL_COST) {
      e.state = 'special'; e.stateTimer = 0; e.specialMeter -= SPECIAL_COST; e.velocityX = 0;
    } else if (r < 0.08) {
      // Retreat
      e.velocityX = e.facing === 'left' ? MOVE_SPEED * 0.5 : -MOVE_SPEED * 0.5;
      e.state = 'walk';
    } else {
      e.velocityX = 0;
      e.state = 'idle';
    }
  } else {
    e.velocityX = 0;
    e.state = 'idle';
  }

  return e;
}
