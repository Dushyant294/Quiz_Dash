import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { SearchProvider } from "../context/SearchContext";

function MainLayout() {
    return (
        <SearchProvider>
            <div className="bg-white dark:bg-brand-dark text-black dark:text-white min-h-screen">
                <Sidebar />

                {/* Right side */}
                <div className="ml-64 pt-20">
                    <Topbar />

                    {/* Scrollable content */}
                    <main className="px-12 py-8 h-[calc(100vh-80px)] overflow-y-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </SearchProvider>
    );
}

export default MainLayout;