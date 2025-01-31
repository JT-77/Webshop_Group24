import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      

      <div className="bg-white py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-6">Privacy Policy</h1>
          <p className="text-sm sm:text-base text-gray-600 text-center">
            Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.
          </p>
        </div>
      </div>


      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white p-6 sm:p-10 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="text-gray-700 mb-6">
          We collect personal information when you use our services. This includes your contact information such as name, email address, phone number, and postal address, as well as account credentials and preferences. We also collect payment and billing information necessary for transactions, device information, IP addresses, usage data showing how you interact with our services, and records of communications with our support team.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside text-gray-700 mb-6">
            <p>We use your information for the following purposes:</p>
            <li>Processing your orders and completing transactions.</li>
            <li>Providing customer support and responding to inquiries.</li>
            <li>Improving and personalizing our services based on user feedback.</li>
            <li>Sending important service updates and notifications.</li>
            <li>Marketing communications (with your consent).</li>
            <li>Detecting and preventing fraudulent activities.</li>
            <li>Analyzing usage patterns to enhance user experience.</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-semibold mb-4">3. Data Protection & Security</h2>
          <p className="text-gray-700 mb-6">
          Your privacy is our priority, and we maintain robust security measures throughout our operations. We implement industry-standard encryption for data transmission and conduct regular security assessments and updates. Our system includes restricted access controls for employee data handling, secure data backup systems, and comprehensive incident response protocols. We regularly train employees on data protection practices and conduct security audits to maintain the highest standards of data protection.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold mb-4">4. Cookies & Tracking Technologies</h2>
          <p className="text-gray-700 mb-6">
          Our website uses various types of cookies to enhance your browsing experience. These include essential cookies for basic functionality, analytics cookies to understand user behavior, performance cookies to optimize site performance, advertising cookies for relevant content, and social media cookies for content sharing features. You maintain full control over these cookie settings through your browser preferences.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold mb-4">5. Third-Party Services</h2>
          <p className="text-gray-700 mb-6">
          We carefully manage relationships with third-party providers through a comprehensive vetting process. Information sharing occurs only under strict data processing agreements that require comparable security standards from our partners. We regularly review third-party compliance and maintain detailed records of all data sharing activities to ensure transparency and accountability.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold mb-4">6. Your Rights & Choices</h2>
          <p className="text-gray-700 mb-6">
          We respect your rights regarding your personal data. You can access your personal information, correct any inaccuracies, request deletion, opt-out of marketing communications, and export your data in a portable format. You may withdraw consent for optional processing at any time and lodge complaints with supervisory authorities if needed. We commit to responding to all requests within 30 days.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold mb-4">7. Changes to This Policy</h2>
          <p className="text-gray-700">
          When we update this policy, we announce significant changes via email and post them on our website with revision dates. Changes are accompanied by in-app notifications when applicable and may require renewed consent. We maintain an archive of previous versions for historical reference. Unless otherwise stated, policy updates become effective 30 days after posting.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
