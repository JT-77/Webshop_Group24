import React, { useContext, useState } from "react";
import {
	Elements,
	useStripe,
	useElements,
	CardNumberElement,
	CardExpiryElement,
	CardCvcElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import {
	ChevronRightIcon,
	CreditCardIcon,
	CurrencyEuroIcon,
	TruckIcon,
	ShoppingBagIcon,
	InformationCircleIcon,
} from "@heroicons/react/24/outline";
import {
	CheckBadgeIcon,
	ArrowLeftIcon,
	CheckCircleIcon,
} from "@heroicons/react/24/solid";
import CartContext from "../Context/CartContext";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const ProgressStep = ({ number, label, active, completed }) => (
	<div className="flex items-center">
		<div
			className={`flex items-center ${
				completed
					? "text-green-500"
					: active
					? "text-blue-500"
					: "text-gray-400"
			}`}
		>
			<div
				className={`h-8 w-8 flex items-center justify-center rounded-full border-2 
        ${
					completed
						? "bg-green-50 border-green-500"
						: active
						? "bg-blue-50 border-blue-500"
						: "bg-gray-50 border-gray-300"
				}`}
			>
				{completed ? <CheckCircleIcon size={16} /> : number}
			</div>
			<span className="ml-2 text-sm font-medium hidden md:inline">{label}</span>
		</div>
		{number < 3 && (
			<ChevronRightIcon className="mx-2 md:mx-4 h-6 w-6 text-gray-400" />
		)}
	</div>
);

const InputField = ({
	label,
	type = "text",
	value,
	onChange,
	placeholder,
	required = true,
}) => (
	<div>
		<label className="block text-gray-700 font-medium mb-2">{label}</label>
		<input
			type={type}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			required={required}
			className="w-full p-3 border rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
		/>
	</div>
);

const CartItem = ({ item }) => (
	<div className="flex items-center space-x-4 py-4 border-b last:border-b-0">
		<div className="flex-shrink-0 h-16 w-16 md:h-20 md:w-20 rounded-lg overflow-hidden bg-gray-100">
			<img
				src={item.image || item.image_path[0]}
				alt={item.name}
				className="h-full w-full object-contain"
			/>
		</div>
		<div>
			<div className="flex-1 min-w-0">
				<h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
				<p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
			</div>
			<div className="flex-shrink-0 text-sm font-medium text-gray-900">
				€{(item.quantity * item.price).toFixed(2)}
			</div>
		</div>
	</div>
);

const OrderSummary = ({ cartItems, calculateSubtotal, shippingCost, tax }) => (
	<div className="bg-white p-6 rounded-lg shadow-sm border">
		<h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
			<ShoppingBagIcon className="mr-2 w-6 h-6" size={20} />
			Order Summary
		</h3>
		<div className="space-y-4">
			{cartItems.map((item) => (
				<CartItem key={item.id} item={item} />
			))}
		</div>
		<div className="mt-6 space-y-2">
			<div className="flex justify-between text-sm text-gray-500">
				<span>Subtotal</span>
				<span>€{calculateSubtotal().toFixed(2)}</span>
			</div>
			<div className="flex justify-between text-sm text-gray-500">
				<span>Shipping</span>
				<span>€{shippingCost}</span>
			</div>
			<div className="flex justify-between text-sm text-gray-500">
				<span>Tax</span>
				<span>€{tax.toFixed(2)}</span>
			</div>
			<div className="border-t border-gray-200 pt-4 flex justify-between text-base font-medium text-gray-900">
				<span>Total</span>
				<span>€{(calculateSubtotal() + shippingCost + tax).toFixed(2)}</span>
			</div>
		</div>
	</div>
);

const CheckoutPage = () => {
	const [step, setStep] = useState(1);
	const [customerDetails, setCustomerDetails] = useState({
		name: "",
		email: "",
		street: "",
		city: "",
		state: "",
		postalCode: "",
	});
	const [cardType, setCardType] = useState("credit");
	const { cartItems, createOrder } = useContext(CartContext);
	const [paymentSuccess, setPaymentSuccess] = useState(false);
	const navigate = useNavigate();

	const calculateSubtotal = () =>
		cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

	const handleAddressSubmit = (e) => {
		e.preventDefault();
		setStep(2);
	};

	const shippingCost = calculateSubtotal() >= 50 ? 0.0 : 5.0;
	const tax = 0.1 * calculateSubtotal(); // 10% tax

	const handleBack = () => {
		setStep((prevStep) => Math.max(1, prevStep - 1));
	};

	const handlePaymentMethodSelect = (e) => {
		e.preventDefault();
		setStep(3);
	};

	const handlePaymentSuccess = async () => {
		const order_data = {
			customer_id: 1,
			customer_name: customerDetails.name,
			email_id: customerDetails.email,
			products: cartItems.map((item) => {
				const res = { product_id: item.product_id, quantity: item.quantity };
				return res;
			}),
			amount: (calculateSubtotal() + shippingCost + tax).toFixed(2),
			payment_method: cardType + " card",
			shipping_address:
				customerDetails.street +
				", " +
				customerDetails.city +
				", " +
				customerDetails.postalCode +
				", " +
				customerDetails.state,
		};

		const order_status = await createOrder(order_data);

		if (order_status === "success") {
			setPaymentSuccess(true);
			setStep(4);
		} else alert("Something went wrong!");
	};

	const CheckoutForm = () => {
		const stripe = useStripe();
		const elements = useElements();

		const handleSubmit = async (e) => {
			e.preventDefault();
			if (!stripe || !elements) return;

			const cardElement = elements.getElement(CardNumberElement);
			const { error } = await stripe.createPaymentMethod({
				type: "card",
				card: cardElement,
				billing_details: {
					name: customerDetails.name,
					email: customerDetails.email,
				},
			});

			if (error) {
				alert(error.message);
			} else {
				handlePaymentSuccess();
			}
		};

		return (
			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label className="block text-gray-700 font-medium mb-2">
						Card Number
					</label>
					<div className="p-3 border rounded-lg shadow-sm">
						<CardNumberElement />
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-gray-700 font-medium mb-2">
							Expiration Date
						</label>
						<div className="p-3 border rounded-lg shadow-sm">
							<CardExpiryElement />
						</div>
					</div>

					<div>
						<label className="block text-gray-700 font-medium mb-2">CVC</label>
						<div className="p-3 border rounded-lg shadow-sm">
							<CardCvcElement />
						</div>
					</div>
				</div>

				<button
					type="submit"
					className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
				>
					Pay €{calculateSubtotal().toFixed(2)}
				</button>
			</form>
		);
	};

	return (
		<>
			<div className="min-h-screen bg-gray-50 py-6 md:py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-4xl mx-auto">
						<div className="flex justify-center md:justify-between mb-8">
							<ProgressStep
								number={1}
								label="Shipping"
								active={step === 1}
								completed={step > 1}
							/>
							<ProgressStep
								number={2}
								label="Payment Method"
								active={step === 2}
								completed={step > 2}
							/>
							<ProgressStep
								number={3}
								label="Card Details"
								active={step === 3}
								completed={step > 3}
							/>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							<div className="lg:col-span-2">
								<div className="bg-white shadow-sm rounded-lg">
									<div className="p-6">
										{step > 1 && step !== 4 && (
											<button
												onClick={handleBack}
												className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
											>
												<ArrowLeftIcon className="h-4 w-4 mr-1" />
												Back
											</button>
										)}

										{step === 1 && (
											<form
												onSubmit={handleAddressSubmit}
												className="space-y-6"
											>
												<h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
													<TruckIcon className="w-6 h-6 mr-2" size={20} />
													Shipping Details
												</h2>
												<div className="grid grid-cols-1 gap-6">
													<InputField
														label="Full Name"
														value={customerDetails.name}
														onChange={(e) =>
															setCustomerDetails({
																...customerDetails,
																name: e.target.value,
															})
														}
														placeholder="Your Name"
													/>
													<InputField
														label="Email Address"
														type="email"
														value={customerDetails.email}
														onChange={(e) =>
															setCustomerDetails({
																...customerDetails,
																email: e.target.value,
															})
														}
														placeholder="your-email@example.com"
													/>
													<InputField
														label="Street Address"
														value={customerDetails.street}
														onChange={(e) =>
															setCustomerDetails({
																...customerDetails,
																street: e.target.value,
															})
														}
														placeholder="123 Main Street"
													/>
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														<InputField
															label="City"
															value={customerDetails.city}
															onChange={(e) =>
																setCustomerDetails({
																	...customerDetails,
																	city: e.target.value,
																})
															}
															placeholder="City"
														/>
														<InputField
															label="State"
															value={customerDetails.state}
															onChange={(e) =>
																setCustomerDetails({
																	...customerDetails,
																	state: e.target.value,
																})
															}
															placeholder="State"
														/>
													</div>
													<InputField
														label="Postal Code"
														value={customerDetails.postalCode}
														onChange={(e) =>
															setCustomerDetails({
																...customerDetails,
																postalCode: e.target.value,
															})
														}
														placeholder="12345"
													/>
												</div>
												<button
													type="submit"
													className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
												>
													Continue to Payment
												</button>
											</form>
										)}

										{step === 2 && (
											<form
												onSubmit={handlePaymentMethodSelect}
												className="space-y-6"
											>
												<h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
													<CurrencyEuroIcon className="mr-2 h-6 w-6" />
													Select Payment Method
												</h2>
												<div className="space-y-4">
													<label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
														<input
															type="radio"
															name="cardType"
															value="credit"
															checked={cardType === "credit"}
															onChange={(e) => setCardType(e.target.value)}
															className="h-4 w-4 text-blue-500 focus:ring-blue-500"
														/>
														<span className="ml-3 font-medium">
															Credit Card
														</span>
													</label>
													<label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
														<input
															type="radio"
															name="cardType"
															value="debit"
															checked={cardType === "debit"}
															onChange={(e) => setCardType(e.target.value)}
															className="h-4 w-4 text-blue-500 focus:ring-blue-500"
														/>
														<span className="ml-3 font-medium">Debit Card</span>
													</label>
												</div>
												<button
													type="submit"
													className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
												>
													Continue to Card Details
												</button>
											</form>
										)}

										{step === 3 && (
											<div className="space-y-6">
												<h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
													<CreditCardIcon className="mr-2 h-6 w-6" />
													Enter Card Details
												</h2>
												<Elements stripe={stripePromise}>
													<CheckoutForm />
												</Elements>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Order Summary */}
							{step < 4 && (
								<div className="lg:col-span-1">
									<div className="sticky top-6">
										<OrderSummary
											cartItems={cartItems}
											calculateSubtotal={calculateSubtotal}
											shippingCost={shippingCost}
											tax={tax}
										/>

										<div className="mt-6 bg-blue-50 rounded-lg p-4">
											<div className="flex items-start">
												<div className="flex-shrink-0">
													<InformationCircleIcon className="h-6 w-6 text-blue-400" />
												</div>
												<div className="ml-3">
													<h3 className="text-sm font-medium text-blue-800">
														Secure Checkout
													</h3>
													<p className="mt-2 text-sm text-blue-700">
														Your payment information is encrypted and secure. We
														never store your credit card details.
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>

						{paymentSuccess && (
							<div className="bg-white shadow-sm rounded-lg p-6">
								<div className="space-y-6">
									<div className="text-center mb-8">
										<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
											<CheckBadgeIcon className="h-6 w-6 text-green-600" />
										</div>
										<h3 className="text-xl font-medium text-green-600">
											Payment Successful!
										</h3>
										<p className="mt-2 text-sm text-gray-500">
											Your order has been confirmed and will be shipped soon.
										</p>
									</div>

									{/* Order Details */}
									<div className="space-y-6 border-t pt-6">
										<div>
											<h4 className="text-base font-medium text-gray-900 mb-4">
												Payment Method
											</h4>
											<div className="bg-gray-50 rounded-lg p-4">
												<div className="flex items-center">
													<CreditCardIcon className="h-6 w-6 text-gray-400" />
													<span className="ml-2 text-sm text-gray-600">
														{cardType.charAt(0).toUpperCase() +
															cardType.slice(1)}{" "}
														Card ending in ****4242
													</span>
												</div>
											</div>
										</div>

										<div>
											<h4 className="text-base font-medium text-gray-900 mb-4">
												Shipping Address
											</h4>
											<div className="bg-gray-50 rounded-lg p-4">
												<div className="text-sm text-gray-600 space-y-1">
													<p>{customerDetails.name}</p>
													<p>{customerDetails.street}</p>
													<p>
														{customerDetails.city}, {customerDetails.state}{" "}
														{customerDetails.postalCode}
													</p>
													<p>{customerDetails.email}</p>
												</div>
											</div>
										</div>
									</div>

									<div className="mt-8">
										<button
											onClick={() => navigate("/")}
											className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
										>
											Continue Shopping
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default CheckoutPage;
