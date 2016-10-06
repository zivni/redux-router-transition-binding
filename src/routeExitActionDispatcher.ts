import { RouteExitActionCreator, getExitActionsForLocation, ConfirmationTextRule, ExitLocationRule } from "./routeActionsHelpers"
import { showConfirmation } from "./confirmationActions"

const STOP_FAKE_PROMPT = "SSTOP_FAKE_PROMPTTOP"
export function registerRouteExitActionDispatcher(history: HistoryModule.History, store: Redux.Store, actionCreators: RouteExitActionCreator[]) {
    history.listenBefore((newLoaction) => {
        let state = store.getState();
        let previousLocation = state.routing.locationBeforeTransitions
        let exitAction = getExitActionsForLocation(actionCreators, previousLocation);
        if (exitAction) {
            let shouldHandleRouteExit: ExitLocationRule = exitAction.shouldHandleRouteExit;
            //if the shouldHandleRouteExit was not specified then we need to know that we got here after leave confirmation by the user.
            //The middleware that generate the new location push action puts the okToLeave in the location state with it's current time stamp
            //and we check that the time step is now. this is because the state is saved in the history and back/forward by the user bring that state back.
            if (!shouldHandleRouteExit) shouldHandleRouteExit = (parms) => !(parms.newLoaction.state && parms.newLoaction.state["okToLeave"] && Date.now() - parms.newLoaction.state["okToLeave"] < 10) 

            if (shouldHandleRouteExit({ state, newLoaction, previousLocation })) {
                let confirmatioPromptText: ConfirmationTextRule;
                if (!exitAction.confirmatioPromptText) {
                    confirmatioPromptText = () => null;
                } else if (typeof exitAction.confirmatioPromptText == "function") {
                    confirmatioPromptText = exitAction.confirmatioPromptText as ConfirmationTextRule;
                } else {
                    confirmatioPromptText = () => (exitAction.confirmatioPromptText as string);
                }

                const promptText = confirmatioPromptText({ state, newLoaction, previousLocation });
                if (promptText) {
                    store.dispatch(showConfirmation(promptText, newLoaction, exitAction.actions));
                    return STOP_FAKE_PROMPT;
                }
                else {
                    exitAction.actions.forEach(action => store.dispatch(action));
                }
            }
        }
        return null;
    })
}

export function historyGetUserConfirmationConfigFunction(message: string, callback: (result: boolean) => void): void {
    callback(message != STOP_FAKE_PROMPT)
}