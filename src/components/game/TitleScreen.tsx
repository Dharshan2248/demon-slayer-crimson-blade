import React from 'react';

interface TitleScreenProps {
  onStart: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-screen bg-[hsl(240,20%,5%)] overflow-hidden select-none">
      {/* Particle effects */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float-particle"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `hsl(${15 + Math.random() * 20}, 90%, ${50 + Math.random() * 30}%)`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Title */}
      <div className="relative z-10 mb-12 text-center">
        <h1 className="text-6xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[hsl(30,100%,60%)] via-[hsl(15,100%,55%)] to-[hsl(0,90%,45%)] drop-shadow-lg title-glow">
          DEMON SLAYER
        </h1>
        <p className="mt-2 text-xl font-bold tracking-[0.3em] text-[hsl(30,80%,65%)]">
          BATTLE OF THE FLAMES
        </p>
        <div className="mt-1 h-0.5 w-64 mx-auto bg-gradient-to-r from-transparent via-[hsl(15,100%,50%)] to-transparent" />
      </div>

      {/* Buttons */}
      <div className="relative z-10 flex flex-col gap-4">
        <button
          onClick={onStart}
          className="px-12 py-4 text-lg font-bold tracking-widest uppercase border-2 border-[hsl(15,80%,50%)] text-[hsl(30,90%,70%)] bg-[hsl(15,60%,15%)/0.6] hover:bg-[hsl(15,80%,50%)/0.3] hover:shadow-[0_0_30px_hsl(15,80%,50%,0.4)] transition-all duration-300 rounded"
        >
          ⚔️ Start Game
        </button>
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 text-sm text-[hsl(0,0%,40%)] tracking-wide">
        Press any key to continue
      </p>
    </div>
  );
};

export default TitleScreen;
