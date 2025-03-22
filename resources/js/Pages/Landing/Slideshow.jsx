import { useState, useEffect } from "react";

const Slideshow = () => {
  // Array of images to be displayed in the slideshow
  const images = [
    "/images/Capture1.PNG", // Ensure these paths are correct and images are in the public folder
    "/images/Capture2.PNG",
    "/images/Capture3.PNG"
  ];

  // State to track the current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Effect hook to change the image every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Cycle through the images by updating the index
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change every 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div className="md:w-2/3 pl-4 lg:mt-28 md:mt-28 sd:mt-2 lg:mr-7 ">
      <div className="bg-white shadow-md rounded-xl border border-gray-100 h-48 md:h-96 flex items-center justify-center">
        {/* Dynamically change the image based on currentImageIndex */}
        <img
          src={images[currentImageIndex]}
          alt="Slideshow Image"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
    </div>
  );
};

export default Slideshow;
