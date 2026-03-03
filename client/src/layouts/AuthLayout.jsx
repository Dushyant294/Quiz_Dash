import { Outlet } from "react-router-dom";
function AuthLayout() {
    return (
        <div className="bg-white dark:bg-[#0b1220] text-black dark:text-white min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8 bg-gray-100 dark:bg-[#1b2230] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
                <h1 className="text-3xl font-bold mb-6 text-center text-[#5b5bff]">QuizDash</h1>
                <Outlet />
            </div>
        </div>
    );
}

export default AuthLayout;