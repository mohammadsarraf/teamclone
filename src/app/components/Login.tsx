"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import {
  FaGoogle,
  FaGithub,
  FaApple,
  FaEnvelope,
  FaPiedPiperPp,
} from "react-icons/fa6";
import { useRouter } from "next/navigation";
import {
  handleGoogleLogin,
  handleGithubLogin,
  signInUser,
  signOutUser,
} from "../services/authService";

interface LoginProps {
  user: any;
}

const Login: React.FC<LoginProps> = ({ user }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    const result = await signInUser(username, password);
    if (result.success) {
      setError("");
    } else {
      // @ts-ignore
      setError(result.error);
    }
  };

  const handleLogout = async () => {
    const result = await signOutUser();
    if (result.success) {
      // User logged out successfully
    } else {
      // @ts-ignore
      setError(result.error);
    }
  };

  const handleGoogleLoginClick = async () => {
    await handleGoogleLogin();
  };

  const handleGithubLoginClick = async () => {
    await handleGithubLogin();
  };

  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: "linear-gradient(to bottom, #1a1a1a, #000)" }}
    >
      {error && (
        <p className="mx-auto max-w-md rounded-md bg-red-700 p-2 text-center text-red-500">
          {error}
        </p>
      )}
      <div className="w-full max-w-4xl rounded-lg bg-[#1e1e1e] p-10 shadow-lg">
        <div className="mb-6 text-center">
          <p className="text-2xl font-semibold text-gray-200">
            Log in to FrozenMango.com
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Just a little reminder that by continuing with any of the options
            below, you agree to our{" "}
            <a href="#" className="text-[#5b9aff] underline">
              Terms of Service
            </a>
            and have read our{" "}
            <a href="#" className="text-[#5b9aff] underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>

        <div className="flex items-center gap-6">
          {/* Email Form */}
          <div className="flex-1">
            <div className="mb-1 p-1">
              <label
                htmlFor="email"
                className="mb-2 block text-left text-sm font-medium text-gray-400"
              >
                Email Address or Username
              </label>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                className="w-full rounded-lg border border-gray-600 bg-[#2a2a2a] p-3 text-gray-200 focus:border-[#5b9aff] focus:ring-[#5b9aff]"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-1 p-1">
              <label
                htmlFor="password"
                className="mb-2 block text-left text-sm font-medium text-gray-400"
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full rounded-lg border border-gray-600 bg-[#2a2a2a] p-3 text-gray-200 focus:border-[#5b9aff] focus:ring-[#5b9aff]"
                placeholder="Enter your password"
              />
            </div>
            <button
              onClick={handleLogin}
              className="mt-4 w-full rounded-lg bg-[#1d4ed8] py-3 text-white hover:bg-[#2563eb]"
            >
              Continue
            </button>
          </div>

          {/* Vertical Separator with "OR" */}
          <div className="flex flex-col items-center px-2 text-gray-400">
            <div className="relative h-full w-px bg-gray-600">
              <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] px-2 font-medium text-gray-400">
                OR
              </span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="flex-1 space-y-4">
            <button
              onClick={handleGoogleLoginClick}
              className="flex w-full items-center gap-4 rounded-lg border border-gray-600 bg-[#2a2a2a] px-6 py-3 hover:bg-blue-600"
            >
              <FaGoogle className="size-6 text-red-500" />
              <span className="flex-1 text-base font-medium leading-none text-gray-200">
                Continue with Google
              </span>
            </button>
            <button
              onClick={handleGithubLoginClick}
              className="flex w-full items-center gap-4 rounded-lg border border-gray-600 bg-[#2a2a2a] px-6 py-3 hover:bg-gray-700"
            >
              <FaGithub className="size-6 text-gray-200" />
              <span className="flex-1 text-base font-medium leading-none text-gray-200">
                Continue with GitHub
              </span>
            </button>
            <button className="flex w-full cursor-not-allowed items-center gap-4 rounded-lg border border-gray-600 bg-[#2a2a2a] px-6 py-3 hover:bg-black">
              <FaApple className="size-6 text-gray-300" />
              <span className="flex-1 text-base font-medium leading-none text-gray-200">
                Continue with Apple
              </span>
            </button>
            <button className="flex w-full cursor-not-allowed items-center gap-4 rounded-lg border border-gray-600 bg-[#2a2a2a] px-6 py-3 hover:bg-yellow-700">
              <FaEnvelope className="size-6 text-yellow-500" />
              <span className="flex-1 text-base font-medium leading-none text-gray-200">
                Email me a login link
              </span>
            </button>
            <button className="flex w-full cursor-not-allowed items-center gap-4 rounded-lg border border-gray-600 bg-[#2a2a2a] px-6 py-3 hover:bg-green-800">
              <FaPiedPiperPp className="size-6 text-green-400" />
              <span className="flex-1 text-base font-medium leading-none text-gray-200">
                Log in via PiedPiper
              </span>
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <a href="" className="text-sm text-[#5b9aff] underline">
            Lost your password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
