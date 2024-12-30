'use client';
import React, { useEffect, useState } from 'react';
import { FaGoogle, FaGithub, FaApple, FaEnvelope, FaPiedPiperPp } from "react-icons/fa6";
import { signInUser, signOutUser } from './UserContext';
import { useRouter } from 'next/navigation';

const Login = ({ user }: any) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleUsernameChange = (e: any) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: any) => {
        setPassword(e.target.value);
    };

    const handleLogin = async () => {
        const result = await signInUser(username, password);
        if (result.success) {
            setError('');
        } else {
            setError(result.error);
        }
    };

    const handleLogout = async () => {
        const result = await signOutUser();
        if (result.success) {
            // User logged out successfully
        } else {
            setError(result.error);
        }
    };

    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/home');
        }
    }, [user]);

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom, #1a1a1a, #000)' }}>
            {error && <p className="text-red-500 bg-red-700 p-2 rounded-md text-center max-w-md mx-auto">{error}</p>}
            <div className="bg-[#1e1e1e] p-10 rounded-lg shadow-lg max-w-4xl w-full">
                <div className="text-center mb-6">
                    <p className="text-2xl text-gray-200 font-semibold">Log in to TeamGlu4e.com</p>
                    <p className="text-sm text-gray-400 mt-2">
                        Just a little reminder that by continuing with any of the options below, 
                        you agree to our{" "}
                        <a href="#" className="text-[#5b9aff] underline">Terms of Service</a> 
                        and have read our{" "}
                        <a href="#" className="text-[#5b9aff] underline">Privacy Policy</a>.
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    {/* Email Form */}
                    <div className="flex-1">
                        <div className="p-1 mb-1">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2 text-left">
                                Email Address or Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={handleUsernameChange}
                                className="p-3 w-full border border-gray-600 bg-[#2a2a2a] rounded-lg focus:ring-[#5b9aff] focus:border-[#5b9aff] text-gray-200"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="p-1 mb-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2 text-left">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                className="p-3 w-full border border-gray-600 bg-[#2a2a2a] rounded-lg focus:ring-[#5b9aff] focus:border-[#5b9aff] text-gray-200"
                                placeholder="Enter your password"
                            />
                        </div>
                        <button 
                            onClick={handleLogin}
                            className="mt-4 w-full bg-[#1d4ed8] text-white py-3 rounded-lg hover:bg-[#2563eb]"
                        >
                            Continue
                        </button>
                    </div>

                    {/* Vertical Separator with "OR" */}
                    <div className="flex flex-col items-center text-gray-400 px-2">
                        <div className="h-full w-px relative bg-gray-600">
                            <span className="absolute px-2 bg-[#1e1e1e] font-medium -translate-x-1/2 top-1/2 -translate-y-1/2 text-gray-400">
                                OR
                            </span>
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="flex-1 space-y-4">
                        <button className="w-full flex items-center gap-4 py-3 px-6 border border-gray-600 bg-[#2a2a2a] rounded-lg hover:bg-[#3b3b3b]">
                            <FaGoogle className="h-6 w-6 text-red-500" />
                            <span className="flex-1 text-gray-200 text-base font-medium leading-none">Continue with Google</span>
                        </button>
                        <button className="w-full flex items-center gap-4 py-3 px-6 border border-gray-600 bg-[#2a2a2a] rounded-lg hover:bg-[#3b3b3b]">
                            <FaApple className="h-6 w-6 text-gray-300" />
                            <span className="flex-1 text-gray-200 text-base font-medium leading-none">Continue with Apple</span>
                        </button>
                        <button className="w-full flex items-center gap-4 py-3 px-6 border border-gray-600 bg-[#2a2a2a] rounded-lg hover:bg-[#3b3b3b]">
                            <FaGithub className="h-6 w-6 text-gray-200" />
                            <span className="flex-1 text-gray-200 text-base font-medium leading-none">Continue with GitHub</span>
                        </button>
                        <button className="w-full flex items-center gap-4 py-3 px-6 border border-gray-600 bg-[#2a2a2a] rounded-lg hover:bg-[#3b3b3b]">
                            <FaEnvelope className="h-6 w-6 text-yellow-500" />
                            <span className="flex-1 ext-gray-200 text-base font-medium leading-none">Email me a login link</span>
                        </button>
                        <button className="w-full flex items-center gap-4 py-3 px-6 border border-gray-600 bg-[#2a2a2a] rounded-lg hover:bg-[#3b3b3b]">
                            <FaPiedPiperPp className="h-6 w-6 text-green-400" />
                            <span className="flex-1 text-gray-200 text-base font-medium leading-none">Log in via PiedPiper</span>
                        </button>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="text-center mt-6">
                    <a href="#" className="text-sm text-[#5b9aff] underline">
                        Lost your password?
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
