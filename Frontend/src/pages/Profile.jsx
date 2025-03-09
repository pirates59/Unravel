import React from 'react';
import upload from '../assets/upload.png';

function Profile() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
      {/* Outer container for the card */}
      <div className="max-w-lg h-[500px] w-full bg-white p-8 rounded-md shadow-md">
        {/* Title */}
        <h2 className="text-xl font-semibold mb-4">Change profile photo</h2>

        {/* Dotted circle with cloud icon */}
        <div className="border-2 border-dashed border-gray-300 rounded-full w-[250px] h-[250px] mx-auto mb-4 flex items-center justify-center">
          <img
            src={upload}
            alt="Logo"
            // "object-contain" ensures the entire image is visible without cropping
            // Adjust w-48 / h-48 as desired for size
            className="object-contain w-[400px] h-[400px]"
          />
        </div>

        {/* Drag-and-drop instructions */}
        <p className="text-center text-gray-500 mb-4">
          Drag and drop your images here or{' '}
          <span className="text-blue-600 hover:underline cursor-pointer">
            Upload a photo
          </span>
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Upload
          </button>
          <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
