import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import confetti from "canvas-confetti";

interface PrivacyProps {
  setTitle: (title: string) => void;
}

const Privacy = ({ setTitle }: PrivacyProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    setTitle(`Weil Sie es ja sehen wollten... Datenschutz!`);
  }, [setTitle]);

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x, y },
      zIndex: 1000,
      disableForReducedMotion: true,
      colors: ["#0891b2", "#22d3ee", "#2afc23", "#8f23fc"],
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 120,
        origin: { x, y },
        colors: ["#0891b2", "#22d3ee", "#ffffff"],
      });
    }, 200);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 130,
        spread: 120,
        origin: { x, y },
        colors: ["#0891b2", "#22d3ee", "#ffffff"],
      });
    }, 500);

    setTimeout(() => navigate(-1), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-800/40 py-12 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-3xl mx-auto bg-[rgba(30,41,59,0.8)] p-8 rounded-lg shadow-md">
        <button
          onClick={handleBackButtonClick}
          className="bg-cyan-800 text-gray-300 hover:bg-cyan-600 p-2 px-4 mb-6 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
        >
          Zurück (und Tschüss!)
        </button>

        <p className="text-2xl font-bold text-gray-50 mb-8">
          Datenschutzerklärung:
        </p>

        <div className="space-y-6 text-gray-200 leading-relaxed text-sm">
          <section className="my-6 mx-10">
            <p className="text-xl font-semibold text-gray-50 mb-2 pb-2 underline">
              1. Allgemeine Hinweise (Yay, so much fun!)
            </p>
            <p>
              Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und
              Zweck der Verarbeitung von personenbezogenen Daten innerhalb
              dieser ToDo-Applikation auf. Da dies ein **Lernprojekt** ist,
              werden Ihre Daten ausschließlich zur Bereitstellung der
              Kernfunktionen dieser App verwendet.
            </p>
          </section>

          <section className="my-6 mx-10">
            <p className="text-xl font-semibold text-gray-50 mb-2 pb-2 underline">
              2. Datenerfassung in dieser App (Wir sind lieb, versprochen!)
            </p>
            <p className="">
              Wir verarbeiten folgende Daten, um Ihnen ein Benutzerkonto
              bereitzustellen:
            </p>
            <ul className="list-disc ml-5 mt-2 space-y-1 text-left">
              <li>
                <strong>Benutzerdaten:</strong> E-Mail-Adresse, Benutzername,
                Vorname, Nachname.
              </li>
              <li>
                <strong>Passwort:</strong> Ihr Passwort wird ausschließlich in
                gehashter Form (bcrypt) in unserer Datenbank gespeichert.
              </li>
              <li>
                <strong>Inhaltsdaten:</strong> Die von Ihnen erstellten
                ToDo-Listen und Aufgaben.
              </li>
            </ul>
          </section>

          <section className="my-6 mx-10">
            <p className="text-xl font-semibold text-gray-50 mb-2 pb-2 underline">
              3. Authentifizierung & Cookies (Nur das Nötigste!)
            </p>
            <p>
              Um Sie eingeloggt zu halten, nutzen wir JSON Web Tokens (JWT).
              Hierbei kommen folgende Mechanismen zum Einsatz:
            </p>
            <ul className="list-disc ml-5 mt-2 space-y-1 text-left">
              <li>
                <strong>Access Token:</strong> Ein kurzlebiger Token, der in
                Ihrem Browser (LocalStorage) gespeichert wird.
              </li>
              <li>
                <strong>Refresh Token:</strong> Ein technisch notwendiger Cookie
                (httpOnly), der dazu dient, Ihre Sitzung sicher zu verlängern.
                Dieser Cookie wird nicht zu Werbezwecken genutzt und nach 7
                Tagen oder beim Logout gelöscht.
              </li>
            </ul>
          </section>

          <section className="my-6 mx-10">
            <p className="text-xl font-semibold text-gray-50 mb-2 pb-2 underline">
              4. Speicherung der Daten (Fast gar nix!)
            </p>
            <p>
              Ihre Daten werden in einer lokalen SQLite-Datenbank auf unserem
              Server gespeichert. Eine Weitergabe an Dritte findet nicht statt.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <p className="italic text-gray-400">
              Hinweis: Da dies ein Entwicklungsprojekt ist, übernehmen wir keine
              Haftung für die dauerhafte Sicherheit der Daten. Bitte verwenden
              Sie keine Passwörter, die Sie auch bei anderen Diensten nutzen.
              (Das meinen wir ernst! Sonst gibt's kein Konfetti mehr.)
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
