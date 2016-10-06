import {CONFIRM_LEAVE_ROUTE, CONFIRM_STAY_ROUTE, SHOW_CONFIRMATION_ACTION} from "./confirmationActionsTypes"

export interface ShowConfirmationPayload {
    promptText?: string
    locationToLeaveTo?: HistoryModule.Location
    actionsToRunOnLeave?: any[]
}
export type ShowConfirmationCommand = (promptText: string, locationToLeaveTo: HistoryModule.Location, actionsToRunOnLeave: any[]) => { type: string, payload: ShowConfirmationPayload }
export const showConfirmation: ShowConfirmationCommand = (promptText, locationToLeaveTo, actionsToRunOnLeave) => ({
    type: SHOW_CONFIRMATION_ACTION,
    payload: { promptText, actionsToRunOnLeave, locationToLeaveTo }
})

export const confirmLeave = () => ({ type: CONFIRM_LEAVE_ROUTE })

export const confirmStay = () => ({ type: CONFIRM_STAY_ROUTE })