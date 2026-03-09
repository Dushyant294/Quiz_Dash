import { Link } from "react-router-dom";

function Login() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Login to your account
      </h2>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0b1220] focus:outline-none focus:border-[#5b5bff] transition-colors"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0b1220] focus:outline-none focus:border-[#5b5bff] transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#5b5bff] hover:bg-[#4f4fe5] text-white py-3 rounded-lg font-semibold transition-colors mt-6"
        >
          Log In
        </button>

        <button
          type="button"
          className="w-full bg-transparent border border-[#5b5bff] text-[#5b5bff] hover:bg-[#5b5bff]/10 py-3 rounded-lg font-semibold transition-colors mt-4"
        >
          Admin Login
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-[#5b5bff] hover:underline font-medium"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

export default Login;
