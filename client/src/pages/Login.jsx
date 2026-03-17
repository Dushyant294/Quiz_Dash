import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                // Save token to localStorage
                localStorage.setItem("token", data.data.token);
                // Save user info (optional, helps with UI)
                localStorage.setItem("user", JSON.stringify(data.data.user));
                
                // Redirect user based on role or just to home page
                if (data.data.user.role === 'admin') {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            } else {
                setError(data.error || "Login failed");
            }
        } catch (err) {
            setError("Cannot connect to server. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-center">Login to your account</h2>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
                    {error}
                </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
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
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0b1220] focus:outline-none focus:border-[#5b5bff] transition-colors"
                        placeholder="••••••••"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#5b5bff] hover:bg-[#4f4fe5] disabled:bg-[#5b5bff]/50 text-white py-3 rounded-lg font-semibold transition-colors mt-6"
                >
                    {loading ? "Logging in..." : "Log In"}
                </button>

                <button type="button" className="w-full bg-transparent border border-[#5b5bff] text-[#5b5bff] hover:bg-[#5b5bff]/10 py-3 rounded-lg font-semibold transition-colors mt-4">
                    Admin Login
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Don't have an account? <Link to="/register" className="text-[#5b5bff] hover:underline font-medium">Register</Link>
            </div>
        </div>
    );
}

export default Login;
