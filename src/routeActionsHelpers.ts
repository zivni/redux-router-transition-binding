import { Action } from "./action"

export type RouteLocation = HistoryModule.Location
export type ExitLocationRule = (parms: { state: any, newLoaction: RouteLocation, previousLocation: RouteLocation }) => boolean
export type ConfirmationTextRule = (parms: { state: any, newLoaction: RouteLocation, previousLocation: RouteLocation }) => string

export interface RouteEnterActionCreator {
    (location: RouteLocation): Action[]
}

export interface RouteExitActionCreator {
    (location: RouteLocation): {
        actions: Action[],
        confirmatioPromptText?: string | ConfirmationTextRule,
        shouldHandleRouteExit?: ExitLocationRule,
    }
}


export function callMatchFunction(matchFunction, location: RouteLocation) {
    return matchFunction(addStartingSlashIfMissing(location.pathname));
}

export function createActions(actionTypes: string[], matchFunction: (path: string) => any, location: RouteLocation): Action[] {
    const payload = callMatchFunction(matchFunction, location);
    if (!payload) return [];
    return actionTypes.map(type => ({ type, payload }));
}

export function createRouteEnterActionCreator(actionTypes: string[] | string, matchFunction: (path: string) => any): RouteEnterActionCreator {
    if (typeof (actionTypes) === "string") {
        actionTypes = [actionTypes as string];
    }
    return (loaction: RouteLocation) => createActions(actionTypes as string[], matchFunction, loaction);
}

export function getActionsForLocation(actionCreators: RouteEnterActionCreator[], location: RouteLocation) {
    for (var i = 0; i < actionCreators.length; i++) {
        const action = actionCreators[i](location);
        if (action && action.length > 0) {
            return action;
        }
    }
    return undefined;
}

const addStartingSlashIfMissing = (path: string) => path && path.startsWith("/") ? path : "/" + path;


export function createRouteExitActionCreator(actionTypes: string[] | string, matchFunction: (path: string) => any, confirmatioPromptText?: string | ConfirmationTextRule, shouldHandleRouteExit?: ExitLocationRule, showConfirmationPrompt?: ExitLocationRule): RouteExitActionCreator {
    if (typeof (actionTypes) === "string") {
        actionTypes = [actionTypes as string];
    }
    return (loaction: RouteLocation) => {
        const actions = createActions(actionTypes as string[], matchFunction, loaction);
        if (actions && actions.length > 0) {
            return { actions, confirmatioPromptText, shouldHandleRouteExit, showConfirmationPrompt }
        }
        return undefined;
    };
}

export function getExitActionsForLocation(actionCreators: RouteExitActionCreator[], location: RouteLocation) {
    for (var i = 0; i < actionCreators.length; i++) {
        const result = actionCreators[i](location);
        if (result) {
            return result;
        }
    }
    return undefined;
}