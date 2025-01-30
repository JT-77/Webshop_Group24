import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductCatalog from "./Pages/ProductCatalog";
import NotFoundPage from "./Pages/404";
import ProductDetail from "./Pages/ProductDetail";
import ShoppingCart from "./Pages/ShoppingCart";
import FAQ from "./Pages/FAQs";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<ProductCatalog />} />
				<Route path="/product/:id" element={<ProductDetail />} />
				<Route path="/cart" element={<ShoppingCart />} />
				<Route path="/faq" element={<FAQ />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</Router>
	);
};

export default App;
