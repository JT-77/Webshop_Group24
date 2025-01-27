import React, { useEffect } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
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

	return (
		<div className="relative bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 flex flex-col">
			<div className="relative w-full h-48 sm:h-56 overflow-hidden rounded-t-lg">
				<Link to={`/product/${product.id}`}>
					<img
						src={product.image}
						alt={product.name}
						className="w-full h-full object-cover transition-transform transform hover:scale-110"
					/>
				</Link>
			</div>

			{/* Mobile View */}
			<div className="block sm:hidden flex flex-col justify-between p-3 space-y-2">
				<div className="flex justify-between items-center">
					<Link to={`/product/${product.id}`}>
						<h3 className="text-sm font-medium text-gray-800 truncate">
							{product.name}
						</h3>
					</Link>
					<div className="flex items-center space-x-2">
						<p className="text-sm font-bold text-gray-800">€{product.price}</p>
						<p className="text-xs text-gray-500 line-through">€{product.mrp}</p>
					</div>
				</div>

				<p className="text-sm text-gray-600 line-clamp-2 text-left">
					{product.description}
				</p>

				<div className="flex items-center space-x-1 text-xs text-gray-500">
					{renderStars()}
					<span>({product.rating.toFixed(1)})</span>
				</div>

				<button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1">
					<ShoppingCartIcon className="h-4 w-4" />
					<span>Add to Cart</span>
				</button>
			</div>

			{/* Desktop View */}
			<div className="hidden sm:flex flex-col justify-between flex-grow p-2 space-y-2">
				<Link to={`/product/${product.id}`}>
					<h3 className="text-lg font-semibold text-gray-800 text-left">
						{product.name}
					</h3>
				</Link>

				<p className="text-sm text-gray-600 line-clamp-2 text-left">
					{product.description}
				</p>

				<div className="flex items-center space-x-1">
					{renderStars()}
					<span className="text-xs text-gray-500">
						({product.rating.toFixed(1)})
					</span>
				</div>

				<p className="text-sm text-green-600 font-medium text-left">
					Free Delivery on orders over €50!
				</p>

				<div className="flex justify-between items-center py-2 px-1 border-t border-gray-200">
					<div className="flex items-center space-x-2">
						<p className="text-xl font-bold text-gray-800">€{product.price}</p>
						<p className="text-sm text-gray-500 line-through">€{product.mrp}</p>
					</div>
					<button className="w-24 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
						Add to Cart
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
