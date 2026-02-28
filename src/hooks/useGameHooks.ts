import { useEffect, useRef, useCallback } from 'react';
import { KeyState } from '../game/types';

export function useKeyboard() {
  const keys = useRef<KeyState>({
    left: false, right: false, up: false, down: false,
    attack: false, heavy: false, special: false, dodge: false,
  });
  const pressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (pressed.current.has(e.code)) return;
      pressed.current.add(e.code);
      switch (e.code) {
        case 'ArrowLeft': keys.current.left = true; break;
        case 'ArrowRight': keys.current.right = true; break;
        case 'ArrowUp': keys.current.up = true; break;
        case 'ArrowDown': keys.current.down = true; break;
        case 'KeyZ': keys.current.attack = true; break;
        case 'KeyX': keys.current.heavy = true; break;
        case 'KeyC': keys.current.special = true; break;
        case 'Space': keys.current.dodge = true; e.preventDefault(); break;
      }
    };
    const onUp = (e: KeyboardEvent) => {
      pressed.current.delete(e.code);
      switch (e.code) {
        case 'ArrowLeft': keys.current.left = false; break;
        case 'ArrowRight': keys.current.right = false; break;
        case 'ArrowUp': keys.current.up = false; break;
        case 'ArrowDown': keys.current.down = false; break;
        case 'KeyZ': keys.current.attack = false; break;
        case 'KeyX': keys.current.heavy = false; break;
        case 'KeyC': keys.current.special = false; break;
        case 'Space': keys.current.dodge = false; break;
      }
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp); };
  }, []);

  return keys;
}

export function useGameLoop(callback: (dt: number) => void, running: boolean) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    if (!running) return;
    let raf: number;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(now - last, 33);
      last = now;
      cbRef.current(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running]);
}
