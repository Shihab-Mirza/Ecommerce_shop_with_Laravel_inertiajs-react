import { Head, Link } from '@inertiajs/react';
import "../../css/style.scss";
import React from 'react';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard, faMouse, faHeadphones, faDesktop, faCamera, faVolumeUp, faMicrochip, faPrint, faGamepad, faNetworkWired, faLaptop, faMobileAlt, faHeadphonesAlt } from '@fortawesome/free-solid-svg-icons';

const accessories = [
    { name: "Keyboards", icon: faKeyboard },
    { name: "Mouse", icon: faMouse },
    { name: "Headsets", icon: faHeadphones },
    { name: "Monitors", icon: faDesktop },
    { name: "Webcams", icon: faCamera },
    { name: "Speakers", icon: faVolumeUp },
    { name: "Processors", icon: faMicrochip },
    { name: "Printers", icon: faPrint },
    { name: "Networking", icon: faNetworkWired },
    { name: "Laptops", icon: faLaptop },
    { name: "Earbuds", icon: faHeadphonesAlt },
    { name: "Mobile Phones", icon: faMobileAlt }
];

export default function Welcome({ auth }) {
    return (
        <>
            <NavBar auth={auth} />

            <main className="p-8" >
                <h1 className="text-3xl font-bold text-center mb-6">Computer Accessories</h1>
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {accessories.map((item, index) => (
                        <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl p-4 text-center">
                            <FontAwesomeIcon icon={item.icon} className="text-4xl mb-2 text-gray-700" />
                            <h2 className="text-xl font-semibold">{item.name}</h2>
                        </div>
                    ))}
                </div>
            </main>


            <Footer />
        </>
    );
}
