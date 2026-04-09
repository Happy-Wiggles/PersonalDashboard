import { useEffect, useState } from "react";

interface AboutProps {
  setTitle: (title: string) => void;
}

const About = ({ setTitle }: AboutProps) => {
  useEffect(() => setTitle("Wer bin ich?"), [setTitle]);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const descriptionText =
    "Mein Weg in die IT begann klassisch mit einem Informatik-Studium, doch meine wahre Leidenschaft fand ich in der Praxis. Heute bin ich spezialisierter Fullstack-Entwickler mit starkem Fokus auf das .NET-Ökosystem (C#)." +
    "\n\nVon robusten Enterprise-Lösungen mit ASP.NET und WPF bis hin zu modernen Cross-Platform-Apps mit .NET MAUI. Ich liebe es einfach komplexe Logik performant umzusetzen. " +
    "Um die Brücke zu modernen Web-Erlebnissen zu schlagen, habe ich mein Profil gezielt um React (JS/TS) erweitert, was man anhand dieser Website sehen kann." +
    "\nFür mich ist Clean Code keine bloße Theorie oder ein Buzzword, sondern die Basis für wartbare und skalierbare Software. " +
    "\n\nMein Ansatz: Vorrausschauende Analyse, Planung der Anforderungen und ein scharfer Blick für Details. Hierbei ist auch eine ausgeprägte Fähigkeit zur Mustererkennung unverzichtbar, um effiziente Lösungen zu aktuellen und zukünftigen Problemen zu finden.";

  return (
    <div className="flex flex-col w-full items-center min-h-screen p-4 md:p-8 space-y-10 bg-[rgba(15,23,52,0.6)] text-gray-10">
      <div
        id="descriptionTextDiv"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative bg-gray-800/70 backdrop-blur-md rounded-3xl flex flex-col items-center p-8 border border-white/10 shadow-2xl transition-all duration-400 max-w-6xl w-full overflow-hidden"
      >
        {/* Decorative Blurred light from the right top corner */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Title with css pulse effect */}
        <div className="flex flex-row gap-4 z-10">
          <p className="text-2xl font-black mb-6 uppercase tracking-wider titles-pulse pb-4">
            Fullstack .NET & React Developer
          </p>
        </div>

        {/* Description Text with size increase on hover */}
        <div
          className={`
        z-10 transition-all duration-500 ease-in-out
        bg-gray-900/60 backdrop-blur-lg
        p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] 
        rounded-2xl border border-cyan-500/20
        whitespace-pre-wrap leading-relaxed text-gray-200
        ${
          isHovered
            ? "w-full scale-[1.02] border-cyan-500/40 shadow-cyan-900/20 text-lg"
            : "w-[90%] scale-100 text-base"
        }
      `}
        >
          <div className="relative">
            {descriptionText}
            {/* Decorative corner element to show that its not only a regular text box */}
            <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-2 border-r-2 border-cyan-500/30 rounded-br-lg" />
          </div>
        </div>
        <p className="pt-6 text-[14px] font-bold text-gray-400/90 uppercase tracking-[3px]">
          Most advanced Skills:
        </p>
        <p className="pt-2 text-[16px] font-bold text-gray-500 uppercase tracking-[2px]">
          C# • .NET • React • TypeScript
        </p>
      </div>
    </div>
  );
};

export default About;
