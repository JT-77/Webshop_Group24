import { createContext, useReducer } from "react";
import axios from "axios";

const ProductContext = createContext();

const initialState = {
	products: [],
	loading: false,
	error: null,
	productDetails: null,
};

const productReducer = (state, action) => {
	switch (action.type) {
		case "FETCH_PRODUCTS_REQUEST":
			return { ...state, loading: true };
		case "FETCH_PRODUCTS_SUCCESS":
			return { ...state, products: action.payload, loading: false };
		case "FETCH_PRODUCTS_ERROR":
			return { ...state, error: action.payload, loading: false };
		case "SET_PRODUCT_DETAILS":
			return { ...state, productDetails: action.payload };
		default:
			return state;
	}
};

export const ProductProvider = ({ children }) => {
	const [state, dispatch] = useReducer(productReducer, initialState);

	const fetchProducts = async () => {
		dispatch({ type: "FETCH_PRODUCTS_REQUEST" });
		try {
			const response = await axios.get(
				process.env.REACT_APP_API_URL + "/products"
			);
			dispatch({ type: "FETCH_PRODUCTS_SUCCESS", payload: response.data });
		} catch (error) {
			dispatch({ type: "FETCH_PRODUCTS_ERROR", payload: error.message });
		}
	};

	const fetchProductById = async (productId) => {
		try {
			const response = await axios.get(
				process.env.REACT_APP_API_URL + "/products/" + productId
			);
			dispatch({ type: "SET_PRODUCT_DETAILS", payload: response.data });
		} catch (error) {
			console.error("Error fetching product details:", error);
		}
	};

	return (
		<ProductContext.Provider
			value={{ ...state, fetchProducts, fetchProductById }}
		>
			{children}
		</ProductContext.Provider>
	);
};

export default ProductContext;
