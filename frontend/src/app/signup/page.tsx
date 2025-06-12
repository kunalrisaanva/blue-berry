"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "sonner";
import axios from "axios";

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = React.useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = React.useState(false);
  // const [step, setStep] = React.useState("otp");
    const [step, setStep] = React.useState<"signup" | "otp">("signup");
  const [otp, setOtp] = React.useState(["", "", "", ""]);
  const [resendCount, setResendCount] = React.useState(0);
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  interface RegisterResponse {
    success: boolean;
    message?: string;
    data: {
      otp: string;
    };
  }

  interface RegisterFormData {
    email: string;
    password: string;
  }

  // Focus on first OTP input when step changes to "otp"
  React.useEffect(() => {
    if (step === "otp") {
      inputsRef.current[0]?.focus();
    }
  }, [step]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post<RegisterResponse>(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}api/v1/users/register`,
        formData
      );

      const receivedOtp = response.data.data.otp;
      setOtp(receivedOtp.split("")); // Convert OTP string to array
      setStep("otp");
    
    } catch (err) {
      toast.error("Registration failed.");
      console.error(err);
    }
  };

  const handlerVerifyOtp = async () => {
    

     const verifyResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}api/v1/users/verify-otp`,
        { email: formData.email, otp:otp.join("") }
      );

      // console.log(verifyResponse);

      if(verifyResponse.status === 200) {
        toast.success("Registration successful!");
        router.push("/login");
      }
      else {
        toast.error("OTP verification failed.");
      }


  }

  const handleOtpChange = (value: string, index: number) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleResend = () => {
    setOtp(["", "", "", ""]);
    setResendCount(resendCount + 1);
    alert("OTP resent to " + formData.email);
  };

  const handleBack = () => {
    if (step === "otp") setStep("signup");
    else router.back();
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <button onClick={handleBack} className="text-gray-500">←</button>
          <img
            src="https://berry.reactbd.com/_next/static/media/logo.8fe5d04c.png"
            alt="Blue Berry"
            className="h-8"
          />
          <div className="w-5" />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-1">Welcome Back</h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Sign in to access your account
        </p>

        {step === "signup" && (
          <form onSubmit={handleSubmit}>
            <button className="w-full flex items-center justify-center gap-2 border px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="h-5 w-5"
                alt="Google"
              />
              Continue with Google
            </button>



            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400">or</span>
              </div>
            </div>

            <label className="block text-sm mb-1">Enter address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md mb-4"
              placeholder="Enter your email address"
              required
            />

            <label className="block text-sm mb-1">Enter password</label>
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md text-sm font-semibold"
            >
              Continue
            </button>
          </form>
        )}




        {step === "otp" && (
          <div className="text-center">
            <p className="text-sm mb-4">Enter 4-digit OTP</p>

            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => { inputsRef.current[index] = el; }}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  className="w-10 h-12 text-center text-lg border rounded-md focus:outline-none"
                />
              ))}
            </div>

            <div className="flex flex-col gap-3 items-center">
              <button
                onClick={handlerVerifyOtp}
                className="bg-black text-white py-2 px-6 rounded-md text-sm w-full max-w-[200px]"
              >
                Verify OTP
              </button>

              <button
                onClick={handleResend}
                className="text-sm text-blue-500 hover:underline"
              >
                Resend OTP {resendCount > 0 && `(${resendCount})`}
              </button>
            </div>
          </div>
        )}


        <p className="text-sm text-gray-500 text-center mt-6">
          Don’t have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
