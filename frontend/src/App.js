import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductCatalog from "./Pages/ProductCatalog";
import NotFoundPage from "./Pages/404";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<ProductCatalog />} />

				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</Router>
	);
};

export default App;
