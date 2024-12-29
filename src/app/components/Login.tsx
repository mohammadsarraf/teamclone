import { FaGoogle,FaGithub, FaApple, FaEnvelope, FaPiedPiperPp } from "react-icons/fa6";

const Login: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-gray-900 p-10 rounded-lg shadow-lg max-w-4xl w-full">
                <div className="text-center mb-6">
                    <p className="text-2xl text-black font-semibold">Log in to TeamGlu4e.com</p>
                    <p className="text-sm text-black mt-2">
                        Just a little reminder that by continuing with any of the options below, 
                        you agree to our{" "}
                        <a href="#" className="text-blue-500 underline">Terms of Service</a> 
                        and have read our{" "}
                        <a href="#" className="text-blue-500 underline">Privacy Policy</a>.
                    </p>
                </div>

                {/* Main Content */}
                <div className="flex items-center gap-6">
                    {/* Email Form */}
                    <div className="flex-1">
                        <div className="p-1 mb-1">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address or Username
                            </label>
                            <input
                                id="email"
                                type="text"
                                className="p-3 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="p-1 mb-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="email"
                                type="text"
                                className="p-3 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your password"
                            />
                        </div>
                        <button className="mt-4 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
                            Continue
                        </button>
                    </div>

                    {/* Vertical Separator with "OR" */}
                    <div className="flex flex-col items-center text-black">
                        <div className="h-full w-px  relative">
                            <span className="absolute  px-2 font-medium -translate-x-1/2 top-1/2 -translate-y-1/2">
                                OR
                            </span>
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="flex-1 space-y-4">
                        <button className="bg-black  w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-900">
                            <FaGoogle className="h-5 mr-2" />
                            Continue with Google
                        </button>
                        <button className="bg-black  w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-900">
                            <FaApple className="h-5 mr-2" />
                            Continue with Google
                        </button>
                        <button className="bg-black  w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-900">
                            <FaGithub className="h-5 mr-2" />
                            Continue with GitHub
                        </button>
                        <button className="bg-black  w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-900">
                            <FaEnvelope className="h-5 mr-2" />
                            Email me a login link
                        </button>
                        <button className="bg-black  w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-900">
                            <FaPiedPiperPp className="h-5 mr-2" />
                            Log in via PiedPiper
                        </button>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="text-center mt-6">
                    <a href="#" className="text-sm text-blue-500 underline">
                        Lost your password?
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
