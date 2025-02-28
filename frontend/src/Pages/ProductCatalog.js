import React, { useEffect, useContext, useState } from "react";
import ProductCard from "../Components/ProductCard";
import Sidebar from "../Components/Sidebar";
import ProductContext from "../Context/ProductContext";
import Loader from "../Components/Loader";

const ProductCatalog = () => {
	const { products, search, fetchProducts, loading } =
		useContext(ProductContext);

	useEffect(() => {
		if (products.length === 0) {
			handleApplyFilters();
		}
	}, []);

	const handleApplyFilters = (appliedFilters, priceRange) => {
		if (appliedFilters && appliedFilters.selectedSortBy !== "open") {
			const filterBody = {
				...appliedFilters,
				price_range: priceRange,
			};

			fetchProducts(filterBody);
		}
	};

	if (loading && products.length === 0) {
		return <Loader />;
	}

	return (
		<>
			<div className="max-w-screen-xl mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-6">
				<Sidebar applyFilters={handleApplyFilters} />

				<section className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{products
						?.filter((item) =>
							item.name.toLowerCase().includes(search.toLowerCase())
						)
						.map((product) => (
							<ProductCard
								className="max-h-2"
								key={product.id}
								product={product}
							/>
						))}
				</section>
			</div>
		</>
	);
};

export default ProductCatalog;
