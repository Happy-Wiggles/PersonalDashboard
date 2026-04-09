import { useState } from "react";

interface FormData {
  id: string;
  name: string;
  surname: string;
  email: string;
  tel: string;
  linkedInProfile: string;
  message: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    id: "",
    name: "",
    surname: "",
    email: "",
    tel: "",
    linkedInProfile: "",
    message: "",
  });
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});

  const isEmailValid = validateEmail(formData.email);
  const isTelValid = validateTel(formData.tel);

  const isFieldEmpty = (fieldText: string) => {
    return fieldText.trim() === "";
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (isFieldEmpty(value) && touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: false }));
    } else {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEmailValid || !isTelValid) return;
    alert("Nachricht wurde gesendet!");
  };

  const inputBaseClass =
    "w-full p-3 rounded-xl bg-gray-900/50 text-white border-[1px] border-gray-700 focus:border-cyan-500 transition-all outline-none";

  const getBorderColor = (field: keyof FormData, isValid: boolean) => {
    if (!touched[field])
      return "border-gray-700 hover:border-gray-600 focus:border-cyan-500";
    return isValid
      ? "border-green-500/50 focus:border-green-500"
      : "border-red-500/50 focus:border-red-500";
  };

  return (
    <div className="bg-gray-800/70 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl">
      <p className="text-2xl font-semibold uppercase tracking-wide bg-linear-to-r from-cyan-400 via-cyan-200 to-blue-500 animate-gradient-logo bg-clip-text text-transparent pb-8">
        Schreibe mir gern eine Nachricht!
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <input
              type="text"
              placeholder="Vorname"
              value={formData.name}
              className={`${inputBaseClass}`}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <input
              type="text"
              placeholder="Nachname"
              value={formData.surname}
              className={`${inputBaseClass}`}
              onChange={(e) => handleChange("surname", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <input
            type="email"
            placeholder="E-Mail Adresse"
            value={formData.email}
            className={`${inputBaseClass} ${getBorderColor("email", isEmailValid)}`}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
          {!isEmailValid && touched.email && (
            <p className="text-red-400 text-[12px] font-bold uppercase ml-2">
              Ungültige E-Mail
            </p>
          )}
        </div>

        <div className="space-y-1">
          <input
            type="text"
            placeholder="Telefonnummer"
            value={formData.tel}
            className={`${inputBaseClass} ${getBorderColor("tel", isTelValid)}`}
            onChange={(e) => handleChange("tel", e.target.value)}
            required
          />
          {!isTelValid && touched.tel && (
            <p className="text-red-400 text-[12px] font-bold uppercase ml-2">
              Ungültige Nummer - ( bitte im Format +49 123 4567890 eingeben )
            </p>
          )}
        </div>

        <input
          type="text"
          placeholder="LinkedIn-Profil (Optional)"
          value={formData.linkedInProfile}
          className={`${inputBaseClass}`}
          onChange={(e) => handleChange("linkedInProfile", e.target.value)}
        />

        <div className="space-y-1">
          <textarea
            placeholder="Deine Nachricht an mich..."
            value={formData.message}
            rows={5}
            className={`${inputBaseClass} ${getBorderColor("message", formData.message.length > 5)} resize-none`}
            onChange={(e) => handleChange("message", e.target.value)}
            required
          />
          {touched.message && formData.message.length < 5 && (
            <p className="text-red-400 text-[10px] font-bold uppercase ml-2">
              Die Nachricht ist noch etwas zu kurz...
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={
            !isEmailValid || !isTelValid || formData.message.length <= 0
          }
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-cyan-900/40 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed cursor-pointer"
        >
          Nachricht Senden
        </button>
      </form>
    </div>
  );
};

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateTel = (tel: string) => {
  const telRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{5,20}$/;
  return telRegex.test(tel.trim());
};

export default ContactForm;
