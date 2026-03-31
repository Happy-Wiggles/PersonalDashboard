import { useState } from "react";

interface FormData {
  id: string;
  name: string;
  surname: string;
  email: string;
  tel: string;
  linkedInProfile: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    id: "",
    name: "",
    surname: "",
    email: "",
    tel: "",
    linkedInProfile: "",
  });

  const isEmailValid = validateEmail(formData.email);
  const isTelValid = validateTel(formData.tel);

  const [touched, setTouched] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});

  const getBorderClass = (fieldName: keyof FormData, isValid: boolean) => {
    if (!touched[fieldName]) return "border-gray-600";
    return isValid ? "border-green-500" : "border-red-500";
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!isEmailValid || !isTelValid) {
      alert("Bitte korrigiere die markierten Felder.");
      return;
    }
    alert("Nachricht wurde gesendet!");
  };

  return (
    <div className="p-4 bg-gray-700 rounded">
      <p className="text-2xl font-bold text-gray-200 pb-4">Kontaktformular:</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Vorname"
          value={formData.name}
          className="w-full p-2 rounded bg-gray-500 text-white border border-gray-600 focus:border-blue-500 outline-none"
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nachname"
          value={formData.surname}
          className="w-full p-2 rounded bg-gray-500 text-white border border-gray-600 focus:border-blue-500 outline-none"
          onChange={(e) => handleChange("surname", e.target.value)}
          required
        />
        {!isEmailValid && touched.email && (
          <p className="text-red-400 text-xs mt-1 italic">
            Ungültige E-Mail Adresse
          </p>
        )}
        <input
          type="email"
          placeholder="E-Mail"
          value={formData.email}
          className={`w-full p-2 rounded bg-gray-500 text-white border-2 outline-none transition-colors ${getBorderClass("email", isEmailValid)}`}
          onChange={(e) => handleChange("email", e.target.value)}
          required
        />

        {!isTelValid && touched.tel && (
          <p className="text-red-400 text-xs mt-1 italic">
            Ungültige Telefonnummer
          </p>
        )}
        <input
          type="text"
          placeholder="Telefonnummer"
          value={formData.tel}
          className={`w-full p-2 rounded bg-gray-500 text-white border-2 outline-none transition-colors ${getBorderClass("tel", isTelValid)}`}
          onChange={(e) => handleChange("tel", e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="LinkedIn-Profil"
          value={formData.linkedInProfile}
          className="w-full p-2 rounded bg-gray-500 text-white border border-gray-600 focus:border-blue-500 outline-none"
          onChange={(e) => handleChange("linkedInProfile", e.target.value)}
        />

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={!isEmailValid || !isTelValid}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Senden
          </button>
        </div>
      </form>
    </div>
  );
};

// Regex not in component because it brings more performance that way
const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateTel = (tel: string) =>
  /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/.test(tel);

export default ContactForm;
