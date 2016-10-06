/// <reference path="../typings/tsd.d.ts" />
import polyfill from "./polyfill"
import * as Actions from "./confirmationActions"
import * as ActionTypes from "./confirmationActionsTypes"
import {createRouteEnterActionCreator, createRouteExitActionCreator} from "./routeActionsHelpers"
import {createRouteEnterExitActionDispacherMiddleware as createMiddleware} from "./routeEnterActionDispacherMiddleware"
import {historyGetUserConfirmationConfigFunction, registerRouteExitActionDispatcher} from "./routeExitActionDispatcher"
import {routeExitConfirmationReducer} from "./routeExitConfirmationReducer"
import {exitConfirmationStateSelector} from "./selectors"
import {RouteExitConfirmationDialog} from "./routeExitConfirmationDialog"

polyfill();

export {
    ActionTypes,
    Actions,
    createRouteEnterActionCreator, createRouteExitActionCreator,
    createMiddleware,
    historyGetUserConfirmationConfigFunction, registerRouteExitActionDispatcher,
    routeExitConfirmationReducer,
    exitConfirmationStateSelector,
    RouteExitConfirmationDialog
}