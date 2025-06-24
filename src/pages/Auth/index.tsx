import React, { useState } from "react";

import Logo from "../../assets/logo.jpg";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic

    navigate("/orders", { replace: true });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm"
      >
        <div className="flex justify-center mb-4">
          <img src={Logo} alt="Pooja Samagri Logo" className="h-8" />
        </div>

        <h2 className="text-center text-xl font-semibold text-purple-700 mb-4">
          Hi, Welcome Admin
        </h2>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="number"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="9876543210"
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500"
            aria-label="Toggle password visibility"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <div className="flex items-center justify-end mb-6">
          <a
            href="#"
            className="text-sm text-purple-600 font-medium hover:underline"
          >
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
