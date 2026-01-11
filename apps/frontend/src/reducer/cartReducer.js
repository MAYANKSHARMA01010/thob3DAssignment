export const cartInitialState = {
    items: [],
};

export function cartReducer(state, action) {
    switch (action.type) {
        case "ADD_TO_CART": {
            const existingItem = state.items.find(
                (item) => item.id === action.payload.id
            );

            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map((item) =>
                        item.id === action.payload.id
                            ? {
                                ...item,
                                quantity: Math.min(
                                    item.quantity + action.payload.quantity,
                                    item.stock
                                ),
                            }
                            : item
                    ),
                };
            }

            return {
                ...state,
                items: [...state.items, action.payload],
            };
        }

        case "REMOVE_FROM_CART":
            return {
                ...state,
                items: state.items.filter(
                    (item) => item.id !== action.payload
                ),
            };

        case "UPDATE_QUANTITY":
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === action.payload.id
                        ? {
                            ...item,
                            quantity: Math.min(
                                Math.max(action.payload.quantity, 1),
                                item.stock
                            ),
                        }
                        : item
                ),
            };

        case "CLEAR_CART":
            return cartInitialState;

        default:
            return state;
    }
}
