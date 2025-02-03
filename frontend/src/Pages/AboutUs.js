import React from 'react';
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { BuildingOffice2Icon, UsersIcon, PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
    <Header />
      {/* Hero Section */}
      <div className="bg-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-6">About Our Store</h1>
          <p className="text-sm sm:text-base text-gray-600 text-center mx-auto px-4 sm:px-6" style={{ maxWidth: '150rem' }}>
          Welcome to Webshop24, your one-stop destination for a seamless online shopping experience! At Webshop24, we are passionate about bringing you a curated selection of quality products across various categories. Our goal is to make shopping easy, convenient, and enjoyable, whether you're browsing on a desktop, tablet, or mobile.  
          With a focus on innovation and user-centric design, we offer a responsive platform, robust product search, and an intuitive checkout process. From discovering great products to quick and hassle-free purchases, Webshop24 is here to meet your shopping needs 24/7.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
            <BuildingOffice2Icon className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Our Story</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Founded in 2020, we've grown from a small startup to a trusted online retailer serving customers globally.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
            <MapPinIcon className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Our Mission</h3>
            <p className="text-sm sm:text-base text-gray-600">
              To provide high-quality products at competitive prices while ensuring customer satisfaction.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
            <UsersIcon className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Our Team</h3>
            <p className="text-sm sm:text-base text-gray-600">
              A dedicated group of professionals committed to delivering excellence in every aspect of our service.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {[
              { title: 'Quality', description: 'We are committed to providing products that meet the highest standards, ensuring you get nothing but the best.' },
              { title: 'Innovation', description: 'We constantly strive to improve our platform and services, embracing new ideas to make your shopping experience better and more efficient.' },
              { title: 'Integrity', description: 'Honesty and transparency are at the heart of everything we do, fostering trust and long-lasting relationships with our customers.' },
              { title: 'Customer First', description: 'Your satisfaction is our top priority. We listen to your needs and work tirelessly to exceed your expectations at every step.' }
            ].map((value, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Get in Touch</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 text-center">
          <div className="flex flex-col items-center">
            <PhoneIcon className="w-8 h-8 text-blue-600 mb-4" />
            <p className="text-sm sm:text-base text-gray-600">+49 167 35620567</p>
          </div>
          <div className="flex flex-col items-center">
            <EnvelopeIcon className="w-8 h-8 text-blue-600 mb-4" />
            <p className="text-sm sm:text-base text-gray-600">contact@webshop24.com</p>
          </div>
          <div className="flex flex-col items-center">
            <MapPinIcon className="w-8 h-8 text-blue-600 mb-4" />
            <p className="text-sm sm:text-base text-gray-600">123 Low Tech GMBH, Konstablerwache, Frankfurt am Main, Germany</p>
          </div>
        </div>
      </div>
    <Footer />
    </div>
  );
};

export default AboutUs;
