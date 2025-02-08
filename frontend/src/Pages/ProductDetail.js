import React, { useEffect, useContext } from "react";
import { FaShippingFast, FaUndoAlt } from "react-icons/fa";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import ImageSection from "../Components/ProductImages";
import { ShoppingCartIcon, BoltIcon } from "@heroicons/react/24/solid";
import { useParams } from "react-router-dom";
import ProductContext from "../Context/ProductContext";
import CartContext from "../Context/CartContext";

const ProductDetailPage = () => {
	const { productDetails, fetchProductById } = useContext(ProductContext);
	const { dispatch } = useContext(CartContext);
	const { id } = useParams();

	useEffect(() => {
		fetchProductById(id);
	}, [id]);

	const renderStars = (rating) => {
		const totalStars = 5;

		return (
			<div className="flex space-x-1">
				{Array.from({ length: totalStars }, (_, i) => {
					const fillPercentage = Math.min(Math.max(rating - i, 0.5), 1) * 100;

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

	if (!productDetails) return <p>Loading product...</p>;

	return (
		<>
			<Header />
			<div className="container bg-gray-50 mt-2 mx-0 lg:mx-auto px-4 py-6">
				<div className="grid md:grid-cols-2 gap-8">
					<ImageSection images={productDetails.image_path} />

					<div>
						<h1 className="text-2xl font-semibold text-gray-800 mb-2">
							{productDetails.name}
						</h1>
						<div className="flex items-center mb-4">
							<span className="text-yellow-400 text-lg">
								{renderStars(productDetails.rating)}
							</span>
							<span className="text-gray-600 ml-2">4.5 (320 reviews)</span>
						</div>

						<div className="mb-6">
							<div className="flex items-center space-x-4">
								<span className="text-2xl font-bold text-gray-800">
									€
									{(
										parseFloat(productDetails.price) -
										0.1 * parseFloat(productDetails.price)
									).toFixed(2)}
								</span>
								<span className="text-gray-500 line-through">
									€{productDetails.price}
								</span>
							</div>
							<p className="text-red-600 text-lg font-medium mt-2">
								Only 4 left in stock!
							</p>
						</div>

						<div className="flex items-center space-x-4 mb-8">
							<button
								onClick={() =>
									dispatch({
										type: "ADD_TO_CART",
										payload: { ...productDetails, quantity: 1 },
									})
								}
								className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
							>
								<ShoppingCartIcon className="size-4 mr-1" />
								Add to Cart
							</button>
							<button className="flex items-center bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600">
								<BoltIcon className="size-4 mr-1" />
								Buy Now
							</button>
						</div>

						<div className="mb-8 space-y-4">
							<div className="flex items-center space-x-4">
								<FaShippingFast className="text-gray-700 text-xl" />
								<p className="text-gray-600">
									Free shipping on orders over €50
								</p>
							</div>
							<div className="flex items-center space-x-4">
								<FaUndoAlt className="text-gray-700 text-xl" />
								<p className="text-gray-600">30-day hassle-free returns</p>
							</div>
						</div>

						<div className="mb-8">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								Highlighted Features
							</h2>
							<ul className="list-disc pl-5 space-y-2 text-gray-600">
								<li>Feature 1: High-quality materials</li>
								<li>Feature 2: Durable and lightweight</li>
								<li>Feature 3: Eco-friendly manufacturing</li>
								<li>Feature 4: Compact and stylish design</li>
							</ul>
						</div>

						<div className="mb-8">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								Description
							</h2>
							<p className="text-gray-600 leading-relaxed">
								{productDetails.description}
							</p>
						</div>
					</div>
				</div>

				<div className="max-w-6xl mx-auto mt-16">
					<div className="bg-white p-6 rounded-lg shadow mb-8">
						<h2 className="text-lg font-semibold text-gray-800 mb-4">
							Product Details
						</h2>
						<table className="w-full text-left text-gray-600">
							<tbody>
								<tr className="border-b">
									<th className="py-2 px-4">Category</th>
									<td className="py-2 px-4">{productDetails.category}</td>
								</tr>
								<tr className="border-b">
									<th className="py-2 px-4">Weight</th>
									<td className="py-2 px-4">1.2 kg</td>
								</tr>
								<tr>
									<th className="py-2 px-4">Supplier</th>
									<td className="py-2 px-4">{productDetails.supplier_name}</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-lg font-semibold text-gray-800 mb-4">
							Customer Reviews
						</h2>
						<div className="space-y-6">
							{[1, 2, 3].map((review, index) => (
								<div
									key={index}
									className="p-4 border border-gray-200 rounded-md"
								>
									<div className="flex items-center justify-between mb-2">
										<div className="flex items-center space-x-2">
											<span className="text-yellow-400">★★★★★</span>
											<span className="text-gray-800 font-medium">
												John Doe
											</span>
										</div>
										<span className="text-gray-500 text-sm">2 days ago</span>
									</div>
									<p className="text-gray-600">
										Great product! Exactly what I needed. The quality is
										top-notch and delivery was fast.
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</>
	);
};

export default ProductDetailPage;
