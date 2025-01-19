import React from 'react';

function About() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-8 text-center">About Us</h2>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="flex justify-center my-8">
          <img src="/images/logo.png" alt="AE Decor Logo" className="h-500 w-600 w-auto" />
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
          <p className="text-gray-700 mb-4">
            At AE Decor, our mission is to inspire and empower individuals to create beautiful and memorable tablescapes. We believe that every meal is an opportunity to create a unique and inviting atmosphere that brings people together.
          </p>
          <h3 className="text-2xl font-bold mb-4">Our Story</h3>
          <p className="text-gray-700 mb-4">
            Founded in 2023, AE Decor has quickly become a trusted source for tablescaping inspiration and resources. Our team of experts is passionate about helping you create stunning tablescapes that reflect your personal style and make every occasion special.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;