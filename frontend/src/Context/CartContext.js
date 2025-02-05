import { createContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const initialState = JSON.parse(localStorage.getItem("cartState")) || {
    cartItems: [],
    totalQuantity: 0,
};

const cartReducer = (state, action) => {
    let updatedState;
    switch (action.type) {
        case "ADD_TO_CART":
            const existingItem = state.cartItems.find(
                (item) => item.product_id === action.payload.product_id
            );
            if (existingItem) {
                updatedState = {
                    ...state,
                    cartItems: state.cartItems.map((item) =>
                        item.product_id === action.payload.product_id
                            ? { ...item, quantity: item.quantity + action.payload.quantity }
                            : item
                    ),
                    totalQuantity: state.totalQuantity + action.payload.quantity,
                };
            } else {
                updatedState = {
                    ...state,
                    cartItems: [...state.cartItems, action.payload],
                    totalQuantity: state.totalQuantity + action.payload.quantity,
                };
            }
            break;

        case "REMOVE_FROM_CART":
            const itemToRemove = state.cartItems.find(
                (item) => item.product_id === action.payload
            );
            updatedState = {
                ...state,
                cartItems: state.cartItems.filter(
                    (item) => item.product_id !== action.payload
                ),
                totalQuantity:
                    state.totalQuantity - (itemToRemove ? itemToRemove.quantity : 0),
            };
            break;

        case "UPDATE_QUANTITY":
            updatedState = {
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
            break;

        case "CLEAR_CART":
            updatedState = { cartItems: [], totalQuantity: 0 };
            break;

        default:
            return state;
    }

    localStorage.setItem("cartState", JSON.stringify(updatedState));
    return updatedState;
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    useEffect(() => {
        localStorage.setItem("cartState", JSON.stringify(state));
    }, [state]);

    return (
        <CartContext.Provider value={{ ...state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;