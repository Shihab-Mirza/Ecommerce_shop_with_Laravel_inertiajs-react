import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = ({ auth }) => {
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
    const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);
    const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Revenue ($)',
                data: [5000, 7000, 8000, 6000, 9000, 10000, 11000, 9500, 8500, 7500, 6500, 12000],
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: 'Orders',
                data: [50, 70, 80, 60, 90, 100, 110, 95, 85, 75, 65, 120],
                backgroundColor: 'rgba(255, 159, 64, 0.8)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: isDarkMode ? '#ffffff' : '#374151' },
            },
            title: {
                display: true,
                text: 'Monthly Revenue and Orders',
                color: isDarkMode ? '#ffffff' : '#374151',
                font: { size: 18 },
            },
        },
        scales: {
            x: {
                ticks: { color: isDarkMode ? '#ffffff' : '#374151' },
                grid: { color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
            },
            y: {
                ticks: { color: isDarkMode ? '#ffffff' : '#374151' },
                grid: { color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
            },
        },
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
            <AdminNavbar
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                toggleMobileSidebar={toggleMobileSidebar}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isProfileOpen={isProfileOpen}
                setIsProfileOpen={setIsProfileOpen}
                auth={auth}
            />

            <div className="flex">
                <AdminSidebar
                    isDarkMode={isDarkMode}
                    isSidebarMinimized={isSidebarMinimized}
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                    toggleMobileSidebar={toggleMobileSidebar}
                    isProductsOpen={isProductsOpen}
                    setIsProductsOpen={setIsProductsOpen}
                />

                <main
                    className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 w-full ${
                        isSidebarMinimized ? 'md:ml-16' : 'md:ml-72'
                    }`}
                >
                    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 transition-colors duration-300`}>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Dashboard Overview</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
                            {["Total Sales", "Orders", "Products"].map((title, index) => (
                                <div
                                    key={index}
                                    className={`p-4 sm:p-6 ${isDarkMode ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-gradient-to-br from-blue-400 to-indigo-500'} rounded-xl sm:rounded-2xl shadow-lg text-white`}
                                >
                                    <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
                                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2">
                                        {title === "Total Sales" ? "$12,345" : title === "Orders" ? "87" : "245"}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-opacity-50 rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6">
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
