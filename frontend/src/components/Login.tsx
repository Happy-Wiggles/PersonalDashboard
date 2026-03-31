import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";
import type { User } from "../models/User";

interface FormData {
  email: string;
  password: string;
}

interface LoginProps {
  setTitle: (title: string) => void;
}

const Login = ({ setTitle }: LoginProps) => {
  useEffect(() => setTitle("Login"), [setTitle]);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch(); // Redux-Dispatch - damit können wir Actionen "auslösen"

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    const loggedInUser: User = {
      id: Math.random().toString(),
      username: "",
      email: formData.email,
      password: formData.password,
      name: "",
      surname: "",
      createdAt: new Date().toISOString(),
    };

    dispatch(loginSuccess(loggedInUser));

    alert("Sie sind eingeloggt!");
    setTimeout(() => navigate("/dashboard"), 1000);
  };

  const handleOnRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="bg-gray-700 p-4 m-2 rounded flex flex-row self-center">
      <div>
        <p className="text-2xl text-white pb-4 text-left">
          Bitte loggen Sie sich ein:{" "}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="E-Mail"
            value={formData.email}
            className={`w-full p-2 rounded bg-gray-500 text-white border-2 border-gray-300`}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Passwort"
            value={formData.password}
            className={`w-full p-2 rounded bg-gray-500 text-white border-2 border-gray-300`}
            onChange={(e) => handleChange("password", e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-[50%] bg-green-600 text-white py-2 rounded hover:bg-green-700 transition cursor-pointer"
          >
            Login
          </button>
          <button
            className="w-[50%] bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer"
            onClick={handleOnRegisterClick}
          >
            Registieren
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;
