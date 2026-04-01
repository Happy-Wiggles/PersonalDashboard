import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { registerAsync, clearError } from "../features/auth/AuthSlice";
import type { RootState, AppDispatch } from "../store/store";

interface FormData {
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
}

interface RegisterProps {
  setTitle: (title: string) => void;
}

const Register = ({ setTitle }: RegisterProps) => {
  useEffect(() => setTitle("Registrieren"), [setTitle]);

  const [formData, setFormData] = useState<FormData>({
    username: "",
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const isEmailValid = validateEmail(formData.email);
  const isPasswordValid = validatePassword(formData.password);

  // Select auth state from Redux store
  const { isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  const [touched, setTouched] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});

  // Clear any previous error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Navigate to dashboard after successful registration
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const getBorderClass = (fieldName: keyof FormData, isValid: boolean) => {
    if (!touched[fieldName]) return "border-gray-600";
    return isValid
      ? "border-green-500 outline-none"
      : "border-red-500 outline-none";
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    // Call async register action
    const result = await dispatch(
      registerAsync({
        username: formData.username,
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        password: formData.password,
      }),
    );

    if (result.type === registerAsync.fulfilled.type) {
      console.log("Registration successful!");
    }
  };

  const handleOnAlreadyRegisteredClick = () => {
    navigate("/login");
  };

  return (
    <div className="bg-gray-700 p-6 m-2 w-110 rounded flex flex-row self-center">
      {isAuthenticated && (
        <div className="bg-gray-500 rounded-lg text-green-500 self-center p-4 m-2">
          <p>Sie sind bereits eingeloggt!</p>
        </div>
      )}
      <div>
        <p className="text-2xl text-white pb-4 text-left">
          Bitte registrieren Sie sich:{" "}
        </p>

        {/* Error message display */}
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Benutzername"
            value={formData.username}
            className={`w-full p-2 rounded bg-gray-500 text-white border-2  transition-colors border-gray-600`}
            onChange={(e) => handleChange("username", e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Vorname"
            value={formData.name}
            className={`w-full p-2 rounded bg-gray-500 text-white border-2 transition-colors border-gray-600`}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Nachname"
            value={formData.surname}
            className={`w-full p-2 rounded bg-gray-500 text-white border-2 transition-colors border-gray-600`}
            onChange={(e) => handleChange("surname", e.target.value)}
            required
            disabled={loading}
          />
          {/* Email Section */}
          {!isEmailValid && touched.email && (
            <p className="text-red-400 text-xs mt-1 italic pb-0.5">
              Ungültige E-Mail Adresse
            </p>
          )}
          <input
            type="email"
            placeholder="E-Mail"
            value={formData.email}
            className={`w-full p-2 rounded bg-gray-500 text-white border-2 transition-colors ${getBorderClass("email", isEmailValid)}`}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            disabled={loading}
          />
          {/* Password Section */}
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
            className={`w-full p-2 rounded bg-gray-500 text-white border-2 transition-colors ${getBorderClass("password", isPasswordValid)}`}
            onChange={(e) => handleChange("password", e.target.value)}
            required
            disabled={loading}
          />
          <div className="flex flex-row gap-2">
            <button
              type="submit"
              className={`w-[50%] bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading || !isEmailValid || !isPasswordValid}
            >
              {loading ? "Loading..." : "Registieren"}
            </button>
            <button
              type="button"
              className="w-[50%] bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer disabled:opacity-50"
              onClick={handleOnAlreadyRegisteredClick}
              disabled={loading}
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
