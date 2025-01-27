import React from "react";
import ProductCard from "../Components/ProductCard";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const ProductCatalog = () => {
	const products = [
		{
			id: 1,
			name: "Cool T-Shirt",
			mrp: 29,
			price: 25.99,
			description: "A trendy t-shirt for casual outings.",
			image: "/tshirt.jpeg",
			rating: 4.5,
		},
		{
			id: 2,
			name: "Stylish Jacket",
			mrp: 69,
			price: 59.99,
			description: "Keep warm with this stylish jacket.",
			image: "/tshirt.jpeg",
			rating: 4.2,
		},
		{
			id: 3,
			name: "Elegant Watch",
			mrp: 249,
			price: 199.99,
			description: "A sleek and elegant watch for all occasions.",
			image: "/tshirt.jpeg",
			rating: 3,
		},
		{
			id: 4,
			name: "Cool T-Shirt",
			mrp: 35,
			price: 25.99,
			description: "A trendy t-shirt for casual outings.",
			image: "/tshirt.jpeg",
			rating: 4.5,
		},
		{
			id: 5,
			name: "Stylish Jacket",
			mrp: 79,
			price: 59.99,
			description: "Keep warm with this stylish jacket.",
			image: "/tshirt.jpeg",
			rating: 4.2,
		},
		{
			id: 6,
			name: "Elegant Watch",
			mrp: 249,
			price: 199.99,
			description: "A sleek and elegant watch for all occasions.",
			image: "/tshirt.jpeg",
			rating: 3,
		},
		{
			id: 7,
			name: "Stylish Jacket",
			mrp: 79,
			price: 59.99,
			description: "Keep warm with this stylish jacket.",
			image: "/tshirt.jpeg",
			rating: 4.2,
		},
		{
			id: 8,
			name: "Elegant Watch",
			mrp: 249,
			price: 199.99,
			description: "A sleek and elegant watch for all occasions.",
			image: "/tshirt.jpeg",
			rating: 3,
		},
		{
			id: 9,
			name: "Stylish Jacket",
			mrp: 79,
			price: 59.99,
			description: "Keep warm with this stylish jacket.",
			image: "/tshirt.jpeg",
			rating: 4.2,
		},
		{
			id: 10,
			name: "Elegant Watch",
			mrp: 249,
			price: 199.99,
			description: "A sleek and elegant watch for all occasions.",
			image: "/tshirt.jpeg",
			rating: 3,
		},
		{
			id: 11,
			name: "Stylish Jacket",
			mrp: 79,
			price: 59.99,
			description: "Keep warm with this stylish jacket.",
			image: "/tshirt.jpeg",
			rating: 4.2,
		},
		{
			id: 12,
			name: "Elegant Watch",
			mrp: 249,
			price: 199.99,
			description: "A sleek and elegant watch for all occasions.",
			image: "/tshirt.jpeg",
			rating: 3,
		},
		{
			id: 13,
			name: "Stylish Jacket",
			mrp: 79,
			price: 59.99,
			description: "Keep warm with this stylish jacket.",
			image: "/tshirt.jpeg",
			rating: 4.2,
		},
		{
			id: 14,
			name: "Elegant Watch",
			mrp: 249,
			price: 199.99,
			description: "A sleek and elegant watch for all occasions.",
			image: "/tshirt.jpeg",
			rating: 3,
		},
		{
			id: 15,
			name: "Stylish Jacket",
			mrp: 79,
			price: 59.99,
			description: "Keep warm with this stylish jacket.",
			image: "/tshirt.jpeg",
			rating: 4.2,
		},
		{
			id: 16,
			name: "Elegant Watch",
			mrp: 249,
			price: 199.99,
			description: "A sleek and elegant watch for all occasions.",
			image: "/tshirt.jpeg",
			rating: 3,
		},
	];

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
