import React, { useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Webshop24?",
      answer:
        "Webshop24 is an online shopping platform offering a curated selection of quality products across various categories, making your shopping experience seamless and enjoyable.",
    },
    {
      question: "How can I place an order?",
      answer:
        "Simply browse our catalog, add items to your cart, and proceed to checkout. Follow the step-by-step process to complete your order.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept major payment methods such as credit/debit cards, PayPal, and other popular payment gateways.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we provide international shipping to various countries. Shipping fees and delivery times vary based on your location.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is shipped, you will receive a tracking link via email. You can use this link to monitor your shipment in real time.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="bg-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-gray-600 text-center mx-auto" style={{ maxWidth: "60rem" }}>
            Have questions? We've got answers! Below, you'll find the most commonly asked questions about Webshop24. 
            If you don’t find what you’re looking for, feel free to contact us.
          </p>
        </div>
      </div>

      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border w-full max-w-5xl lg:max-w-7xl mx-auto"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleQuestion(index)}
              >
                <h3 className="text-lg sm:text-xl font-semibold">
                  {faq.question}
                </h3>
                {openQuestion === index ? (
                  <ChevronUpIcon className="w-6 h-6 text-blue-600" />
                ) : (
                  <ChevronDownIcon className="w-6 h-6 text-blue-600" />
                )}
              </div>
              {openQuestion === index && (
                <p className="mt-4 text-sm sm:text-base text-gray-600">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div> 

      <Footer />
    </div>
  );
};

export default FAQ;