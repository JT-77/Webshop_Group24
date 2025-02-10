import React, { useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import {
	TruckIcon,
	ShieldCheckIcon,
	StarIcon,
	UsersIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
	const categories = [
		{ name: "Electronics", image: "/images/electronics.jpeg" },
		{ name: "Fashion", image: "/images/fashion.jpeg" },
		{ name: "Home & Kitchen", image: "/images/homekitchen.jpeg" },
		{ name: "Sports", image: "/images/sports.jpeg" },
	];

	const [email, setEmail] = useState("");
	const [subscribed, setSubscribed] = useState(false);

	const handleSubscription = (e) => {
		e.preventDefault();
		if (email) {
			setSubscribed(true);
			setEmail("");
			setTimeout(() => {
				setSubscribed(false);
			}, 2000);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
			<Header />
			<div
				className="relative w-full h-[60vh] sm:h-[70vh] bg-right bg-cover lg:bg-center flex items-center justify-center"
				style={{
					backgroundImage: "url('/images/banner.jpeg')",
				}}
			>
				<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center px-6">
					<motion.div
						className="text-center text-white space-y-4"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<h1 className="text-5xl sm:text-6xl font-extrabold drop-shadow-lg">
							Elevate Your Shopping Experience
						</h1>
						<p className="text-lg sm:text-2xl mt-4 opacity-80">
							Handpicked quality, seamless experience, 24/7 customer support.
						</p>
						<a
							href="/products"
							className="mt-6 inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium shadow-lg hover:bg-blue-700 transition"
						>
							Start Shopping
						</a>
					</motion.div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-6 py-12">
				<h2 className="text-4xl font-extrabold text-center mb-8">
					Explore Our Categories
				</h2>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
					{categories.map((category, index) => (
						<div
							key={index}
							className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 text-center"
						>
							<img
								src={category.image}
								alt={category.name}
								className="w-full h-36 object-cover mb-4 rounded-lg transition-transform hover:scale-105"
							/>
							<h3 className="text-xl font-semibold">{category.name}</h3>
						</div>
					))}
				</div>
			</div>

			<div className="bg-white py-12">
				<div className="max-w-7xl mx-auto px-6">
					<h2 className="text-4xl font-extrabold text-center mb-8">
						Why Shop With Us?
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
						{[
							{
								icon: <TruckIcon className="w-16 h-16 text-blue-600 mx-auto" />,
								title: "Fast Shipping",
								desc: "Lightning-fast deliveries.",
							},
							{
								icon: (
									<ShieldCheckIcon className="w-16 h-16 text-blue-600 mx-auto" />
								),
								title: "Secure Payments",
								desc: "Safe and encrypted transactions.",
							},
							{
								icon: <StarIcon className="w-16 h-16 text-blue-600 mx-auto" />,
								title: "Top Quality",
								desc: "Handpicked, premium products.",
							},
							{
								icon: <UsersIcon className="w-16 h-16 text-blue-600 mx-auto" />,
								title: "24/7 Support",
								desc: "Always here to help you.",
							},
						].map((item, index) => (
							<div
								key={index}
								className="bg-gray-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
							>
								{item.icon}
								<h3 className="text-2xl font-semibold mt-4">{item.title}</h3>
								<p className="text-gray-600 mt-2">{item.desc}</p>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="bg-blue-600 py-8">
				<div className="max-w-5xl mx-auto text-center text-white">
					<h2 className="text-4xl font-extrabold mb-6">Stay Updated!</h2>
					<p className="text-lg mb-6 opacity-80">
						Subscribe for exclusive deals, promotions, and updates delivered to
						your inbox.
					</p>
					<div className="flex justify-center items-center">
						<form
							onSubmit={handleSubscription}
							className="flex w-full max-w-2xl text-black"
						>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email"
								className="border p-4 w-full rounded-l-lg focus:outline-none"
							/>
							<button
								type="submit"
								className="bg-white text-blue-600 px-6 py-4 rounded-r-lg hover:bg-gray-100 transition"
							>
								Subscribe
							</button>
						</form>
					</div>
					<AnimatePresence>
						{subscribed && (
							<motion.p
								className="mt-4 text-green-500 text-lg"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 1, ease: "easeInOut" }}
							>
								Congratulations! You have successfully subscribed to our
								newsletter.
							</motion.p>
						)}
					</AnimatePresence>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Home;
