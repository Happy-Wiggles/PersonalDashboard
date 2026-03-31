import { useEffect } from "react";
import ContactForm from "./ContactForm";

interface ContactProps {
  setTitle: (title: string) => void;
}

const Contact = ({ setTitle }: ContactProps) => {
  useEffect(() => setTitle("Kontakt"), [setTitle]);

  return (
    <div className="flex flex-row text-left m-2 gap-2 mx-80">
      <div className="bg-gray-700 p-4 rounded-md w-130 h-full text-gray-200">
        <p className="text-2xl pb-4 text-gray-100 font-bold">Impressum:</p>
        <p>Stadt: Berlin</p>
        <p>PLZ: 12664</p>
        <p>Straße: Meine Straße 42</p>
        <p>Email: meineEmail@gmail.com</p>
        <p>Telefonnummer: +49 1232 6251222</p>
      </div>
      <div className="ml-10">
        <ContactForm></ContactForm>
      </div>
    </div>
  );
};

export default Contact;
