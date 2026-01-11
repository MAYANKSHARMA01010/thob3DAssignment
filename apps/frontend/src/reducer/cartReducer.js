export const cartInitialState = {
    items: [],
};

export function cartReducer(state, action) {
    switch (action.type) {
        case "SET_CART":
            return { ...state, items: action.payload };

        case "ADD_TO_CART": {
            const existing = state.items.find(
                (i) => i.id === action.payload.id
            );

            if (existing) {
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

        case "REMOVE_FROM_CART":
            return {
                ...state,
                items: state.items.filter(
                    (item) => item.id !== action.payload
                ),
            };

        case "CLEAR_CART":
            return cartInitialState;

        default:
            return state;
    }
}
