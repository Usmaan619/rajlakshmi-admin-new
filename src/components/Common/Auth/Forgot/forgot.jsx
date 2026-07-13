import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import logo from "../../../Assets/Images/Logo/rajlaxmi.svg";
import { postData } from "../../APIs/api";
import { toastError, toastSuccess } from "../../../../Services/toast.service";
import { useNavigate } from "react-router-dom";

const Forgot = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm();

  const [step, setStep] = useState(0); // 0 = email, 1 = OTP, 2 = reset password
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const endpoint = "/forgetPassword";

  const extractOtp = (data) =>
    Number([1, 2, 3, 4, 5, 6].map((i) => data[`code${i}`] || "").join(""));

  const validatePasswords = (newPassword, confirmPassword) => {
    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match.");
    }
  };

  const handleStep0 = async (data) => {
    const response = await postData(endpoint, { email: data?.email });
    if (response?.data?.success) {
      toastSuccess(response.data.message);
      setStep(1);
    } else {
      throw new Error(response?.data?.message || "Failed to send email.");
    }
  };

  const handleStep1 = async (data) => {
    const otp = extractOtp(data);
    if (String(otp).length !== 6) {
      throw new Error("Please enter all 6 digits of the OTP.");
    }
    const response = await postData("/verifyOtp", { otp });
    if (response?.data?.success) {
      toastSuccess(response.data.message);
      setStep(2);
    } else {
      throw new Error(response?.data?.message || "OTP verification failed.");
    }
  };

  const handleStep2 = async (data) => {
    const otp = extractOtp(data);
    validatePasswords(data?.newPassword, data?.confirmPassword);

    const response = await postData("/reset", {
      otp,
      newPassword: data?.newPassword,
    });

    if (response?.data?.success) {
      toastSuccess(response.data.message?.message || response.data.message);
      navigate("/");
    } else {
      throw new Error(response?.data?.message || "Password reset failed.");
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (step === 0) await handleStep0(data);
      else if (step === 1) await handleStep1(data);
      else await handleStep2(data);
    } catch (error) {
      toastError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input changes: only digits, auto focus next
  const handleInput = (e, index) => {
    const val = e.target.value;

    if (/^\d$/.test(val)) {
      setValue(`code${index + 1}`, val, {
        shouldValidate: true,
        shouldDirty: true,
      });
      clearErrors(`code${index + 1}`);
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (val === "") {
      setValue(`code${index + 1}`, "");
    } else {
      // ignore invalid input
      e.target.value = "";
    }
  };

  // Handle backspace to focus previous input
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="login-box text-center p-4">
        {/* Logo + Heading */}
        <div className="mb-4">
          <img src={logo} alt="Logo" className="logo mb-3" />
          <h2 className="title font-20 inter-font-family-600 text-white">
            {step === 2 ? "Reset Password" : "Forgot Your Password?"}
          </h2>
          <p className="subtitle font-14 inter-font-family-300 text-white">
            {step === 2
              ? "Enter your new password"
              : "Enter your email to get a reset link."}
          </p>
        </div>

        <form
          className="login-form d-flex flex-column text-start"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Step 0: Email */}
          {step === 0 && (
            <div className="login-input mb-3">
              <label className="font-14 mb-1 form-label text-white inter-font-family-400">
                Enter your email address
              </label>
              <input
                type="email"
                className="form-control py-2 border-0"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <div className="text-danger">{errors.email.message}</div>
              )}
            </div>
          )}

          {/* Step 1: Verification Code (OTP) */}
          {step === 1 && (
            <div className="login-input mb-4">
              <label className="font-14 mb-2 form-label text-white inter-font-family-400">
                Verification Code
              </label>
              <div className="d-flex justify-content-between">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    type="tel"
                    maxLength={1}
                    className="form-control text-center mx-1 border-0 fs-4"
                    style={{ width: "60px", height: "60px" }}
                    {...register(`code${i + 1}`, { required: "Required" })}
                    ref={(el) => (inputRefs.current[i] = el)}
                    onChange={(e) => handleInput(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                  />
                ))}
              </div>

              {/* Show single error message if any input has error */}
              {[...Array(6)].some((_, i) => errors[`code${i + 1}`]) && (
                <div className="text-danger font-12 mt-2 text-center">
                  All 6 digits are required
                </div>
              )}
            </div>
          )}

          {/* Step 2: New Password & Confirm Password */}
          {step === 2 && (
            <>
              <div className="login-input mb-3">
                <label className="font-14 mb-1 form-label text-white inter-font-family-400">
                  New Password
                </label>
                <input
                  type="password"
                  className="form-control py-2 border-0"
                  {...register("newPassword", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    pattern: {
                      // one uppercase, one special char, min 6 chars total
                      value: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{6,}$/,
                      message:
                        "Must include 1 capital letter and 1 special character",
                    },
                  })}
                />
                {errors.newPassword && (
                  <div className="text-danger">
                    {errors.newPassword.message}
                  </div>
                )}
              </div>

              <div className="login-input mb-3">
                <label className="font-14 mb-1 form-label text-white inter-font-family-400">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="form-control py-2 border-0"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === watch("newPassword") ||
                      "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <div className="text-danger">
                    {errors.confirmPassword.message}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`login-btn rounded-pill border-0 font-16 inter-font-family-500 py-2 mt-5 text-white bg-red-color ${loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
          >
            {loading
              ? step === 2
                ? "Resetting..."
                : "Submitting..."
              : step === 2
                ? "Reset Password"
                : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Forgot;
