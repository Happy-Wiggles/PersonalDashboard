import { useEffect, useState } from "react";

interface AboutProps {
  setTitle: (title: string) => void;
}

const About = ({ setTitle }: AboutProps) => {
  useEffect(() => setTitle("Wer bin ich?"), [setTitle]);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const descriptionText =
    "Meine Karriere begonn ich mit einem Studium als Informatik Bachelor, welches ich jedoch leider nicht vollständig beenden konnte. Das hat mich jedoch nicht aufgehalten diesen Weg weiter zu beschreiten! " +
    "\n\nHeute bin ich ein auf C# und .Net spezialisierter Fullstack Entwickler mit Erfahrungen in Frameworks wie ASP.Net, WPF, Windows Forms und kürzlich .Net MAUI." +
    "Um meine bisherigen Fähigkeiten im Bereich des Frontends zu erweitern habe ich angefangen mir React.js mit JS und TS anzueignen. \n " +
    "\nDer Aufbau eines modernen responsive Frontends und die Entwicklung eines performanten Backends sind mir sehr wichtig!" +
    " Hierbei sind ein hohes Maß an Analysefähigkeiten, ein Blick fürs Detail und vor allem eine ausgeprägte Mustererkennung relevant! " +
    "Clean Code ist bei mir kein Buzzword, sondern tägliche Realität. Vorausschauendes Denken und eine tiefgreifende Analyse der Gegebenheitem sind dafür eine Voraussetzung.";

  return (
    <div className="flex flex-col w-full items-center">
      <div
        id="descriptionTextDiv"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-gray-800 rounded flex flex-col items-center p-6 pb-10 h-140 w-300"
      >
        <div className="flex flex-row gap-4">
          <p className="text-xl font-bold text-gray-200 mb-4 pb-4 pt-1">
            Ein Fullstack .Net C# Entwickler, neuerdings mit Expertise in React
            mit Typescript
          </p>
        </div>
        <div
          className={`mt-4 ${isHovered ? "w-[1100px] h-[450px] text-xl" : "w-[800px] h-[420px] text-md"} text-gray-200 p-6 shadow-2xl rounded-2xl bg-gray-900/50 whitespace-pre-wrap`}
        >
          {descriptionText}
        </div>
      </div>
    </div>
  );
};

export default About;
