import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = ({ auth, userCount, brandCount, orderCount, pendingOrderCount, productCount, totalSales, chartData }) => {
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
        document.documentElement.classList.toggle('dark', isDarkMode);

        const handleDarkModeChange = (event) => {
            setIsDarkMode(event.detail);
        };
        window.addEventListener('darkModeChange', handleDarkModeChange);

        return () => {
            window.removeEventListener('darkModeChange', handleDarkModeChange);
        };
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);
    const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);
    const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const chartConfig = {
        labels: chartData.labels, // e.g., ['Jun 2024', 'Jul 2024', ..., 'May 2025']
        datasets: [
            {
                label: 'Revenue (tk)',
                data: chartData.revenues,
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                yAxisID: 'y-revenue',
                barThickness: 10,
                categoryPercentage: 0.35,
                barPercentage: 0.85,
            },
            {
                label: 'Orders',
                data: chartData.orderCounts,
                backgroundColor: 'rgba(255, 159, 64, 0.8)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
                yAxisID: 'y-orders',
                barThickness: 10,
                categoryPercentage: 0.35,
                barPercentage: 0.85,
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
                text: 'Monthly Revenue and Orders (Last 12 Months)',
                color: isDarkMode ? '#ffffff' : '#374151',
                font: { size: 18 },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y;
                        if (context.dataset.yAxisID === 'y-revenue') {
                            return `${label}: ${value.toLocaleString()} tk`;
                        }
                        return `${label}: ${value}`;
                    },
                },
            },
        },
        scales: {
            x: {
                ticks: { color: isDarkMode ? '#ffffff' : '#374151' },
                grid: { color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
            },
            'y-revenue': {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Revenue (tk)',
                    color: isDarkMode ? '#ffffff' : '#374151',
                },
                ticks: {
                    color: isDarkMode ? '#ffffff' : '#374151',
                    callback: function (value) {
                        return value.toLocaleString();
                    },
                },
                grid: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
                suggestedMax: Math.max(...chartData.revenues, 1000) * 1.2,
            },
            'y-orders': {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'Orders',
                    color: isDarkMode ? '#ffffff' : '#374151',
                },
                ticks: {
                    color: isDarkMode ? '#ffffff' : '#374151',
                    stepSize: 1,
                    beginAtZero: true,
                },
                grid: {
                    drawOnChartArea: false,
                },
                min: 0,
                suggestedMax: Math.max(30, Math.max(...chartData.orderCounts) * 2), // Increased to 30 for smaller bars
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.2,
                duration: 0.5,
                ease: "easeOut",
            },
        }),
    };

    const dashboardCards = [
        { title: "Total Sales", value: `${totalSales} tk`, gradient: "from-blue-400 to-indigo-500", darkGradient: "from-blue-600 to-purple-600" },
        { title: "Completed Orders", value: orderCount, gradient: "from-blue-400 to-indigo-500", darkGradient: "from-blue-600 to-purple-600" },
        { title: "Products", value: productCount, gradient: "from-blue-400 to-indigo-500", darkGradient: "from-blue-600 to-purple-600" },
        { title: "Customers", value: userCount, gradient: "from-blue-400 to-indigo-500", darkGradient: "from-blue-600 to-purple-600" },
        { title: "Brands", value: brandCount, gradient: "from-blue-400 to-indigo-500", darkGradient: "from-blue-600 to-purple-600" },
        { title: "Pending Orders", value: pendingOrderCount, gradient: "from-blue-400 to-indigo-500", darkGradient: "from-blue-600 to-purple-600" },
    ];

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
                            {dashboardCards.map((card, index) => (
                                <motion.div
                                    key={index}
                                    custom={index}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className={`p-4 sm:p-6 ${
                                        isDarkMode
                                            ? `bg-gradient-to-br ${card.darkGradient}`
                                            : `bg-gradient-to-br ${card.gradient}`
                                    } rounded-xl sm:rounded-2xl shadow-lg text-white hover:shadow-xl transition-shadow duration-300`}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <h3 className="text-base sm:text-lg font-semibold">{card.title}</h3>
                                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2">
                                        {card.value}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                        <div className="bg-opacity-50 rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6">
                            <Bar data={chartConfig} options={chartOptions} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
