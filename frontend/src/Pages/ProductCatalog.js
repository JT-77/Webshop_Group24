import React, { useEffect, useContext } from "react";
import ProductCard from "../Components/ProductCard";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import ProductContext from "../Context/ProductContext";

const ProductCatalog = () => {
	const { products, fetchProducts } = useContext(ProductContext);

	useEffect(() => {
		if (products.length === 0) {
			fetchProducts();
		}
	}, []);

	const handleApplyFilters = (appliedFilters, priceRange) => {
		if (appliedFilters.selectedSortBy !== "open")
			console.log("Filters applied:", appliedFilters, priceRange);
	};

	return (
		<>
			<Header />

			<div className="max-w-screen-xl mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-6">
				<Sidebar applyFilters={handleApplyFilters} />

				<section className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</section>
			</div>
			<Footer />
		</>
	);
};

export default ProductCatalog;
