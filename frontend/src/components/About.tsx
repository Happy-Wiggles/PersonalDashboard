import { useEffect } from "react";

interface AboutProps {
  setTitle: (title: string) => void;
}

const About = ({ setTitle }: AboutProps) => {
  useEffect(() => setTitle("Wer bin ich?"), [setTitle]);

  const descriptionText =
    "Meine Karriere begonn ich mit einem Studium als Informatik Bachelor, welches ich jedoch leider nicht vollständig beenden konnte. Das hat mich jedoch nicht aufgehalten diesen Weg weiter zu beschreiten! " +
    "Heute bin ich ein auf C# und .Net spezialisierter Fullstack Entwickler mit Erfahrungen in Frameworks wie ASP.Net, WPF, Windows Forms und kürzlich .Net MAUI." +
    "Um meine bisherigen Fähigkeiten im Bereich des Frontends zu erweitern habe ich angefangen mir React.js mit JS und TS anzueignen. \n " +
    "\nDer Aufbau eines modernen responsive Frontends und die Entwicklung eines performanten Backends sind mir sehr wichtig!" +
    " Hierbei sind ein hohes Maß an Analysefähigkeiten, ein Blick fürs Detail und vor allem eine ausgeprägte Mustererkennung relevant! " +
    "Clean Code ist bei mir kein Buzzword, sondern tägliche Realität. Vorausschauendes Denken und eine tiefgreifende Analyse der Gegebenheitem sind dafür eine Voraussetzung.";

  return (
    <div className="flex flex-col items-center w-full">
      {/* Content */}
      <div className="bg-gray-700 rounded flex flex-col items-center w-full p-6 h-150">
        <p className="text-lg text-white mb-4">
          Ein Fullstack .Net C# Entwickler, neuerdings mit Expertise in React
          mit Typescript
        </p>
        <div className="w-full mt-4 max-w-[720px] min-h-[100px] text-md text-gray-200 p-6 shadow-2xl rounded-2xl bg-gray-800/40 whitespace-pre-wrap">
          {descriptionText}
        </div>
      </div>
    </div>
  );
};

export default About;
