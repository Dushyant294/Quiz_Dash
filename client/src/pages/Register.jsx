import { Link } from "react-router-dom";

function Register() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Create a new account
      </h2>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0b1220] focus:outline-none focus:border-[#5b5bff] transition-colors"
            placeholder="John Doe"
          />
        </div>

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
            Username
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0b1220] focus:outline-none focus:border-[#5b5bff] transition-colors"
            placeholder="johndoe123"
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

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Select Role
          </label>
          <div className="flex gap-4">
            <label className="flex-1 flex items-center justify-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#252e3f] transition-colors">
              <input
                type="radio"
                name="role"
                value="student"
                className="mr-2 accent-[#5b5bff]"
                defaultChecked
              />
              Student
            </label>
            <label className="flex-1 flex items-center justify-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#252e3f] transition-colors">
              <input
                type="radio"
                name="role"
                value="instructor"
                className="mr-2 accent-[#5b5bff]"
              />
              Instructor
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#5b5bff] hover:bg-[#4f4fe5] text-white py-3 rounded-lg font-semibold transition-colors mt-6"
        >
          Register
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-[#5b5bff] hover:underline font-medium"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}

export default Register;
