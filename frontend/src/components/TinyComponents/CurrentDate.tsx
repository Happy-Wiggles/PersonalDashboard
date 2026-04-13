import { useState, useEffect } from "react";

const CurrentDate = () => {
  const initialDate = new Date();
  const [date, setDate] = useState<Date>(initialDate);

  // Basically an infinite async loop (called when date has changed => changes date => repeeat)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDate(new Date());
    }, 300000); // Every 5 Min

    // Clear Timer => no Memory Leaks
    return () => clearTimeout(timer);
  }, [date]);

  const formatDate = (dateObj: Date) => {
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(dateObj);
  };

  return (
    <div>
      <p className="text-2xl text-gray-200 font-bold">
        {formatDate(date)?.toString()}
      </p>
    </div>
  );
};

export default CurrentDate;
