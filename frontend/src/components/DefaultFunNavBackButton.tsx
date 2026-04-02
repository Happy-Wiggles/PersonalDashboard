import { useState } from "react";
import { useNavigate } from "react-router";
import confetti from "canvas-confetti";

const DefaultFunNavBackButton = () => {
  const navigate = useNavigate();
  const [isFading, setIsFading] = useState(false);

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setIsFading(true);
    const rect = event.currentTarget.getBoundingClientRect();

    const buttonWidth = rect.width / window.innerWidth;
    const xCenter = (rect.left + rect.width / 2) / window.innerWidth;
    const y = rect.top / window.innerHeight;

    const duration = 800;
    const animationEnd = Date.now() + duration;
    let frameCount = 0;

    const frame = () => {
      if (frameCount % 5 === 0) {
        confetti({
          particleCount: 1,
          startVelocity: 1,
          ticks: 150,
          origin: {
            x: xCenter + (Math.random() * buttonWidth - buttonWidth / 2),
            y: y,
          },
          colors: ["#22d3ee", "#e0f2fe", "#ffffff"],
          shapes: ["circle"],
          flat: true,
          gravity: -0.6,
          scalar: Math.random() * 0.8 + 0.4,
          drift: Math.random() * 0.2 - 0.1,
          disableForReducedMotion: true,
        });
      }

      frameCount++;

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    frame();
    setTimeout(() => {
      navigate(-1);
      setIsFading(false);
    }, 800);
  };
  return (
    <div>
      <button
        onClick={handleBackButtonClick}
        className={`
      /* Deine Basis-Styles */
      p-2 px-4 rounded-lg flex items-center justify-center transition-all duration-2000 ease-out cursor-pointer
      
      /* Bedingte Farbe: Wenn nicht fadet -> Cyan, wenn fadet -> Hintergrundfarbe */
      ${
        isFading
          ? "bg-gray-800 border-transparent shadow-none text-transparent"
          : "bg-cyan-800 text-gray-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
      }
    `}
      >
        Zurück
      </button>
    </div>
  );
};

export default DefaultFunNavBackButton;
