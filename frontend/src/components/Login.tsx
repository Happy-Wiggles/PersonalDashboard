import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { loginAsync, clearError } from "../features/auth/AuthSlice";
import type { RootState, AppDispatch } from "../store/store";
import confetti from "canvas-confetti";
import {
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

interface FormData {
  email: string;
  password: string;
}

interface LoginProps {
  setTitle: (title: string) => void;
}

const Login = ({ setTitle }: LoginProps) => {
  useEffect(() => setTitle("Login"), [setTitle]);
  const [showLoginError, setShowLoginError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Select auth state from Redux store
  const { isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  const isEmailValid = validateEmail(formData.email);

  // Show error message for 3 seconds if there's an error
  useEffect(() => {
    if (error) {
      const setShowLogin = () => {
        setShowLoginError(true);
      };

      setShowLogin();

      const timer = setTimeout(() => {
        setShowLoginError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Clear any previous error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Navigate to dashboard after successful login
  useEffect(() => {
    if (isAuthenticated) {
      const setShowLogin = () => {
        setShowLoginError(false);
      };
      setShowLogin();

      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Calculate the center of the button
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2 - 110) / window.innerWidth;
    const y = (rect.top + rect.height / 2 + 60) / window.innerHeight;

    const dirMin = -0.5;
    const dirMax = 0.5;

    const randDirection = getRandomInt(dirMin, dirMax);

    const angleMin = 65;
    const angleMax = 115;

    const randAngle = getRandomInt(angleMin, angleMax);

    // Call async login action
    // This dispatches loginAsync thunk which handles API communication
    const result = await dispatch(
      loginAsync({
        email: formData.email,
        password: formData.password,
      }),
    );

    // result.payload contains the response if successful
    if (result.type === loginAsync.fulfilled.type) {
      // Success - user will be redirected via useEffect
      console.log("Login successful!\n\nResponse: ", result.payload);

      confetti({
        particleCount: 250,
        spread: 360,
        origin: { x, y },
        zIndex: 1000,
        disableForReducedMotion: true,
        startVelocity: 20,
        shapes: ["circle"],
        flat: true,
        drift: randDirection,
        angle: randAngle,
        gravity: 0,
        decay: 1.005,
        colors: ["#25fa5e", "#a3ffbc", "#00ff0d"],
      });
    }
  };

  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleOnRegisterClick = () => {
    navigate("/register");
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

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-4 pb-20">
        <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl border border-gray-600 shadow-lg shadow-cyan-900/20 w-full">
          <p className="text-[22px] text-gray-200 pb-6 text-center uppercase tracking-wide font-semibold">
            Bitte loggen Sie sich ein
          </p>

          {error && showLoginError && (
            <div className="bg-red-500/80 backdrop-blur-sm text-white p-3 rounded-xl mb-4 text-sm border border-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="E-Mail"
              value={formData.email}
              className={`w-full p-3 rounded-xl bg-gray-900/50 text-gray-200 border-2 border-gray-600 focus:border-cyan-400 transition-all outline-none ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              disabled={loading}
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Passwort"
                value={formData.password}
                className={`w-full p-3 pr-12 rounded-xl bg-gray-900/50 text-gray-200 border-2 border-gray-600 focus:border-cyan-400 transition-all outline-none ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Button Section */}

            <div id="loginButtonSection" className="flex flex-row gap-2">
              <button
                type="submit"
                className={`w-1/2 bg-green-600 text-gray-200 py-2 rounded hover:bg-green-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={loading || !isEmailValid}
              >
                {loading ? "Loading..." : "Login"}
              </button>

              <button
                type="button"
                className="w-[50%] bg-[rgba(20,210,240,0.5)] text-white py-2 rounded hover:bg-[rgba(20,210,240,0.8)] transition cursor-pointer disabled:opacity-50"
                onClick={handleOnRegisterClick}
                disabled={loading}
              >
                Registieren
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default Login;
