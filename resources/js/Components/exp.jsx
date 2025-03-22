import { Head, Link } from '@inertiajs/react';
import "../../css/style.scss";
import React from 'react';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard, faMouse, faHeadphones, faDesktop, faCamera, faVolumeUp, faMicrochip, faPrint, faGamepad, faNetworkWired, faLaptop, faMobileAlt, faHeadphonesAlt } from '@fortawesome/free-solid-svg-icons';

const accessories = [
    { name: "Keyboards", icon: faKeyboard },
    { name: "Mice", icon: faMouse },
    { name: "Headsets", icon: faHeadphones },
    { name: "Monitors", icon: faDesktop },
    { name: "Webcams", icon: faCamera },
    { name: "Speakers", icon: faVolumeUp },
    { name: "Processors", icon: faMicrochip },
    { name: "Printers", icon: faPrint },
    { name: "Game Controllers", icon: faGamepad },
    { name: "Networking", icon: faNetworkWired },
    { name: "Laptops", icon: faLaptop },
    { name: "Earbuds", icon: faHeadphonesAlt },
    { name: "Mobile Phones", icon: faMobileAlt }
];

export default function Welcome({ auth }) {
    return (
        <>
            <NavBar auth={auth} />
            <main className="p-8 bg-gradient-to-r from-indigo-900 via-purple-700 to-pink-600 min-h-screen text-white">
                <h1 className="text-4xl font-extrabold text-center mb-10 text-shadow-lg">Explore Our Cutting-Edge Accessories</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {accessories.map((item, index) => (
                        <div key={index} className="bg-white bg-opacity-20 shadow-lg rounded-xl overflow-hidden p-6 text-center transform transition-transform duration-500 ease-out hover:scale-110 hover:shadow-2xl">
                            <div className="flex justify-center mb-4">
                                <FontAwesomeIcon icon={item.icon} className="text-5xl text-white opacity-80 transition-opacity duration-300 hover:opacity-100" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">{item.name}</h2>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    );
}
