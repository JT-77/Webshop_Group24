import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
	return (
		<div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-50 to-gray-200 px-6">
			<div className="text-center max-w-md">
				<div className="flex justify-center items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="w-16 h-16 text-blue-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 3l9.518 16.5H2.482L12 3z"
						/>
						<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4" />
						<path strokeLinecap="round" strokeLinejoin="round" d="M12 17h.01" />
					</svg>
				</div>
				<h1 className="text-6xl font-extrabold text-gray-800 mt-4">404</h1>
				<p className="text-xl text-gray-600 mt-2">
					Uh-oh! We can't seem to find the page you're looking for.
				</p>
				<p className="text-md text-gray-500 mt-1">
					The link might be broken or the page has been removed.
				</p>
				<Link
					to="/"
					className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md text-lg font-medium hover:bg-blue-700"
				>
					Back to Home
				</Link>
			</div>
		</div>
	);
};

export default NotFoundPage;
