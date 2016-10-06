import { Action } from "./action"
import { CONFIRM_LEAVE_ROUTE, CONFIRM_STAY_ROUTE, SHOW_CONFIRMATION_ACTION } from "./confirmationActionsTypes"
import { ShowConfirmationPayload } from "./confirmationActions"

export interface RouteExitConfirmationState extends ShowConfirmationPayload {
    showConfirmation: boolean
}
type State = RouteExitConfirmationState
const initialState: State = {
    showConfirmation: false,
}

const showConfirmation = (_state: State, action: Action): State => {
    return Object.assign({ showConfirmation: true }, action.payload);
}

const hideConfirmation = (_state: State, _action: Action): State => {
    return { showConfirmation: false };
}

export const routeExitConfirmationReducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case SHOW_CONFIRMATION_ACTION:
            return showConfirmation(state, action);

        case CONFIRM_STAY_ROUTE:
        case CONFIRM_LEAVE_ROUTE:
            return hideConfirmation(state, action);

        default:
            return state;
    }
}