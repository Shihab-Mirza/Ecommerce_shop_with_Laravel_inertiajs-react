import React, { useState, useEffect, useRef } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { Inertia } from '@inertiajs/inertia';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDesktop, faLaptop, faMicrochip, faMemory, faHdd, faSdCard,
    faServer, faKeyboard, faMouse, faHeadphones, faPrint, faPlug,
    faFan, faGamepad, faCamera, faTv, faChevronDown, faNetworkWired,
    faEthernet, faBatteryFull, faWifi, faMicrophone, faVolumeHigh, faMobile,
    faEdit
} from '@fortawesome/free-solid-svg-icons';
import {
    MdMonitor, MdDeveloperBoard, MdRouter, MdStorage, MdSpeaker,
    MdCable, MdBatteryChargingFull, MdCloud, MdSecurity, MdSmartphone, MdTablet,
    MdHeadsetMic, MdPower, MdVideogameAsset, MdNetworkCheck
} from 'react-icons/md';
import { FiCpu, FiHardDrive, FiMonitor } from 'react-icons/fi';
import { CircuitBoard, Usb, Webcam, Headphones as LucideHeadphones } from 'lucide-react';

const ManageCategoryIcon = ({ auth, categories: initialCategories, errors: initialErrors, flash }) => {
    const [isProductsOpen, setIsProductsOpen] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [categories, setCategories] = useState(initialCategories || []);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [selectedCategoryIcon, setSelectedCategoryIcon] = useState("");
    const [showCategoryIcon, setShowCategoryIcon] = useState("no");
    const [validationErrors, setValidationErrors] = useState(initialErrors || {});
    const [successMessage, setSuccessMessage] = useState(flash || null);
    const [activeLink, setActiveLink] = useState('manage_category_icons');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Icon options with actual names saved in the database and display names for UI
    const iconOptions = [
        { name: 'fa-desktop', displayName: 'Desktop', icon: faDesktop, type: 'fontawesome' },
        { name: 'fa-laptop', displayName: 'Laptop', icon: faLaptop, type: 'fontawesome' },
        { name: 'fa-microchip', displayName: 'Microchip', icon: faMicrochip, type: 'fontawesome' },
        { name: 'fa-memory', displayName: 'RAM', icon: faMemory, type: 'fontawesome' },
        { name: 'fa-hdd', displayName: 'Hard Drive', icon: faHdd, type: 'fontawesome' },
        { name: 'fa-sd-card', displayName: 'SD Card', icon: faSdCard, type: 'fontawesome' },
        { name: 'fa-server', displayName: 'Server', icon: faServer, type: 'fontawesome' },
        { name: 'fa-keyboard', displayName: 'Keyboard', icon: faKeyboard, type: 'fontawesome' },
        { name: 'fa-mouse', displayName: 'Mouse', icon: faMouse, type: 'fontawesome' },
        { name: 'fa-headphones', displayName: 'Headphones', icon: faHeadphones, type: 'fontawesome' },
        { name: 'fa-print', displayName: 'Printer', icon: faPrint, type: 'fontawesome' },
        { name: 'fa-plug', displayName: 'Plug', icon: faPlug, type: 'fontawesome' },
        { name: 'fa-fan', displayName: 'Fan', icon: faFan, type: 'fontawesome' },
        { name: 'fa-gamepad', displayName: 'Gamepad', icon: faGamepad, type: 'fontawesome' },
        { name: 'fa-camera', displayName: 'Camera', icon: faCamera, type: 'fontawesome' },
        { name: 'fa-tv', displayName: 'TV', icon: faTv, type: 'fontawesome' },
        { name: 'fa-network-wired', displayName: 'Network Wired', icon: faNetworkWired, type: 'fontawesome' },
        { name: 'fa-ethernet', displayName: 'Ethernet', icon: faEthernet, type: 'fontawesome' },
        { name: 'fa-battery-full', displayName: 'Battery', icon: faBatteryFull, type: 'fontawesome' },
        { name: 'fa-wifi', displayName: 'Wireless Devices', icon: faWifi, type: 'fontawesome' },
        { name: 'fa-microphone', displayName: 'Microphone', icon: faMicrophone, type: 'fontawesome' },
        { name: 'fa-volume-high', displayName: 'Speaker', icon: faVolumeHigh, type: 'fontawesome' },
        { name: 'fa-mobile', displayName: 'Mobile', icon: faMobile, type: 'fontawesome' },
        { name: 'md-monitor', displayName: 'Monitor', icon: MdMonitor, type: 'react-icons' },
        { name: 'md-developer-board', displayName: 'Motherboard', icon: MdDeveloperBoard, type: 'react-icons' },
        { name: 'md-router', displayName: 'Router', icon: MdRouter, type: 'react-icons' },
        { name: 'md-storage', displayName: 'Storage', icon: MdStorage, type: 'react-icons' },
        { name: 'md-speaker', displayName: 'Speaker', icon: MdSpeaker, type: 'react-icons' },
        { name: 'md-cable', displayName: 'Cable', icon: MdCable, type: 'react-icons' },
        { name: 'md-battery-charging-full', displayName: 'Battery Charging', icon: MdBatteryChargingFull, type: 'react-icons' },
        { name: 'md-cloud', displayName: 'Cloud', icon: MdCloud, type: 'react-icons' },
        { name: 'md-security', displayName: 'Security', icon: MdSecurity, type: 'react-icons' },
        { name: 'md-smartphone', displayName: 'Smartphone', icon: MdSmartphone, type: 'react-icons' },
        { name: 'md-tablet', displayName: 'Tablet', icon: MdTablet, type: 'react-icons' },
        { name: 'md-headset-mic', displayName: 'Headset Mic', icon: MdHeadsetMic, type: 'react-icons' },
        { name: 'md-power', displayName: 'Power', icon: MdPower, type: 'react-icons' },
        { name: 'md-videogame-asset', displayName: 'Videogame Asset', icon: MdVideogameAsset, type: 'react-icons' },
        { name: 'md-network-check', displayName: 'Network Check', icon: MdNetworkCheck, type: 'react-icons' },
        { name: 'fi-cpu', displayName: 'CPU', icon: FiCpu, type: 'react-icons' },
        { name: 'fi-hard-drive', displayName: 'Hard Drive', icon: FiHardDrive, type: 'react-icons' },
        { name: 'fi-monitor', displayName: 'Monitor', icon: FiMonitor, type: 'react-icons' },
        { name: 'lucide-circuit-board', displayName: 'Circuit Board', icon: CircuitBoard, type: 'lucide' },
        { name: 'lucide-usb', displayName: 'USB', icon: Usb, type: 'lucide' },
        { name: 'lucide-webcam', displayName: 'Webcam/CCTV', icon: Webcam, type: 'lucide' },
        { name: 'lucide-headphones', displayName: 'Headphones', icon: LucideHeadphones, type: 'lucide' },
    ];

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

    useEffect(() => {
        setCategories(initialCategories || []);
    }, [initialCategories]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);
    const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);
    const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

    const handleCategoryUpdate = (category) => {
        if (editingCategoryId === category.id) {
            if (showCategoryIcon === 'yes' && !selectedCategoryIcon) {
                setValidationErrors({ icon: ['Icon is required when show_category_icon is set to Yes'] });
                return;
            }

            Inertia.put(`/categoriesIcon/${category.id}`, {
                icon: showCategoryIcon === 'yes' ? selectedCategoryIcon : null,
                show_category_icon: showCategoryIcon,
            }, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setEditingCategoryId(null);
                    setSelectedCategoryIcon("");
                    setShowCategoryIcon("no");
                    setValidationErrors({});
                    setSuccessMessage('Category icon updated successfully!');
                    setCategories(categories.map(cat =>
                        cat.id === category.id ? { ...cat, icon: showCategoryIcon === 'yes' ? selectedCategoryIcon : null, show_category_icon: showCategoryIcon } : cat
                    ));
                    setIsProductsOpen(true);
                    setActiveLink('manage_category_icons');
                },
                onError: (errors) => {
                    console.error('Category update errors:', errors);
                    setValidationErrors(errors);
                    setSuccessMessage(null);
                },
            });
        } else {
            setEditingCategoryId(category.id);
            setSelectedCategoryIcon(category.icon || "");
            setShowCategoryIcon(category.show_category_icon || "no");
        }
    };

    const handleSelectIcon = (iconName) => {
        setSelectedCategoryIcon(iconName);
        setIsDropdownOpen(false);
    };

    const dismissSuccessMessage = () => {
        setSuccessMessage(null);
    };

    const getIconByName = (name) => {
        const found = iconOptions.find(opt => opt.name === name);
        return found ? { icon: found.icon, type: found.type, displayName: found.displayName } : null;
    };

    const renderIcon = (iconData) => {
        if (!iconData) return null;
        if (iconData.type === 'fontawesome') {
            return <FontAwesomeIcon icon={iconData.icon} className="ml-2" />;
        } else if (iconData.type === 'lucide') {
            return <span className="ml-2">{React.createElement(iconData.icon, { size: 20 })}</span>;
        } else {
            return <span className="ml-2">{React.createElement(iconData.icon, { size: 20 })}</span>;
        }
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
                    activeLink={activeLink}
                />

                <main
                    className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 w-full ${isSidebarMinimized ? 'md:ml-16' : 'md:ml-72'}`}
                >
                    <div className={`rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Manage Computer Hardware Category Icons</h2>

                        {successMessage && (
                            <div
                                className={`mb-4 p-3 rounded-lg flex justify-between items-center bg-green-100 text-green-800 border-green-300`}
                            >
                                <span>{successMessage}</span>
                                <button
                                    onClick={dismissSuccessMessage}
                                    className="text-green-800 hover:text-green-900 font-semibold focus:outline-none"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {Object.keys(validationErrors).length > 0 && (
                            <div className="mb-4 text-red-600">
                                {Object.entries(validationErrors).map(([field, messages], index) => (
                                    <p key={index}>{field}: {Array.isArray(messages) ? messages.join(', ') : messages}</p>
                                ))}
                            </div>
                        )}

                        <div>
                            <h3 className="text-lg sm:text-xl font-semibold mb-4">Existing Categories</h3>
                            {categories.length > 0 ? (
                                <ul className="space-y-3">
                                    {categories.map((category, index) => (
                                        <li key={category.id} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-between`}>
                                            <div className="flex-1 flex items-center gap-4">
                                                <span className="font-semibold">{index + 1}.</span>
                                                {editingCategoryId === category.id ? (
                                                    <div className="flex gap-4 items-center flex-1">
                                                        <span>{category.name}</span>
                                                        <select
                                                            value={showCategoryIcon}
                                                            onChange={(e) => setShowCategoryIcon(e.target.value)}
                                                            className={`w-16 p-2 rounded-lg ml-2 ${isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                        >
                                                            <option value="no">No</option>
                                                            <option value="yes">Yes</option>
                                                        </select>
                                                        {showCategoryIcon === 'yes' && (
                                                            <div className="relative" ref={dropdownRef}>
                                                                <button
                                                                    type="button"
                                                                    onClick={toggleDropdown}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                                            toggleDropdown();
                                                                            e.preventDefault();
                                                                        }
                                                                    }}
                                                                    className={`p-2 pl-3 pr-10 rounded-lg w-full text-left flex items-center justify-between ${isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500 relative`}
                                                                    role="combobox"
                                                                    aria-expanded={isDropdownOpen}
                                                                    aria-label="Select icon"
                                                                >
                                                                    <span className="flex items-center">
                                                                        {selectedCategoryIcon ? (
                                                                            <>
                                                                                {renderIcon(getIconByName(selectedCategoryIcon))}
                                                                                {getIconByName(selectedCategoryIcon)?.displayName || 'Select Icon'}
                                                                            </>
                                                                        ) : (
                                                                            'Choose an icon'
                                                                        )}
                                                                    </span>
                                                                    <FontAwesomeIcon icon={faChevronDown} className="absolute right-3" />
                                                                </button>
                                                                {isDropdownOpen && (
                                                                    <div className={`absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}>
                                                                        {iconOptions.map((opt, idx) => (
                                                                            <div
                                                                                key={idx}
                                                                                onClick={() => handleSelectIcon(opt.name)}
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                                                        handleSelectIcon(opt.name);
                                                                                        e.preventDefault();
                                                                                    }
                                                                                }}
                                                                                className={`p-2 cursor-pointer hover:bg-blue-100 flex items-center ${isDarkMode ? 'hover:bg-gray-600' : ''}`}
                                                                                role="option"
                                                                                tabIndex={0}
                                                                            >
                                                                                {renderIcon({ icon: opt.icon, type: opt.type })}
                                                                                {opt.displayName}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="flex items-center">
                                                        {category.name}
                                                        {category.show_category_icon === 'yes' && category.icon && renderIcon(getIconByName(category.icon))}
                                                        <span className="ml-2 text-sm text-black">
                                                            (Show Category on Homepage: {category.show_category_icon})
                                                        </span>
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleCategoryUpdate(category)}
                                                    className={`p-2 rounded-lg ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white transition-all duration-300 flex items-center justify-center`}
                                                    title={editingCategoryId === category.id ? 'Save' : 'Edit Icon'}
                                                >
                                                    {editingCategoryId === category.id ? (
                                                        'Save'
                                                    ) : (
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    )}
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No categories found.</p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ManageCategoryIcon;
