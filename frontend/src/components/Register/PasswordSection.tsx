import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface FormData {
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
}

interface PasswordSectionProps {
  formData: FormData;
  handleChange: (field: keyof FormData, value: string) => void;
}

const PasswordSection = ({
  formData,
  handleChange: handleChange,
}: PasswordSectionProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { loading } = useSelector((state: RootState) => state.auth);

  const [touched, setTouched] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});

  const requirements = getPasswordRequirements(formData.password);
  const isPasswordValid = validatePassword(formData.password);

  const handleChangeTouched = (field: keyof FormData, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    handleChange("password", value);
  };

  return (
    <div>
      {/* Password input with show/hide toggle */}
      <input
        type={showPassword ? "text" : "password"} // type changes on showPassword
        placeholder="Passwort"
        value={formData.password}
        className={`w-full p-3 pr-10 rounded-xl bg-gray-900/50 text-gray-200 border-2 border-gray-600 focus:border-cyan-400 transition-all outline-none ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        } ${touched.password && !isPasswordValid ? "border-red-500/50" : ""}`}
        onChange={(e) => handleChangeTouched("password", e.target.value)}
        required
        disabled={loading}
      />
      {/* Password hide/show Button */}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute top-3.5 right-3 text-gray-400 hover:text-cyan-400 cursor-pointer"
      >
        {showPassword ? (
          <EyeSlashIcon className="h-5 w-5" />
        ) : (
          <EyeIcon className="h-5 w-5" />
        )}
      </button>
      {/* Password Requirements Checklist */}
      {touched.password && (
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 px-1">
          {requirements.map((req) => (
            <div
              className={`flex items-center gap-1.5 text-[10px] transition-colors ${
                req.met ? "text-green-400" : "text-gray-500"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  req.met
                    ? "bg-green-400 shadow-[0_0_5px_#4ade80]"
                    : "bg-gray-600"
                }`}
              />
              {req.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getPasswordRequirements = (pw: string) => {
  return [
    { label: "Mind. 8 Zeichen", met: pw.length >= 8 },
    { label: "Großbuchstabe", met: /[A-Z]/.test(pw) },
    { label: "Kleinbuchstabe", met: /[a-z]/.test(pw) },
    { label: "Zahl", met: /\d/.test(pw) },
    { label: "Mind. 1 Sonderzeichen", met: /[^A-Za-z0-9]/.test(pw) },
  ];
};

const validatePassword = (pw: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pw);

export default PasswordSection;
