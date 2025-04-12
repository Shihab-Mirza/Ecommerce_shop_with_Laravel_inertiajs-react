import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { Inertia } from '@inertiajs/inertia';

const AddImageSlideshow = ({ auth, images: initialImages, errors: initialErrors, flash }) => {
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [isHomepageOpen, setIsHomepageOpen] = useState(true); // Homepage menu starts open
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [images, setImages] = useState(initialImages || []);
    const [editingImageId, setEditingImageId] = useState(null);
    const [editingImageFile, setEditingImageFile] = useState(null);
    const [validationErrors, setValidationErrors] = useState(initialErrors || {});
    const [successMessage, setSuccessMessage] = useState(flash || null);
    const [activeLink, setActiveLink] = useState('add_image_slideshow');

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

    const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
    const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);
    const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!imageFile) {
            setValidationErrors({ image: 'Please select an image.' });
            return;
        }

        const formData = new FormData();
        formData.append('image', imageFile);

        Inertia.post('/homepages', formData, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                setImageFile(null);
                setValidationErrors({});
                setSuccessMessage(page.props.flash || 'Image added successfully!');
                setImages(page.props.images);
                setIsHomepageOpen(true);
                setActiveLink('add_image_slideshow');
            },
            onError: (errors) => {
                setValidationErrors(errors);
                setSuccessMessage(null);
            },
        });
    };

    const handleUpdate = (image) => {
        if (editingImageId === image.id) {
            if (!editingImageFile) {
                setValidationErrors({ image: 'Please select a new image.' });
                return;
            }

            const formData = new FormData();
            formData.append('image', editingImageFile);
            formData.append('_method', 'PUT');

            Inertia.post(`/homepages/${image.id}`, formData, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    setEditingImageId(null);
                    setEditingImageFile(null);
                    setValidationErrors({});
                    setSuccessMessage('Image updated successfully!');
                    setImages(page.props.images);
                    setIsHomepageOpen(true);
                    setActiveLink('add_image_slideshow');
                },
                onError: (errors) => {
                    setValidationErrors(errors);
                    setSuccessMessage(null);
                },
            });
        } else {
            setEditingImageId(image.id);
            setEditingImageFile(null);
        }
    };

    const handleDelete = (imageId) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            Inertia.delete(`/homepages/${imageId}`, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    setValidationErrors({});
                    setSuccessMessage('Image deleted successfully!');
                    setImages(page.props.images);
                    setEditingImageId(null);
                    setEditingImageFile(null);
                    setIsHomepageOpen(true);
                    setActiveLink('add_image_slideshow');
                },
                onError: (errors) => {
                    setValidationErrors(errors);
                    setSuccessMessage(null);
                },
            });
        }
    };

    useEffect(() => {
        setImages(initialImages || []);
    }, [initialImages]);

    const dismissSuccessMessage = () => {
        setSuccessMessage(null);
    };

    const isDeleteMessage = successMessage && successMessage.toLowerCase().includes('deleted');

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
                    isHomepageOpen={isHomepageOpen}
                    setIsHomepageOpen={setIsHomepageOpen}
                    activeLink={activeLink}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                <main
                    className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 w-full ${
                        isSidebarMinimized ? 'md:ml-16' : 'md:ml-72'
                    }`}
                >
                    <div
                        className={`rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${
                            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                        }`}
                    >
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Add Image Slideshow</h2>

                        {successMessage && (
                            <div
                                className={`mb-4 p-3 rounded-lg flex justify-between items-center ${
                                    isDeleteMessage
                                        ? 'bg-red-100 text-red-800 border-red-300'
                                        : 'bg-green-100 text-green-800 border-green-300'
                                }`}
                            >
                                <span>{successMessage}</span>
                                <button
                                    onClick={dismissSuccessMessage}
                                    className={`${
                                        isDeleteMessage ? 'text-red-800 hover:text-red-900' : 'text-green-800 hover:text-green-900'
                                    } font-semibold focus:outline-none`}
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {Object.keys(validationErrors).length > 0 && (
                            <div className="mb-4 text-red-600">
                                {Object.values(validationErrors).map((error, index) => (
                                    <p key={index}>{error}</p>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="mb-8">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                    className={`flex-1 p-2 rounded-lg ${
                                        isDarkMode
                                            ? 'bg-gray-700 text-white border-gray-600'
                                            : 'bg-gray-100 text-gray-800 border-gray-300'
                                    } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                <button
                                    type="submit"
                                    className={`px-4 py-2 rounded-lg ${
                                        isDarkMode
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                                            : 'bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600'
                                    } text-white font-semibold transition-all duration-300`}
                                    disabled={images.length >= 6}
                                >
                                    Add Image
                                </button>
                            </div>
                            {images.length >= 6 && (
                                <p className="mt-2 text-red-600">Maximum 6 images reached.</p>
                            )}
                        </form>

                        <div>
                            <h3 className="text-lg sm:text-xl font-semibold mb-4">Existing Images</h3>
                            {images.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {images.map((image) => (
                                        <div
                                            key={image.id}
                                            className={`p-3 rounded-lg ${
                                                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                                            }`}
                                        >
                                            <img
                                                src={`/storage/${image.image_path}`}
                                                alt="Slideshow"
                                                className="w-full h-40 object-cover rounded-lg mb-2"
                                            />
                                            {editingImageId === image.id ? (
                                                <div className="mb-2">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setEditingImageFile(e.target.files[0])}
                                                        className={`w-full p-2 rounded-lg ${
                                                            isDarkMode
                                                                ? 'bg-gray-600 text-white border-gray-500'
                                                                : 'bg-white text-gray-800 border-gray-300'
                                                        } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                    />
                                                </div>
                                            ) : null}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdate(image)}
                                                    className={`flex-1 px-3 py-1 rounded-lg ${
                                                        isDarkMode
                                                            ? 'bg-green-600 hover:bg-green-700'
                                                            : 'bg-green-500 hover:bg-green-600'
                                                    } text-white transition-all duration-300`}
                                                >
                                                    {editingImageId === image.id ? 'Save' : 'Edit'}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(image.id)}
                                                    className={`flex-1 px-3 py-1 rounded-lg ${
                                                        isDarkMode
                                                            ? 'bg-red-600 hover:bg-red-700'
                                                            : 'bg-red-500 hover:bg-red-600'
                                                    } text-white transition-all duration-300`}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No images found.</p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AddImageSlideshow;
