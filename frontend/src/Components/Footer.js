import React from "react";

const Footer = () => {
	return (
		<footer className="bg-blue-600 text-white py-8">
			<div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
				<div>
					<h2 className="text-xl font-bold mb-4">Webshop24</h2>
					<p>
						Your one-stop shop for amazing products and deals. Bringing quality
						to your doorstep.
					</p>
				</div>

				<div className="md:col-span-2 grid grid-cols-2 gap-8">
					<div>
						<h3 className="text-lg font-semibold mb-4">Quick Links</h3>
						<ul className="space-y-2">
							<li>
								<a href="/" className="hover:underline">
									Home
								</a>
							</li>
							<li>
								<a href="/products" className="hover:underline">
									Products
								</a>
							</li>
							<li>
								<a href="/categories" className="hover:underline">
									Categories
								</a>
							</li>
							<li>
								<a href="/about" className="hover:underline">
									About Us
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4">Support</h3>
						<ul className="space-y-2">
							<li>
								<a href="/contact" className="hover:underline">
									Contact Us
								</a>
							</li>
							<li>
								<a href="/faq" className="hover:underline">
									FAQ
								</a>
							</li>
							<li>
								<a href="/privacy-policy" className="hover:underline">
									Privacy Policy
								</a>
							</li>
							<li>
								<a href="/imprint" className="hover:underline">
									Imprint
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div className="mt-8 border-t border-blue-700 pt-4 text-center text-sm text-gray-200">
				© {new Date().getFullYear()} Webshop24. All rights reserved.
			</div>
		</footer>
	);
};

export default Footer;
