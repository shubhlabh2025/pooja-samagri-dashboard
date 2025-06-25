import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.jpg";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { sendOtp, verifyOtp } from "@/slices/authSlice";

const LoginForm: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { isAuthenticated, status, error } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/orders", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpSent) {
      if (!/^\d{10}$/.test(phone)) {
        setPhoneError("Phone number must be 10 digits");
        return;
      }
      setPhoneError("");

      const result = await dispatch(sendOtp("+91" + phone));
      if (sendOtp.fulfilled.match(result)) {
        setOtpSent(true);
      }
    } else {
      const result = await dispatch(
        verifyOtp({ phoneNumber: "+91" + phone, otpCode: otp }),
      );
      if (verifyOtp.fulfilled.match(result)) {
        navigate("/orders", { replace: true });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm"
      >
        <div className="flex justify-center mb-4">
          <img src={Logo} alt="Pooja Samagri Logo" className="h-8" />
        </div>

        <h2 className="text-center text-xl font-semibold text-blue-600 mb-4">
          Hi, Welcome Admin
        </h2>

        {!otpSent ? (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="flex items-center mb-4">
              <span className="px-2 py-2 border border-r-0 rounded-l-md bg-gray-100 text-sm text-gray-700">
                +91
              </span>
              <input
                type="tel"
                value={phone}
                maxLength={10}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="w-full px-3 py-2 border border-l-0 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="9876543210"
                required
              />
            </div>
            {phoneError && (
              <p className="text-sm text-red-500 mb-4">{phoneError}</p>
            )}
          </>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP
            </label>
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(val) => setOtp(val)}
              containerClassName="mb-4"
            >
              <InputOTPGroup className="flex gap-5">
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="h-11 grow border-b border-gray-500 text-center text-xl shadow-none focus:border-blue-500 focus:ring-0"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </>
        )}

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          disabled={status === "loading"}
        >
          {status === "loading"
            ? "Please wait..."
            : otpSent
              ? "Verify OTP"
              : "Send OTP"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
