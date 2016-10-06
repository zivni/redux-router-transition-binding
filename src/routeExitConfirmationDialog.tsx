import * as React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import { exitConfirmationStateSelector } from "./selectors"
import { confirmLeave, confirmStay } from "./confirmationActions"

export interface MappedProps {
    isDialogVisible?: boolean
    message?: string
    onConfirmLeave?: () => void
    onConfirmStay?: () => void
}

const mapStateToProps = (state): MappedProps => {
    const {promptText: message, showConfirmation: isDialogVisible} = exitConfirmationStateSelector(state);
    return {
        isDialogVisible,
        message,
    }
}

const mapActionsToProps = (dispatch): MappedProps => ({
    onConfirmLeave: bindActionCreators(confirmLeave, dispatch),
    onConfirmStay: bindActionCreators(confirmStay, dispatch),

})

@connect(mapStateToProps, mapActionsToProps)
export class RouteExitConfirmationDialog extends React.Component<MappedProps, any>{
    public render() {
        const {isDialogVisible, message, onConfirmStay, onConfirmLeave} = this.props;
        if (isDialogVisible) {
            return (
                <div className="RouteExitConfirmationDialog">
                    <div className="message">{message}</div>
                    <button className="ConfirmButton" onClick={onConfirmLeave} >Leave</button>
                    <button className="StayButton" onClick={onConfirmStay}>Stay</button>
                </div>
            )
        }
        else {
            return null;
        }
    }
}