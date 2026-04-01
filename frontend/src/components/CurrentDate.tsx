import { useState, useEffect } from "react";

const CurrentDate = () => {
  const initialDate = new Date().toLocaleDateString("de-DE");
  const [date, setDate] = useState<string>(initialDate);

  // Basically an infinite async loop (called when date has changed => changes date => repeeat)
  useEffect(() => {
    setTimeout(() => setDate(new Date().toLocaleDateString("de-DE")), 300000); // Every 5min
  }, [date]);

  return (
    <div>
      <p className="text-2xl text-gray-200 font-bold">{date}</p>
    </div>
  );
};

export default CurrentDate;
