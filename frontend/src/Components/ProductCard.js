import React, { useContext, useEffect } from "react";
import CartContext from "../Context/CartContext";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
	const { dispatch, cartItems } = useContext(CartContext);

	const cartItem = cartItems.find(
		(item) => item.product_id === product.product_id
	);
	const quantityInCart = cartItem ? cartItem.quantity : -1;

	const isStockLimitReached = quantityInCart === product.stock;

	const renderStars = () => {
		const totalStars = 5;

		return (
			<div className="flex space-x-1">
				{Array.from({ length: totalStars }, (_, i) => {
					const fillPercentage =
						Math.min(Math.max(product.rating - i, 0), 1) * 100;

					return (
						<div key={i} className="relative">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-5 h-5 text-gray-300"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.462 4.49a1 1 0 00.95.69h4.735c.969 0 1.371 1.24.588 1.81l-3.833 2.774a1 1 0 00-.364 1.118l1.462 4.49c.3.921-.755 1.688-1.539 1.118l-3.833-2.774a1 1 0 00-1.176 0l-3.833 2.774c-.784.57-1.838-.197-1.539-1.118l1.462-4.49a1 1 0 00-.364-1.118L2.07 9.917c-.783-.57-.38-1.81.588-1.81h4.735a1 1 0 00.95-.69l1.462-4.49z" />
							</svg>

							<div
								className="absolute top-0 left-0 overflow-hidden"
								style={{ width: `${fillPercentage}%` }}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="w-5 h-5 text-yellow-500"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.462 4.49a1 1 0 00.95.69h4.735c.969 0 1.371 1.24.588 1.81l-3.833 2.774a1 1 0 00-.364 1.118l1.462 4.49c.3.921-.755 1.688-1.539 1.118l-3.833-2.774a1 1 0 00-1.176 0l-3.833 2.774c-.784.57-1.838-.197-1.539-1.118l1.462-4.49a1 1 0 00-.364-1.118L2.07 9.917c-.783-.57-.38-1.81.588-1.81h4.735a1 1 0 00.95-.69l1.462-4.49z" />
								</svg>
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	const handleAddToCart = (prod) => {
		if (!isStockLimitReached) {
			const data = { ...prod, quantity: 1 };
			dispatch({ type: "ADD_TO_CART", payload: data });
		}
	};

	return (
		<div className="relative bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all max-h-none md:max-h-[480px] transform hover:-translate-y-2 flex flex-col">
			<div className="relative w-full h-48 sm:h-56 overflow-hidden rounded-t-lg">
				<Link to={`/product/${product.product_id}`}>
					<img
						src={product.image}
						alt={product.name}
						id="prod_image"
						className="w-auto object-contain mx-auto transition-transform transform hover:scale-110"
					/>
				</Link>
			</div>

			{/* Mobile View */}
			<div className="block sm:hidden flex flex-col justify-between p-3 space-y-2">
				<div className="flex justify-between items-center">
					<Link to={`/product/${product.product_id}`}>
						<h3 className="text-sm font-medium whitespace-pre-wrap text-gray-800 truncate">
							{product.name}
						</h3>
					</Link>
					<div className="flex items-center space-x-2">
						<p className="text-sm font-bold text-gray-800">€{product.price}</p>
						<p className="text-xs text-gray-500 line-through">
							€
							{(
								parseFloat(product.price) +
								0.1 * parseFloat(product.price)
							).toFixed(2)}
						</p>
					</div>
				</div>

				{product.stock === 0 ? (
					<p className="text-sm text-red-600 text-lg font-medium mt-2">
						Item out of stock!
					</p>
				) : (
					<p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-2 text-left">
						{product.description}
					</p>
				)}

				{isStockLimitReached ? (
					<p className="text-sm text-red-600 text-lg font-medium mt-2">
						No more quantities available!
					</p>
				) : (
					<p className="text-sm text-gray-600 line-clamp-2 text-left">
						{product.description}
					</p>
				)}

				<div className="flex items-center space-x-1 text-xs text-gray-500">
					{renderStars()}
					<span>({parseFloat(product.rating).toFixed(1)})</span>
				</div>

				<button
					onClick={() => handleAddToCart(product)}
					className={`w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1 ${
						product.stock === 0 || isStockLimitReached
							? "bg-gray-400 cursor-not-allowed"
							: "bg-blue-600 text-white hover:bg-blue-700"
					}`}
					disabled={product.stock === 0 || isStockLimitReached}
				>
					<ShoppingCartIcon className="h-4 w-4" />
					Add to Cart
				</button>
			</div>

			{/* Desktop View */}
			<div className="hidden sm:flex flex-col justify-between flex-grow p-2 space-y-2">
				<Link to={`/product/${product.product_id}`}>
					<h3 className="text-lg font-semibold text-gray-800 text-left">
						{product.name}
					</h3>
				</Link>

				{product.stock === 0 ? (
					<p className="text-sm text-red-600 text-lg font-medium mt-2">
						Item out of stock!
					</p>
				) : (
					<p className="text-sm text-gray-600 line-clamp-2 text-left">
						{product.description}
					</p>
				)}

				{isStockLimitReached ? (
					<p className="text-sm text-red-600 text-lg font-medium mt-2">
						No more quantities available!
					</p>
				) : (
					<p className="text-sm text-gray-600 line-clamp-2 text-left">
						{product.description}
					</p>
				)}

				<div className="flex items-center space-x-1">
					{renderStars()}
					<span className="text-xs text-gray-500">
						({parseFloat(product.rating).toFixed(1)})
					</span>
				</div>

				<p className="text-sm text-green-600 font-medium text-left">
					Free Delivery on orders over €50!
				</p>

				<div className="flex justify-between items-center py-2 px-1 border-t border-gray-200">
					<div className="flex items-center space-x-2">
						<p className="text-lg font-bold text-gray-800">€{product.price}</p>
						<p className="text-xs text-gray-500 line-through">
							€
							{(
								parseFloat(product.price) +
								0.1 * parseFloat(product.price)
							).toFixed(2)}
						</p>
					</div>

					<button
						onClick={() => handleAddToCart(product)}
						className={`w-32 py-2 rounded-lg font-semibold transition-colors ${
							product.stock === 0 || isStockLimitReached
								? "bg-gray-400 cursor-not-allowed"
								: "bg-blue-600 text-white hover:bg-blue-700"
						}`}
						disabled={product.stock === 0 || isStockLimitReached}
					>
						Add to Cart
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
