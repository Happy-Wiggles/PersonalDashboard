import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { loginAsync, clearError } from "../features/auth/AuthSlice";
import type { RootState, AppDispatch } from "../store/store";

interface FormData {
  email: string;
  password: string;
}

interface LoginProps {
  setTitle: (title: string) => void;
}

const Login = ({ setTitle }: LoginProps) => {
  useEffect(() => setTitle("Login"), [setTitle]);
  const [showLoginError, setShowLoginError] = useState(false);

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
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    }
  };

  const handleOnRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="bg-gray-700 p-4 m-2 rounded flex flex-row self-center">
      <div>
        {isAuthenticated && (
          <div className="bg-green-600 rounded">
            <p className="text-gray-200">Login erfolgreich!</p>
          </div>
        )}
        <p className="text-2xl text-white pb-4 text-left">
          Bitte loggen Sie sich ein:{" "}
        </p>

        {/* Error message display */}
        {error && showLoginError && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="E-Mail"
            value={formData.email}
            className={`w-full p-2 rounded bg-gray-500 text-white border-2 border-gray-300`}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Passwort"
            value={formData.password}
            className={`w-full p-2 rounded bg-gray-500 text-white border-2 border-gray-300`}
            onChange={(e) => handleChange("password", e.target.value)}
            required
            disabled={loading}
          />
          <div id="loginButtonSection" className="flex flex-row gap-2">
            <button
              type="submit"
              className={`w-[50%] bg-green-600 text-white py-2 rounded hover:bg-green-700 transition cursor-pointer ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>
            <button
              type="button"
              className="w-[50%] bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
              onClick={handleOnRegisterClick}
              disabled={loading}
            >
              Registieren
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
