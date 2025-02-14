import React, { useState, useEffect } from "react";
import { Range } from "react-range";
import { XMarkIcon } from "@heroicons/react/24/solid";

const Sidebar = ({ filters, applyFilters }) => {
	const [filterState, setFilterState] = useState({
		selectedSortBy: "",
		includeOutOfStock: false,
		category: ["Accessories", "Electronics", "Clothing", "Perfume"],
		customerRatings: "",
	});

	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [priceRange, setPriceRange] = useState([10, 900]);
	const categories = ["Accessories", "Electronics", "Clothing", "Perfume"];

	useEffect(() => {
		applyFilters(filterState, priceRange);
		setIsFilterOpen(false);
	}, [filterState]);

	const handleCategoryChange = (e) => {
		const value = e.target.value;
		setFilterState((prevState) => {
			const category = prevState.category.includes(value)
				? prevState.category.filter((cat) => cat !== value)
				: [...prevState.category, value];

			return { ...prevState, category };
		});
	};

	const handleSortChange = (option) => {
		setFilterState((prevState) => ({
			...prevState,
			selectedSortBy: option,
		}));
	};

	const handleIncludeOutOfStockChange = (e) => {
		setFilterState((prevState) => ({
			...prevState,
			includeOutOfStock: e.target.checked,
		}));
	};

	const handleRatings = (e) => {
		setFilterState((prevState) => ({
			...prevState,
			customerRatings: e.target.value,
		}));
	};

	const handleResetFilters = () => {
		setFilterState({
			selectedSortBy: "",
			includeOutOfStock: false,
			category: [],
		});
		setPriceRange([100, 900]);
	};

	return (
		<div className="flex flex-col lg:flex-row lg:space-x-6">
			{/* Mobile/Tablet View */}
			<div className="block lg:hidden w-full flex justify-between space-x-2 mb-4">
				<div className="relative flex-grow">
					<button
						className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-600 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
						onClick={() =>
							setFilterState((prevState) => ({
								...prevState,
								selectedSortBy:
									prevState.selectedSortBy === "open" ? "" : "open",
							}))
						}
					>
						<span>
							{filterState.selectedSortBy &&
							filterState.selectedSortBy !== "open"
								? filterState.selectedSortBy
								: "Sort By"}
						</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className={`w-4 h-4 transform transition-transform ${
								filterState.selectedSortBy === "open"
									? "rotate-180"
									: "rotate-0"
							}`}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>
					{filterState.selectedSortBy === "open" && (
						<div className="absolute z-10 bg-white border border-gray-200 rounded-md shadow-md mt-2 w-full">
							{[
								"Price: Low to High",
								"Price: High to Low",
								"Rating: High to Low",
							].map((option, index) => (
								<div
									key={index}
									className="p-2 text-left hover:bg-gray-100 cursor-pointer text-sm text-gray-600"
									onClick={() => handleSortChange(option)}
								>
									{option}
								</div>
							))}
						</div>
					)}
				</div>

				<button
					onClick={() => setIsFilterOpen(true)}
					className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:border-blue-500"
				>
					Filters
				</button>
			</div>

			{/* Mobile/Tablet Filter Slider */}
			{isFilterOpen && (
				<div
					className={`block lg:hidden fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-lg p-4 transition-transform transform ${
						isFilterOpen ? "translate-x-0" : "-translate-x-full"
					} z-50`}
				>
					<div className="flex justify-end p-4">
						<button
							onClick={() => setIsFilterOpen(false)}
							className="text-gray-600 hover:text-gray-500"
						>
							<XMarkIcon className="h-6 w-6" />
						</button>
					</div>

					<div className="space-y-6">
						<div>
							<h3 className="text-lg text-left font-semibold text-gray-800 mb-2">
								Categories
							</h3>
							<ul className="space-y-2">
								{categories.map((category, index) => (
									<li key={index}>
										<label className="flex items-center space-x-2">
											<input
												type="checkbox"
												value={category}
												checked={filterState.category.includes(category)}
												onChange={handleCategoryChange}
												className="form-checkbox text-blue-600"
											/>
											<span className="text-gray-600">{category}</span>
										</label>
									</li>
								))}
							</ul>
						</div>

						<div>
							<h3 className="text-lg text-left font-semibold text-gray-800 mb-2">
								Price Range
							</h3>
							<div className="flex items-center space-x-4">
								<Range
									values={priceRange}
									step={1}
									min={0}
									max={1000}
									onChange={setPriceRange}
									renderTrack={({ props, children }) => (
										<div
											{...props}
											className="w-full h-2 bg-gray-300 rounded-md"
										>
											{children}
										</div>
									)}
									renderThumb={({ props }) => (
										<div
											{...props}
											className="w-4 h-4 bg-blue-600 rounded-full shadow-md"
										/>
									)}
								/>
								<button
									onClick={() => applyFilters(filterState, priceRange)}
									className="bg-blue-600 text-white px-4 py-1 rounded-lg font-medium hover:bg-blue-700 transition-colors"
								>
									Go
								</button>
							</div>
							<div className="flex justify-between text-sm mt-2">
								<span>€{priceRange[0]}</span>
								<span>€{priceRange[1] === 1000 ? "1000+" : priceRange[1]}</span>
							</div>
						</div>

						<div>
							<h3 className="text-lg text-left font-semibold text-gray-800 mb-2">
								Customer Ratings
							</h3>
							<ul className="space-y-2">
								{[4, 3, 2, 1].map((rating, index) => (
									<li key={index}>
										<label className="flex items-center space-x-2">
											<input
												type="radio"
												name="rating"
												value={rating}
												className="form-radio text-blue-600"
												checked={filterState.customerRatings == rating}
												onChange={handleRatings}
											/>
											<span className="text-gray-600">
												<span className="text-yellow-500">
													{"★".repeat(rating)}
												</span>{" "}
												& Up
											</span>
										</label>
									</li>
								))}
							</ul>
						</div>

						<div>
							<label className="flex items-center space-x-2">
								<input
									type="checkbox"
									checked={filterState.includeOutOfStock}
									onChange={handleIncludeOutOfStockChange}
									className="form-checkbox text-blue-600"
								/>
								<span className="text-gray-600">Include Out of Stock</span>
							</label>
						</div>

						<div>
							<button
								onClick={handleResetFilters}
								className="bg-gray-400 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors w-full"
							>
								Reset Filters
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Desktop View */}
			<div className="hidden lg:block w-full sticky top-0 h-screen bg-white shadow-md p-4 rounded-lg space-y-6">
				<div className="relative flex-grow">
					<button
						className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-600 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
						onClick={() =>
							setFilterState((prevState) => ({
								...prevState,
								selectedSortBy:
									prevState.selectedSortBy === "open" ? "" : "open",
							}))
						}
					>
						<span>
							{filterState.selectedSortBy &&
							filterState.selectedSortBy !== "open"
								? filterState.selectedSortBy
								: "Sort By"}
						</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className={`w-4 h-4 transform transition-transform ${
								filterState.selectedSortBy === "open"
									? "rotate-180"
									: "rotate-0"
							}`}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>
					{filterState.selectedSortBy === "open" && (
						<div className="absolute z-10 bg-white border border-gray-200 rounded-md shadow-md mt-2 w-full">
							{[
								"Price: Low to High",
								"Price: High to Low",
								"Rating: High to Low",
							].map((option, index) => (
								<div
									key={index}
									className="p-2 text-left hover:bg-gray-100 cursor-pointer text-sm text-gray-600"
									onClick={() => handleSortChange(option)}
								>
									{option}
								</div>
							))}
						</div>
					)}
				</div>

				<div>
					<h3 className="text-lg text-left font-semibold text-gray-800 mb-2">
						Categories
					</h3>
					<ul className="space-y-2">
						{categories.map((category, index) => (
							<li key={index}>
								<label className="flex items-center space-x-2">
									<input
										type="checkbox"
										value={category}
										checked={filterState.category.includes(category)}
										onChange={handleCategoryChange}
										className="form-checkbox text-blue-600"
									/>
									<span className="text-gray-600">{category}</span>
								</label>
							</li>
						))}
					</ul>
				</div>

				<div>
					<h3 className="text-lg text-left font-semibold text-gray-800 mb-2">
						Price Range
					</h3>
					<div className="flex items-center space-x-4">
						<Range
							values={priceRange}
							step={1}
							min={0}
							max={1000}
							onChange={setPriceRange}
							renderTrack={({ props, children }) => (
								<div {...props} className="w-full h-2 bg-gray-300 rounded-md">
									{children}
								</div>
							)}
							renderThumb={({ props }) => (
								<div
									{...props}
									className="w-4 h-4 bg-blue-600 rounded-full shadow-md"
								/>
							)}
						/>
						<button
							onClick={() => applyFilters(filterState, priceRange)}
							className="bg-blue-600 text-white px-4 py-1 rounded-lg font-medium hover:bg-blue-700 transition-colors"
						>
							Go
						</button>
					</div>
					<div className="flex justify-between text-sm mt-2">
						<span>€{priceRange[0]}</span>
						<span>€{priceRange[1] === 1000 ? "1000+" : priceRange[1]}</span>
					</div>
				</div>

				<div>
					<h3 className="text-lg text-left font-semibold text-gray-800 mb-2">
						Customer Ratings
					</h3>
					<ul className="space-y-2">
						{[4, 3, 2, 1].map((rating, index) => (
							<li key={index}>
								<label className="flex items-center space-x-2">
									<input
										type="radio"
										name="rating"
										value={rating}
										className="form-radio text-blue-600"
										checked={filterState.customerRatings == rating}
										onChange={handleRatings}
									/>
									<span className="text-gray-600">
										<span className="text-yellow-500">
											{"★".repeat(rating)}
										</span>{" "}
										& Up
									</span>
								</label>
							</li>
						))}
					</ul>
				</div>

				<div>
					<label className="flex items-center space-x-2">
						<input
							type="checkbox"
							checked={filterState.includeOutOfStock}
							onChange={handleIncludeOutOfStockChange}
							className="form-checkbox text-blue-600"
						/>
						<span className="text-gray-600">Include Out of Stock</span>
					</label>
				</div>

				<div>
					<button
						onClick={handleResetFilters}
						className="bg-gray-400 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors w-full"
					>
						Reset Filters
					</button>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
