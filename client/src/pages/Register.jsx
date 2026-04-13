import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGoogleAuth from "../hooks/useGoogleAuth";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        username: "",
        password: "",
        role: "student"
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Google auth success handler
    const handleGoogleSuccess = useCallback((data) => {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        navigate("/");
    }, [navigate]);

    // Google auth error handler
    const handleGoogleError = useCallback((errorMsg) => {
        setError(errorMsg);
    }, []);

    const { loading: googleLoading, handleGoogleLogin } = useGoogleAuth({
        onSuccess: handleGoogleSuccess,
        onError: handleGoogleError,
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                // Save token to localStorage (can be managed better with Context later)
                localStorage.setItem("token", data.data.token);
                // Redirect to Dashboard or Login (depends on your flow)
                navigate("/login");
            } else {
                setError(data.error || "Registration failed");
            }
        } catch {
            setError("Cannot connect to server. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-center">Create a new account</h2>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
                    {error}
                </div>
            )}

            {/* Google Sign-Up Button */}
            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#1b2230] border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#252e3f] disabled:opacity-50 text-gray-700 dark:text-gray-200 py-3 rounded-lg font-medium transition-colors mb-4"
            >
                <svg width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                {googleLoading ? "Signing up..." : "Sign up with Google"}
            </button>

            {/* Divider */}
            <div className="flex items-center mb-4">
                <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                <span className="px-4 text-sm text-gray-500 dark:text-gray-400">or</span>
                <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0b1220] focus:outline-none focus:border-[#5b5bff] transition-colors"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0b1220] focus:outline-none focus:border-[#5b5bff] transition-colors"
                        placeholder="example@email.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0b1220] focus:outline-none focus:border-[#5b5bff] transition-colors"
                        placeholder="johndoe123"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength="6"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0b1220] focus:outline-none focus:border-[#5b5bff] transition-colors"
                        placeholder="••••••••"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Select Role</label>
                    <div className="flex gap-4">
                        <label className="flex-1 flex items-center justify-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#252e3f] transition-colors">
                            <input 
                                type="radio" 
                                name="role" 
                                value="student" 
                                checked={formData.role === "student"}
                                onChange={handleChange}
                                className="mr-2 accent-[#5b5bff]" 
                            />
                            Student
                        </label>
                        <label className="flex-1 flex items-center justify-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#252e3f] transition-colors">
                            <input 
                                type="radio" 
                                name="role" 
                                value="instructor"
                                checked={formData.role === "instructor"}
                                onChange={handleChange}
                                className="mr-2 accent-[#5b5bff]" 
                            />
                            Instructor
                        </label>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#5b5bff] hover:bg-[#4f4fe5] disabled:bg-[#5b5bff]/50 text-white py-3 rounded-lg font-semibold transition-colors mt-6"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Already have an account? <Link to="/login" className="text-[#5b5bff] hover:underline font-medium">Log in</Link>
            </div>
        </div>
    );
}

export default Register;
