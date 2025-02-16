import React, { useState, useContext, useEffect } from "react";
import {
	ShoppingCartIcon,
	UserIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import CartContext from "../Context/CartContext";
import ProductContext from "../Context/ProductContext";

const Header = () => {
	const { totalQuantity } = useContext(CartContext);
	const { search, dispatch } = useContext(ProductContext);
	const [showSearch, setShowSearch] = useState(false);
	const [isVisible, setIsVisible] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);
	const navigate = useNavigate()


	const handleScroll = () => {
		const currentScrollY = window.scrollY;

		if (currentScrollY > lastScrollY && currentScrollY > 100) {
			setIsVisible(false);
		} else {
			setIsVisible(true);
		}

		setLastScrollY(currentScrollY);
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [lastScrollY]);

	const handleSearch = (e) => {
		dispatch({
			type: "SEARCH_PRODUCTS",
			payload: e.target.value,
		});
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			navigate("/products");
			setShowSearch(false);
		}
	};

	const handleBlur = () => {
		navigate("/products");
		setShowSearch(false);
	};

	return (
		<header
			className={`bg-white shadow-md top-0 left-0 w-full z-20 transition-transform duration-300 ${
				isVisible ? "translate-y-0" : "-translate-y-full"
			} fixed`}
		>
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
						onChange={handleSearch}
						onKeyDown={handleKeyPress}
						onBlur={handleBlur}
						value={search}
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div className="flex items-center space-x-4">
					<button
						onClick={() => setShowSearch(!showSearch)}
						className={`md:hidden ${
							showSearch ? "text-blue-600" : "text-gray-700"
						}`}
					>
						<MagnifyingGlassIcon className="h-6 w-6" />
					</button>
					<div
						className="relative"
					>
						<button className="flex items-center text-gray-700 hover:text-blue-600">
							<UserIcon className="h-6 w-6" />
						</button>

					</div>

					<div className="relative">
						<a
							href="/cart"
							className="flex items-center text-gray-700 hover:text-blue-600"
						>
							<ShoppingCartIcon className="h-6 w-6" />
						</a>
						{totalQuantity > 0 && (
							<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
								{totalQuantity}
							</span>
						)}
					</div>
				</div>
			</div>

			{showSearch && (
				<div className="px-4 pb-2 flex justify-center md:hidden">
					<div className="relative w-full max-w-md">
						<MagnifyingGlassIcon className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
						<input
							type="text"
							placeholder="Search products..."
							onChange={handleSearch}
							onKeyDown={handleKeyPress}
							onBlur={handleBlur}
							value={search}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;
