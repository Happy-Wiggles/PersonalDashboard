import { useState, useEffect } from "react";

const Clock = () => {
  const initialDate = new Date().toLocaleTimeString("de-DE");
  const [time, setTime] = useState<string>(initialDate);

  // Basically an infinite async loop (called when time has changed => changes time => repeeat)
  useEffect(() => {
    setTimeout(() => setTime(new Date().toLocaleTimeString("de-DE")), 1000);
  }, [time]);

  return (
    <div>
      <p className="text-2xl text-gray-200 font-bold">{time}</p>
    </div>
  );
};

export default Clock;
