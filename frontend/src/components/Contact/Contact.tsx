import { useEffect } from "react";
import ContactForm from "./ContactForm";

interface ContactProps {
  setTitle: (title: string) => void;
}

const Contact = ({ setTitle }: ContactProps) => {
  // const CONTACT_MAIL =
  //   import.meta.env.VITE_CONTACT_MAIL || "meineMail@gmail.com";

  useEffect(() => setTitle("Kontakt"), [setTitle]);

  return (
    <div className="mx-4 p-4 flex flex-col w-full items-center min-h-screen space-y-1 bg-[rgba(15,23,52,0.6)] text-gray-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-[70%]">
        {/* Impressum / Kontakt-Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-800/70 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl h-full">
            <h2 className="text-2xl font-black uppercase tracking-widest text-cyan-400 mb-8 titles-pulse">
              Impressum
            </h2>

            <div className="space-y-4 text-gray-300">
              <div className="group transition-all">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                  Stadt & PLZ
                </p>
                <p className="text-lg font-medium group-hover:text-white transition-colors">
                  12664 Berlin
                </p>
              </div>

              <div className="group transition-all">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                  Straße
                </p>
                <p className="text-lg font-medium group-hover:text-white transition-colors">
                  Berliner Straße 42
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-4">
                <div className="group">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                    E-Mail
                  </p>
                  <p className="text-lg font-medium text-cyan-400 group-hover:text-cyan-300">
                    meineMail@gmail.com {/* {CONTACT_MAIL} */}
                  </p>
                </div>

                <div className="group">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                    Telefon
                  </p>
                  <p className="text-lg font-medium group-hover:text-white transition-colors">
                    Gern auf Anfrage
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative and informative text */}
            <div className="mt-12 p-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/10">
              <p className="text-xs text-cyan-400/60 italic leading-relaxed">
                Ich freue mich über Anfragen zu spannenden Projekten, fachlichem
                Austausch über .NET & React, oder neuen Business-Möglichkeiten!
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default Contact;
