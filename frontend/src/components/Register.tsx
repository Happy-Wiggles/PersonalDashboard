import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { registerAsync, clearError } from "../features/auth/AuthSlice";
import type { RootState, AppDispatch } from "../store/store";
import confetti from "canvas-confetti";
import {
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

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
  const [showPassword, setShowPassword] = useState<boolean>(false);

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

  const { isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  const [touched, setTouched] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEmailValid || !isPasswordValid) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2 - 110) / window.innerWidth;
    const y = (rect.top + rect.height / 2 + 60) / window.innerHeight;

    const result = await dispatch(
      registerAsync({
        username: formData.username,
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        password: formData.password,
        role: "user",
      }),
    );

    if (result.type === registerAsync.fulfilled.type) {
      confetti({
        particleCount: 250,
        spread: 360,
        origin: { x, y },
        zIndex: 1000,
        disableForReducedMotion: true,
        startVelocity: 20,
        shapes: ["circle"],
        flat: true,
        drift: Math.random() - 0.5,
        angle: 90,
        gravity: 0,
        decay: 1.005,
        colors: ["#25fa5e", "#a3ffbc", "#00ff0d"],
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0f172a]">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded">
          <ArrowPathIcon className="w-12 h-12 animate-spin text-cyan-400" />
        </div>
      )}

      {/* Fun floating cyber grid */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 w-full h-[200%] cyber-grid animate-grid-flow opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-cyan-950/40 rounded-full blur-[120px] animate-orb-float-subtle"></div>
        <div className="absolute -bottom-20 -right-20 w-125 h-125 rounded-full bg-blue-950/30 blur-[150px]"></div>
        <div className="absolute inset-0 bg-linear-to-t from-[#0a1120] via-transparent to-[#0a1120] opacity-80"></div>
        <div className="absolute inset-0 bg-linear-to-r from-[#0a1120] via-transparent to-[#0a1120] opacity-80"></div>
      </div>
      <div className="relative z-10 w-full max-w-md px-4 pb-20">
        <div className="bg-gray-800 p-4 m-2 rounded-xl border border-gray-600 shadow-lg shadow-cyan-900/20">
          <div className="px-2">
            <p className="text-[22px] text-gray-200 pb-4 text-center uppercase tracking-wide font-semibold">
              Bitte registrieren Sie sich:
            </p>

            {/* Error message display */}
            {error && (
              <div className="bg-red-500 text-gray-200 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            {isAuthenticated && (
              <div className="bg-gray-700/50 border border-green-500/50 text-green-400 p-3 rounded mb-4 text-sm text-center">
                Sie sind bereits eingeloggt!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Benutzername"
                value={formData.username}
                className={`w-full p-3 rounded-xl bg-gray-900/50 text-gray-200 border-2 border-gray-600 focus:border-cyan-400 transition-all outline-none ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                onChange={(e) => handleChange("username", e.target.value)}
                required
                disabled={loading}
              />

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Vorname"
                  value={formData.name}
                  className={`w-1/2 p-3 rounded-xl bg-gray-900/50 text-gray-200 border-2 border-gray-600 focus:border-cyan-400 transition-all outline-none ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  disabled={loading}
                />
                <input
                  type="text"
                  placeholder="Nachname"
                  value={formData.surname}
                  className={`w-1/2 p-3 rounded-xl bg-gray-900/50 text-gray-200 border-2 border-gray-600 focus:border-cyan-400 transition-all outline-none ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  onChange={(e) => handleChange("surname", e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="relative">
                <input
                  type="email"
                  placeholder="E-Mail"
                  value={formData.email}
                  className={`w-full p-3 rounded-xl bg-gray-900/50 text-gray-200 border-2 border-gray-600 focus:border-cyan-400 transition-all outline-none ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  disabled={loading}
                />
                {!isEmailValid && touched.email && (
                  <p className="text-red-400 text-[10px] mt-0.5 italic pl-1">
                    Ungültige E-Mail Adresse
                  </p>
                )}
              </div>

              {/* Password input with show/hide toggle */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // Type changes based on showPassword state
                  placeholder="Passwort"
                  value={formData.password}
                  className={`w-full p-3 rounded-xl bg-gray-900/50 text-gray-200 border-2 border-gray-600 focus:border-cyan-400 transition-all outline-none ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <div className="flex flex-row gap-2">
                  <button
                    type="submit"
                    className={`w-1/2 bg-green-600 text-gray-200 py-2 rounded hover:bg-green-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                    disabled={loading || !isEmailValid || !isPasswordValid}
                  >
                    {loading ? "Loading..." : "Registrieren"}
                  </button>
                  <button
                    type="button"
                    className="w-[50%] bg-[rgba(20,210,240,0.5)] text-white py-2 rounded hover:bg-[rgba(20,210,240,0.8)] transition cursor-pointer disabled:opacity-50"
                    onClick={() => navigate("/login")}
                    disabled={loading}
                  >
                    Zum Login
                  </button>
                </div>

                <p className="text-[11px] text-gray-500 leading-tight text-center px-4">
                  Mit der Registrierung erklärst du dich mit unserer{" "}
                  <Link
                    to="/privacy"
                    className="text-blue-400 underline hover:text-gray-200"
                  >
                    Datenschutzerklärung
                  </Link>{" "}
                  einverstanden.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (pw: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
    pw,
  );

export default Register;
