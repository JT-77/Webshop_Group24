import React, { useState } from "react";
import {
	ShoppingCartIcon,
	UserIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

const Header = () => {
	const [cartItems, setCartItems] = useState(3);
	const [showProfileMenu, setShowProfileMenu] = useState(false);

	return (
		<header className="bg-white shadow-md top-0 left-0 w-full z-20">
			<div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
				<h1 className="text-2xl font-bold text-blue-600">
					<a href="/">Webshop24</a>
				</h1>

				<nav className="hidden md:flex space-x-6">
					<a href="/" className="text-gray-700 hover:text-blue-600 font-medium">
						Home
					</a>
					<a
						href="/products"
						className="text-gray-700 hover:text-blue-600 font-medium"
					>
						Products
					</a>
					<a
						href="/categories"
						className="text-gray-700 hover:text-blue-600 font-medium"
					>
						Categories
					</a>
					<a
						href="/about"
						className="text-gray-700 hover:text-blue-600 font-medium"
					>
						About Us
					</a>
				</nav>

				<div className="relative hidden md:flex items-center w-1/3">
					<MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-gray-400" />
					<input
						type="text"
						placeholder="Search products..."
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div className="flex items-center space-x-6">
					<div
						className="relative"
						onMouseEnter={() => setShowProfileMenu(true)}
						onMouseLeave={() => setShowProfileMenu(false)}
					>
						<button className="flex items-center text-gray-700 hover:text-blue-600">
							<UserIcon className="h-6 w-6" />
						</button>

						{showProfileMenu && (
							<div className="absolute right-0 mt-2 w-32 bg-white text-gray-800 rounded shadow-md">
								<button
									className="block w-full text-left px-4 py-2 hover:bg-gray-100"
									onClick={() => alert("Logged Out")}
								>
									Logout
								</button>
							</div>
						)}
					</div>

					<div className="relative">
						<button className="flex items-center text-gray-700 hover:text-blue-600">
							<ShoppingCartIcon className="h-6 w-6" />
						</button>
						{cartItems > 0 && (
							<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
								{cartItems}
							</span>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
