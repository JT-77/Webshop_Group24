import { createContext, useReducer } from "react";

const CartContext = createContext();

const initialState = {
	cartItems: [],
	totalQuantity: 0,
};

const cartReducer = (state, action) => {
	switch (action.type) {
		case "ADD_TO_CART":
			const existingItem = state.cartItems.find(
				(item) => item.product_id === action.payload.product_id
			);
			if (existingItem) {
				return {
					...state,
					cartItems: state.cartItems.map((item) =>
						item.product_id === action.payload.product_id
							? { ...item, quantity: item.quantity + action.payload.quantity }
							: item
					),
					totalQuantity: state.totalQuantity + action.payload.quantity,
				};
			} else {
				return {
					...state,
					cartItems: [...state.cartItems, action.payload],
					totalQuantity: state.totalQuantity + action.payload.quantity,
				};
			}
		case "REMOVE_FROM_CART":
			console.log(action.payload);
			const itemToRemove = state.cartItems.find(
				(item) => item.product_id === action.payload
			);
			return {
				...state,
				cartItems: state.cartItems.filter(
					(item) => item.product_id !== action.payload
				),
				totalQuantity:
					state.totalQuantity - (itemToRemove ? itemToRemove.quantity : 0),
			};
		case "UPDATE_QUANTITY":
			return {
				...state,
				cartItems: state.cartItems
					.map((item) =>
						item.product_id === action.payload.product_id
							? { ...item, quantity: item.quantity + action.payload.quantity }
							: item
					)
					.filter((item) => item.quantity > 0),
				totalQuantity: state.cartItems.reduce(
					(total, item) =>
						item.product_id === action.payload.product_id
							? total + action.payload.quantity
							: total,
					state.totalQuantity
				),
			};
		case "CLEAR_CART":
			return { cartItems: [], totalQuantity: 0 };
		default:
			return state;
	}
};

export const CartProvider = ({ children }) => {
	const [state, dispatch] = useReducer(cartReducer, initialState);

	return (
		<CartContext.Provider value={{ ...state, dispatch }}>
			{children}
		</CartContext.Provider>
	);
};

export default CartContext;
