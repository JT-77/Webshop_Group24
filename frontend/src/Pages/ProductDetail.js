import React from "react";
import { FaShippingFast, FaUndoAlt } from "react-icons/fa";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import ImageSection from "../Components/ProductImages";
import { ShoppingCartIcon, BoltIcon } from "@heroicons/react/24/solid";

const ProductDetailPage = () => {
	return (
		<>
			<Header />
			<div className="container bg-gray-50 mt-2 mx-0 lg:mx-auto px-4 py-6">
				<div className="grid md:grid-cols-2 gap-8">
					<ImageSection />

					<div>
						<h1 className="text-2xl font-semibold text-gray-800 mb-2">
							Product Name
						</h1>
						<div className="flex items-center mb-4">
							<span className="text-yellow-400 text-lg">★★★★★</span>
							<span className="text-gray-600 ml-2">4.5 (320 reviews)</span>
						</div>

						<div className="mb-6">
							<div className="flex items-center space-x-4">
								<span className="text-2xl font-bold text-gray-800">€99.99</span>
								<span className="text-gray-500 line-through">€129.99</span>
							</div>
							<p className="text-red-600 text-lg font-medium mt-2">
								Only 4 left in stock!
							</p>
						</div>

						<div className="flex items-center space-x-4 mb-8">
							<button className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700">
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
								This product is crafted with premium materials to ensure
								durability and long-lasting performance. It’s perfect for
								everyday use and complements your style effortlessly. With a
								sleek design and functionality in mind, it’s a must-have for
								anyone looking for quality and practicality in one package.
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
									<th className="py-2 px-4">Dimensions</th>
									<td className="py-2 px-4">10 x 8 x 4 inches</td>
								</tr>
								<tr className="border-b">
									<th className="py-2 px-4">Weight</th>
									<td className="py-2 px-4">1.2 kg</td>
								</tr>
								<tr className="border-b">
									<th className="py-2 px-4">Material</th>
									<td className="py-2 px-4">Polyester</td>
								</tr>
								<tr>
									<th className="py-2 px-4">Supplier</th>
									<td className="py-2 px-4">Global Supply Co.</td>
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
