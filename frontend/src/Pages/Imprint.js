import React from 'react';
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const Imprint = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      

      <div className="bg-white py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-6">
            Imprint (Impressum)
          </h1>
          <p className="text-sm sm:text-base text-gray-600 text-center">
            Legal information regarding our company and website.
          </p>
        </div>
      </div>

 
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6 sm:p-10 my-8 sm:my-12">
        <h2 className="text-2xl font-bold mb-4">Company Information</h2>
        <p className="text-gray-600 mb-2"><strong>Company Name:</strong> Webshop24</p>
        <p className="text-gray-600 mb-2"><strong>Legal Form:</strong> GmbH (Limited Liability Company)</p>
        <p className="text-gray-600 mb-2"><strong>Managing Director:</strong> John Doe</p>
        <p className="text-gray-600 mb-2"><strong>Commercial Register:</strong> HRB 123456, Frankfurt am Main</p>
        <p className="text-gray-600 mb-2"><strong>VAT ID:</strong> DE123456789</p>

   
        <h2 className="text-2xl font-bold mt-6 mb-4">Contact Information</h2>
        <p className="text-gray-600 mb-2"><strong>Phone:</strong> +49 167 35620567</p>
        <p className="text-gray-600 mb-2"><strong>Email:</strong> contact@webshop24.com</p>
        <p className="text-gray-600"><strong>Address:</strong> 123 Low Tech GMBH, Konstablerwache, Frankfurt am Main, Germany</p>

      
        <h2 className="text-2xl font-bold mt-6 mb-4">Legal Disclaimer</h2>
        <p className="text-gray-600">
          The information provided on this website is for general informational purposes only. While we strive for accuracy, we do not assume responsibility for any errors or omissions in the content.
        </p>
        <p className="text-gray-600 mt-2">
          Webshop24 is not responsible for the content of external links. The responsibility for linked pages lies solely with their operators.
        </p>

    
        <h2 className="text-2xl font-bold mt-6 mb-4">Copyright</h2>
        <p className="text-gray-600">
          All content on this website, including text, images, and graphics, is subject to copyright and may not be used or reproduced without prior written permission.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default Imprint;
