import React, { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const ProductImageGallery = ({ images }) => {
	const [selectedImage, setSelectedImage] = useState(images[0]);
	const [isZoomed, setIsZoomed] = useState(false);
	const [backgroundPosition, setBackgroundPosition] = useState("center");

	const [scrollIndex, setScrollIndex] = useState(0);
	const thumbnailsToShow = window.innerWidth < 768 ? 3 : 5;

	useEffect(() => {
		if (images) setSelectedImage(images[0]);
	}, [images]);

	const handleMouseMove = (e) => {
		const { left, top, width, height } =
			e.currentTarget.getBoundingClientRect();
		const x = ((e.clientX - left) / width) * 100;
		const y = ((e.clientY - top) / height) * 100;
		setBackgroundPosition(`${x}% ${y}%`);
	};

	const handleScroll = (direction) => {
		const newIndex =
			direction === "left"
				? Math.max(scrollIndex - 1, 0)
				: Math.min(scrollIndex + 1, images.length - thumbnailsToShow);
		setScrollIndex(newIndex);
	};

	return (
		<div className="flex flex-col items-center">
			<div
				className={`relative w-full max-w-sm sm:max-w-md md:max-w-lg h-[300px] sm:h-[400px] md:h-[500px] rounded-lg shadow-lg overflow-hidden transition-all ${
					isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
				}`}
				onMouseEnter={() => window.innerWidth >= 768 && setIsZoomed(true)}
				onMouseLeave={() => {
					setIsZoomed(false);
					setBackgroundPosition("center");
				}}
				onMouseMove={window.innerWidth >= 768 ? handleMouseMove : null}
				style={
					isZoomed
						? {
								backgroundImage: `url(${selectedImage})`,
								backgroundPosition,
								backgroundSize: "150%",
								backgroundRepeat: "no-repeat",
						  }
						: {}
				}
			>
				{isZoomed || (
					<img
						src={selectedImage}
						alt="Selected"
						className="w-full h-full object-contain pointer-events-none"
					/>
				)}
			</div>

			{/* Thumbnails Section */}
			<div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg mt-4">
				{scrollIndex > 0 && (
					<button
						className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg p-2 z-10"
						onClick={() => handleScroll("left")}
					>
						<ChevronLeftIcon className="w-6 h-6 text-gray-500" />
					</button>
				)}

				<div className="flex overflow-hidden">
					<div
						className="flex space-x-3 transition-transform duration-300"
						style={{
							transform: `translateX(-${scrollIndex * 84}px)`,
						}}
					>
						{images.map((image, index) => (
							<button
								key={index}
								onClick={() => {
									setSelectedImage(image);
									setBackgroundPosition("center");
								}}
								className={`relative w-20 h-20 bg-white border-2 p-1 rounded-lg shadow-md transition-all ${
									selectedImage === image ? "border-black" : "border-gray-300"
								}`}
							>
								<img
									src={image}
									alt={`Thumbnail ${index + 1}`}
									className="w-full h-full object-contain rounded"
								/>
							</button>
						))}
					</div>
				</div>

				{scrollIndex < images.length - thumbnailsToShow && (
					<button
						className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg p-2 z-10"
						onClick={() => handleScroll("right")}
					>
						<ChevronRightIcon className="w-6 h-6 text-gray-500" />
					</button>
				)}
			</div>

			<p className="hidden lg:block mt-4 text-gray-400 text-sm italic text-center">
				Hover over the image to zoom in. <br />
				Scroll or click thumbnails to view more.
			</p>
		</div>
	);
};

export default ProductImageGallery;
