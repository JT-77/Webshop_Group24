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
import AboutUs from "./Pages/AboutUs";
import { ProductProvider } from "./Context/ProductContext";
import { CartProvider } from "./Context/CartContext";
import Home from "./Pages/Home";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

const App = () => {
	return (
		<ProductProvider>
			<CartProvider>
				
				<Router>
				<Header />
				<br /><br /><br />
					<Routes>
					
						<Route path="/" element={<Home />} />
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
					<Footer />
				</Router>
				
			</CartProvider>
		</ProductProvider>
	);
};

export default App;
