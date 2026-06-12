import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface PasswordSectionProps {
  incPassword: string;
  onChange: (value: string) => void;
  isCurrentPasswordField?: boolean;
}

const PasswordSection = ({
  incPassword,
  onChange,
  isCurrentPasswordField = false,
}: PasswordSectionProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { loading } = useSelector((state: RootState) => state.auth);

  const [touched, setTouched] = useState<boolean>(false);

  const requirements = getPasswordRequirements(incPassword);
  const isPasswordValid = validatePassword(incPassword);

  const handleChange = (value: string) => {
    setTouched(true);
    onChange(value); // propagate value
  };

  return (
    <div>
      <input
        name="password"
        type={showPassword ? "text" : "password"}
        placeholder={isCurrentPasswordField ? "••••••••" : "Neues Passwort"}
        value={incPassword}
        className={`w-full p-3 pr-10 rounded-lg bg-gray-900/50 text-gray-200 border border-gray-600 focus:border-cyan-400 transition-all outline-none ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        } ${touched && !isPasswordValid && !isCurrentPasswordField ? "border-red-500/50" : ""}`}
        onChange={(e) => handleChange(e.target.value)}
        required
        disabled={loading}
      />
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

      {/* Show requirements only on new-password fields */}
      {touched && !isCurrentPasswordField && (
        <div className="grid grid-cols-[repeat(2,max-content)] gap-x-6 gap-y-1 mt-2 px-1">
          {requirements.map((req, idx) => (
            <div
              key={idx}
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
