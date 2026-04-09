import { useState, useEffect } from "react";

const CurrentDate = () => {
  const initialDate = new Date().toLocaleDateString("de-DE");
  const [date, setDate] = useState<string>(initialDate);

  // Basically an infinite async loop (called when date has changed => changes date => repeeat)
  useEffect(() => {
    setTimeout(() => setDate(new Date().toLocaleDateString("de-DE")), 300000); // Every 5min
  }, [date]);

  const formatDate = (date: string | undefined) => {
    if (date === undefined) {
      return new Date();
    }

    const dateObj = new Date(date);
    const formattedDate = new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(dateObj);

    return formattedDate;
  };

  return (
    <div>
      <p className="text-2xl text-gray-200 font-bold">
        {formatDate(date).toString()}
      </p>
    </div>
  );
};

export default CurrentDate;
