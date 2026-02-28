

# Demon Slayer: 2D Fighting Game — Basic Model

## Overview
A 2D side-scrolling fighting game with two playable characters (Tanjiro & Nezuko) battling against a demon enemy. Keyboard-controlled with anime-styled visuals, combo attacks, and special moves.

## Pages & Structure

### 1. Title Screen
- Animated title "Demon Slayer: Battle of the Flames" with glowing fire effects
- "Start Game" and "Select Character" buttons
- Dark atmospheric background with particle effects

### 2. Character Select Screen
- Choose between Tanjiro (Water Breathing) and Nezuko (Demon Blood Art)
- Each character card shows stats (Attack, Speed, Defense) and a preview of their special move
- Animated selection with glow effects

### 3. Battle Arena
- Side-scrolling 2D fight arena with a themed background (forest at night)
- **Player character** on the left, **Demon enemy (AI)** on the right
- Health bars, special meter, and combo counter displayed as HUD
- Controls: Arrow keys to move/jump, Z = light attack, X = heavy attack, C = special move, Space = dodge
- On-screen control hints shown at bottom

### 4. Combat System
- **Basic combo chain**: 3-hit light attack combo
- **Heavy attack**: Slower but more damage, breaks guard
- **Special move** (uses meter): Tanjiro = Water Wheel slash effect, Nezuko = Blood Demon Art explosion
- **Dodge mechanic**: Brief invincibility with dash animation
- **AI enemy**: Simple attack patterns — approach, attack, retreat cycle
- Hit effects with screen shake and flash

### 5. Visual Effects
- CSS-animated sword slash trails (glowing blue for Tanjiro, pink for Nezuko)
- Health bar animations with color transitions (green → yellow → red)
- Screen shake on heavy hits
- Victory/defeat screen with character pose and results

### 6. Game Flow
- Title → Character Select → Battle → Win/Lose Screen → Play Again

