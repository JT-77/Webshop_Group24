import React, { useState, useEffect } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const Loader = () => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((prevProgress) => {
				if (prevProgress >= 100) {
					clearInterval(interval);
					return 100;
				}
				return prevProgress + 5;
			});
		}, 150);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex flex-col justify-center items-center h-screen w-full p-8 bg-gray-50">
			<div className="relative mb-6">
				<ShoppingCartIcon className="w-16 h-16 text-indigo-600" />

				<motion.div
					className="absolute w-3 h-3 bg-indigo-400 rounded-full left-4 top-2"
					animate={{ y: [0, -10, 0] }}
					transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
				/>
				<motion.div
					className="absolute w-3 h-3 bg-indigo-500 rounded-full left-7 top-3"
					animate={{ y: [0, -12, 0] }}
					transition={{
						repeat: Infinity,
						duration: 0.9,
						ease: "easeInOut",
						delay: 0.2,
					}}
				/>
				<motion.div
					className="absolute w-3 h-3 bg-indigo-600 rounded-full right-4 top-3"
					animate={{ y: [0, -14, 0] }}
					transition={{
						repeat: Infinity,
						duration: 1,
						ease: "easeInOut",
						delay: 0.4,
					}}
				/>
			</div>

			<div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden shadow-md">
				<motion.div
					className="h-full bg-indigo-600"
					initial={{ width: "0%" }}
					animate={{ width: `${progress}%` }}
					transition={{ duration: 0.3, ease: "easeOut" }}
				/>
			</div>

			<motion.div
				className="mt-4 text-indigo-800 font-semibold text-lg"
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, ease: "easeInOut" }}
			>
				{progress < 100 ? "Loading your products..." : "Ready to shop!"}
			</motion.div>
		</div>
	);
};

export default Loader;
