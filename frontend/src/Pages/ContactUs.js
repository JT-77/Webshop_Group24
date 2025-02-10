import React, { useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import {
	MapPinIcon,
	PhoneIcon,
	EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const ContactUs = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [successMessage, setSuccessMessage] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Form Data:", formData);
		setSuccessMessage(
			"Message sent successfully! We will get back to you within 24 hours."
		);
		setFormData({ name: "", email: "", message: "" });

		setTimeout(() => {
			setSuccessMessage("");
		}, 5000);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />

			<div className="bg-white py-8 sm:py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-6">
						Contact Us
					</h1>
					<p
						className="text-sm sm:text-base text-gray-600 text-center mx-auto px-4 sm:px-6"
						style={{ maxWidth: "150rem" }}
					>
						Have questions? We're here to help! Reach out to us via the contact
						form or use the details below.
					</p>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div className="bg-white p-6 rounded-lg shadow-sm">
						<h3 className="text-xl sm:text-2xl font-semibold mb-4">
							Get in Touch
						</h3>
						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<label
									htmlFor="name"
									className="block text-sm font-semibold text-gray-700"
								>
									Name
								</label>
								<input
									type="text"
									id="name"
									name="name"
									value={formData.name}
									onChange={handleChange}
									required
									className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
								/>
							</div>

							<div className="mb-4">
								<label
									htmlFor="email"
									className="block text-sm font-semibold text-gray-700"
								>
									Email
								</label>
								<input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									required
									className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
								/>
							</div>

							<div className="mb-4">
								<label
									htmlFor="message"
									className="block text-sm font-semibold text-gray-700"
								>
									Message
								</label>
								<textarea
									id="message"
									name="message"
									value={formData.message}
									onChange={handleChange}
									required
									rows="4"
									className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
								></textarea>
							</div>

							<button
								type="submit"
								className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
							>
								Send Message
							</button>
						</form>
					</div>

					<div className="bg-white p-6 rounded-lg shadow-sm">
						<h3 className="text-xl sm:text-2xl font-semibold mb-4">
							Our Contact Details
						</h3>
						<div className="flex items-center mb-6">
							<PhoneIcon className="w-8 h-8 text-blue-600 mr-4" />
							<a href="tel:+4915510055405" className="text-gray-600">
								+49 155 10055405
							</a>
						</div>
						<div className="flex items-center mb-6">
							<EnvelopeIcon className="w-8 h-8 text-blue-600 mr-4" />
							<a href="mailto:contact@webshop24.com" className="text-gray-600">
								contact@webshop24.com
							</a>
						</div>
						<div className="flex items-center mb-6">
							<MapPinIcon className="w-8 h-8 text-blue-600 mr-4" />
							<a
								href="https://maps.app.goo.gl/pW28vH8VRsrPEceo8"
								target="_blank"
								className="text-gray-600"
							>
								123 Low Tech GMBH, Konstablerwache, Frankfurt am Main, Germany
							</a>
						</div>
					</div>
				</div>
				<AnimatePresence>
					{successMessage && (
						<motion.p
							className="mt-4 text-green-500 text-lg"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 1, ease: "easeInOut" }}
						>
							{successMessage}
						</motion.p>
					)}
				</AnimatePresence>
			</div>
			<Footer />
		</div>
	);
};

export default ContactUs;
