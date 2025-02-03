import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductCatalog from "./Pages/ProductCatalog";
import NotFoundPage from "./Pages/404";
import ProductDetail from "./Pages/ProductDetail";
import ShoppingCart from "./Pages/ShoppingCart";
import FAQ from "./Pages/FAQs";
import ContactUs from "./Pages/ContactUs";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import Imprint from "./Pages/Imprint";
import Checkout from "./Pages/Checkout";
import { ProductProvider } from "./Context/ProductContext";
import AboutUs from "./Pages/AboutUs";

const App = () => {
	return (
		<ProductProvider>
			<Router>
				<Routes>
					<Route path="/" element={<ProductCatalog />} />
					<Route path="/products" element={<ProductCatalog />} />
					<Route path="/product/:id" element={<ProductDetail />} />
					<Route path="/cart" element={<ShoppingCart />} />
					<Route path="/faq" element={<FAQ />} />
					<Route path="/contact" element={<ContactUs />} />
					<Route path="/privacy-policy" element={<PrivacyPolicy />} />
					<Route path="/imprint" element={<Imprint />} />
					<Route path="/checkout" element={<Checkout />} />
					<Route path="/about" element={<AboutUs />} />
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</Router>
		</ProductProvider>
	);
};

export default App;
