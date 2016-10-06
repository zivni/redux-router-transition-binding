declare module "redux-router-transition-binding" {
    import * as React from "react"

    export type Location = {
        pathname: string
        search: string
        query: any
        state: any
        action: string
        key: string
        basename?: string
    }

    export interface Action {
        type: string;
        payload: any;
    }

    export type ExitLocationRule = (parms: {
        state: any;
        newLoaction: Location;
        previousLocation: Location;
    }) => boolean;

    export type ConfirmationTextRule = (parms: {
        state: any;
        newLoaction: Location;
        previousLocation: Location;
    }) => string;

    export interface RouteEnterActionCreator {
        (location: Location): Action[];
    }

    export interface RouteExitActionCreator {
        (location: Location): {
            actions: Action[];
            confirmatioPromptText?: string | ConfirmationTextRule;
            shouldHandleRouteExit?: ExitLocationRule;
        };
    }

    export interface RouteExitConfirmationState extends Actions.ShowConfirmationPayload {
        showConfirmation: boolean;
    }

    export function createRouteEnterActionCreator(actionTypes: string[] | string, matchFunction: any): RouteEnterActionCreator;
    export function createRouteExitActionCreator(actionTypes: string[] | string, matchFunction: any, confirmatioPromptText?: string | ConfirmationTextRule, shouldHandleRouteExit?: ExitLocationRule, showConfirmationPrompt?: ExitLocationRule): RouteExitActionCreator;

    export const createMiddleware: (routeEnterActionCreators: RouteEnterActionCreator[]) => ({dispatch, getState}) => (next) => (action: Action) => any;

    export function registerRouteExitActionDispatcher(history: any, store: any, actionCreators: RouteExitActionCreator[]): void;
    export function historyGetUserConfirmationConfigFunction(message: string, callback: (result: boolean) => void): void;

    export const routeExitConfirmationReducer: (state: RouteExitConfirmationState, action: Action) => RouteExitConfirmationState;

    export const exitConfirmationStateSelector: (state: any) => RouteExitConfirmationState;

    export class RouteExitConfirmationDialog extends React.Component<any, any> { }

    export namespace Actions {
        export interface ShowConfirmationPayload {
            promptText?: string;
            locationToLeaveTo?: Location;
            actionsToRunOnLeave?: any[];
        }
        export type ShowConfirmationCommand = (promptText: string, locationToLeaveTo: Location, actionsToRunOnLeave: any[]) => {
            type: string;
            payload: ShowConfirmationPayload;
        };
        export const showConfirmation: ShowConfirmationCommand;
        export const confirmLeave: () => {
            type: string;
        };
        export const confirmStay: () => {
            type: string;
        };
    }

    export namespace ActionTypes {
        export const SHOW_CONFIRMATION_ACTION: string;
        export const CONFIRM_LEAVE_ROUTE: string;
        export const CONFIRM_STAY_ROUTE: string;
    }

    //= ReduxrouterTransitionBinding;
}