import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";
import type { User } from "../models/User";

interface FormData {
  id: string;
  username: string;
  email: string;
  password: string;
}

interface RegisterProps {
  setTitle: (title: string) => void;
}

const Register = ({ setTitle }: RegisterProps) => {
  useEffect(() => setTitle("Registrieren"), [setTitle]);

  const [formData, setFormData] = useState<FormData>({
    id: "",
    username: "",
    email: "",
    password: "",
  });

  const isEmailValid = validateEmail(formData.email);
  const isPasswordValid = validatePassword(formData.password);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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

    if (!isEmailValid || !isPasswordValid) {
      alert("Bitte korrigiere die markierten Felder.");
      return;
    }

    // Register the new user in redux
    const newUser: User = {
      id: Math.random().toString(),
      username: formData.username,
      email: formData.email,
      password: formData.password,
      name: "",
      surname: "",
      createdAt: new Date().toISOString(),
    };

    dispatch(loginSuccess(newUser));

    alert("Sie sind registriert!");
    setTimeout(() => navigate("/dashboard"), 1000);
  };

  const handleOnAlreadyRegisteredClick = () => {
    navigate("/login");
  };

  return (
    <div className="bg-gray-700 p-4 m-2 rounded flex flex-row self-center">
      <div>
        <p className="text-2xl text-white pb-4 text-left">
          Bitte registrieren Sie sich:{" "}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Benutzername"
            value={formData.username}
            className={`w-full p-2 rounded bg-gray-500 text-white border-2 outline-none transition-colors border-gray-600`}
            onChange={(e) => handleChange("username", e.target.value)}
            required
          />
          {!isEmailValid && touched.email && (
            <p className="text-red-400 text-xs mt-1 italic pb-0.5">
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
          {!isPasswordValid && touched.password && (
            <p className="text-red-400 text-xs mt-1 italic pb-0.5">
              Das Passwort muss mindestens 8 Zeichen, Klein-/Großbuchstaben,
              Zahlen und Sonderzeichen beinhalten
            </p>
          )}
          <input
            type="password"
            placeholder="Passwort"
            value={formData.password}
            className={`w-full p-2 rounded bg-gray-500 text-white border-2 outline-none transition-colors ${getBorderClass("email", isEmailValid)}`}
            onChange={(e) => handleChange("password", e.target.value)}
            required
          />
          <div className="flex flex-row gap-2">
            <button
              type="submit"
              className="w-[50%] bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              Registieren
            </button>
            <button
              className="w-[50%] bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer"
              onClick={handleOnAlreadyRegisteredClick}
            >
              Ich bin bereits Registriert!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Regex not in component because it brings more performance that way
const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePassword = (pw: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
    pw,
  );

export default Register;
