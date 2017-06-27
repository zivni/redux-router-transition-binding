import { LOCATION_CHANGE, push } from "react-router-redux"
import {Action} from "./action"
import { getActionsForLocation, RouteEnterActionCreator } from "./routeActionsHelpers"
import { CONFIRM_LEAVE_ROUTE } from "./confirmationActionsTypes"
import { exitConfirmationStateSelector } from "./selectors"

/**
 * A redux middleware to catch location change actions and dispatch new actions to run after navigation.
 * The actions to dispatch are defined in routeActions.ts which sould return a list of functions that 
 * recive a location object (from react-router-redux) and return a list of actions to dispatch.
 * The first item in the list that return a non empty array is used. 
 */
export const createRouteEnterExitActionDispacherMiddleware = (routeEnterActionCreators: RouteEnterActionCreator[])=> ({ dispatch, getState }: Redux.MiddlewareArg) => (next: any) => (action: Action) => {
    switch (action.type) {
        case LOCATION_CHANGE:
            const newActions = getActionsForLocation(routeEnterActionCreators, action.payload)
            if (newActions) {
                const n = next(action);
                newActions.forEach(a => {
                    a.meta = {...a.meta, location:action.payload};
                    dispatch(a)
                });
                return n;
            }
            break;

        case CONFIRM_LEAVE_ROUTE:
            const state = exitConfirmationStateSelector(getState());
            if (state) {
                const {actionsToRunOnLeave, locationToLeaveTo} = state;
                //the correct order of actions is: CONFIRM_LEAVE_ROUTE, exit actions specified by the user, location change action
                const n = next(action);
                if (actionsToRunOnLeave) {
                    actionsToRunOnLeave.forEach(a => dispatch(a));
                }
                if (locationToLeaveTo) {
                    const locationAction = Object.assign({}, locationToLeaveTo, { state: Object.assign({}, locationToLeaveTo.state, { okToLeave: Date.now() }) }); //see note in routeExitActionDispatcher.ts
                    dispatch(push(locationAction));
                }
                return n;
            }
            break;

        default:
            break;
    }
    return next(action);
}