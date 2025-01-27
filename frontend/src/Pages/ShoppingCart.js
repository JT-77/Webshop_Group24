import React, { useState } from "react";
import {
	QuestionMarkCircleIcon,
	TrashIcon,
	ShoppingCartIcon,
} from "@heroicons/react/24/solid";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import { Link } from "react-router-dom";

const ShoppingCart = () => {
	const [cartItems, setCartItems] = useState([
		{
			id: 1,
			name: "Nike Cool T-Shirt with Batman design",
			mrp: 29,
			price: 25.99,
			description: "A trendy t-shirt for casual outings.",
			image: "/tshirt.jpeg",
			quantity: 4,
		},
		{
			id: 2,
			name: "Stylish Jacket for winters",
			mrp: 69,
			price: 59.99,
			description: "Keep warm with this stylish jacket.",
			image: "/tshirt.jpeg",
			quantity: 2,
		},
	]);

	const handleQuantityChange = (id, delta) => {
		setCartItems((prevItems) =>
			prevItems.map((item) =>
				item.id === id
					? { ...item, quantity: Math.max(1, item.quantity + delta) }
					: item
			)
		);
	};

	const handleRemoveItem = (id) => {
		setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
	};

	const calculateSubtotal = () =>
		cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

	const shippingCost = 5.0;
	const tax = 0.1 * calculateSubtotal(); // 10% tax
	const total = calculateSubtotal() + shippingCost + tax;

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<Header />

			<div className="flex-1 flex flex-col lg:flex-row gap-8 p-4 lg:p-8">
				{cartItems.length === 0 ? (
					<div className="flex flex-col items-center justify-center flex-1 bg-white rounded-lg shadow p-8">
						<ShoppingCartIcon className="w-16 h-16 text-gray-400 mb-4" />
						<h1 className="text-2xl font-semibold text-gray-800">
							Your cart is empty!
						</h1>
						<p className="text-gray-500 mt-2">
							Looks like you haven't added anything to your cart yet.
						</p>
						<Link
							to="/"
							className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
						>
							Browse Products
						</Link>
					</div>
				) : (
					<>
						<div className="flex-1 bg-white rounded-lg shadow p-4">
							<h1 className="text-xl font-semibold mb-4">Your Cart</h1>
							{cartItems.map((item) => (
								<div
									key={item.id}
									className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b py-4"
								>
									{/* Mobile Layout */}
									<div className="flex flex-row w-full gap-4">
										<div>
											<img
												src={item.image}
												alt={item.name}
												className="w-24 h-24 object-cover rounded"
											/>

											<p className="md:hidden font-semibold text-gray-800 text-left mt-2">
												€{(item.price * item.quantity).toFixed(2)}
											</p>
										</div>

										<div className="flex-1 flex justify-between flex-col">
											<h2 className="font-semibold text-gray-800">
												{item.name}
											</h2>

											<div className="md:hidden flex justify-end items-center gap-2 mt-2">
												<button
													onClick={() => handleQuantityChange(item.id, -1)}
													className="px-3 py-1 bg-gray-200 rounded"
												>
													-
												</button>
												<span className="w-8 text-center">{item.quantity}</span>
												<button
													onClick={() => handleQuantityChange(item.id, 1)}
													className="px-3 py-1 bg-gray-200 rounded"
												>
													+
												</button>
											</div>

											<button
												onClick={() => handleRemoveItem(item.id)}
												style={{ width: "80px", textAlign: "right" }}
												className="md:hidden text-red-500 self-end text-sm hover:underline flex align-end items-center gap-1 mt-2"
											>
												<TrashIcon className="w-4 h-4" /> Remove
											</button>
										</div>
									</div>

									{/* Desktop Layout */}
									<div className="hidden md:flex flex-col items-center h-full">
										<div className="flex-1 flex items-center flex-row">
											<div className="flex justify-end items-center gap-2">
												<button
													onClick={() => handleQuantityChange(item.id, -1)}
													className="px-3 py-1 bg-gray-200 rounded"
												>
													-
												</button>
												<span className="w-8 text-center">{item.quantity}</span>
												<button
													onClick={() => handleQuantityChange(item.id, 1)}
													className="px-3 py-1 bg-gray-200 rounded"
												>
													+
												</button>
											</div>

											<p
												className="ml-4 font-semibold text-gray-800"
												style={{ width: "80px", textAlign: "right" }}
											>
												€{(item.price * item.quantity).toFixed(2)}
											</p>
										</div>

										<button
											onClick={() => handleRemoveItem(item.id)}
											className="text-red-500 self-end text-sm hover:underline flex align-end items-center gap-1 mt-10"
										>
											<TrashIcon className="w-4 h-4" /> Remove
										</button>
									</div>
								</div>
							))}
						</div>

						{/* Order Summary */}
						<div className="bg-white rounded-lg shadow p-4 lg:w-1/3">
							<h2 className="text-xl font-semibold mb-4">Order Summary</h2>
							<div className="flex justify-between text-gray-600 mb-2">
								<p>Subtotal</p>
								<p>€{calculateSubtotal().toFixed(2)}</p>
							</div>
							<div className="flex justify-between items-center text-gray-600 mb-2 relative">
								<p className="flex items-center group">
									Shipping
									<QuestionMarkCircleIcon className="w-4 h-4 ml-1 text-gray-400" />
									<span className="absolute left-0 -bottom-6 hidden group-hover:block bg-gray-200 text-xs text-gray-700 p-2 rounded shadow-lg">
										Shipping charges cover delivery costs.
									</span>
								</p>
								<p>€{shippingCost.toFixed(2)}</p>
							</div>
							<div className="flex justify-between items-center text-gray-600 mb-4 relative">
								<p className="flex items-center group">
									Tax
									<QuestionMarkCircleIcon className="w-4 h-4 ml-1 text-gray-400" />
									<span className="absolute left-0 -bottom-6 hidden group-hover:block bg-gray-200 text-xs text-gray-700 p-2 rounded shadow-lg">
										Taxes are calculated based on your location.
									</span>
								</p>
								<p>€{tax.toFixed(2)}</p>
							</div>
							<div className="flex justify-between text-gray-800 font-semibold mb-4">
								<p>Total</p>
								<p>€{total.toFixed(2)}</p>
							</div>
							<button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
								Proceed to Checkout
							</button>
						</div>
					</>
				)}
			</div>

			<Footer />
		</div>
	);
};

export default ShoppingCart;
