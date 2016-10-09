# redux-router-transition-binding 
Dispatch Redux actions before or after navigation with ability to define a confirmation dialog

**_NOTE:_ This is a work in progress and the API may change.** 
**The documentation is incomplete, but you may refer to the typescript definition file to see the API.**

This is a [react-router-redux](https://github.com/reactjs/react-router-redux) add-on
that will dispatch actions when navigating to a location or from a location.

It also gives a way to specify a confirmation message as a react component 
and dispatch the actions only when the user confirms the navigation.

## The reasoning behind this library
If React is the V in MVC, then it should have only display logic.
Redux is the Model. And the controller should be in some place else. 
This place can be a in a middleware using something like [redux-saga](https://github.com/yelouafi/redux-saga) or [redux-observable](https://github.com/redux-observable/redux-observable).

In this model the actions are just plain objects that carry messages between the MVC parts.

So if I want my React components to have only display logic and the Sagas have the business logic. 
How Do I trigger this business logic when navigating to or from a location?

I could do it in the componentDidMount method, but this couples the display logic with the other logic.

So I created this library. and now I can define actions on enter/leave route. and have the business logic where it should be - in the saga.

## Install
[npm i -S redux-router-transition-binding](https://www.npmjs.com/package/redux-router-transition-binding)

Then import everything: 
`import { Actions, createMiddleware, ... } from "redux-router-transition-binding"`

## Dispatching actions on entering route
### Step 1: Specify what to dispatch on entering a location
Create an array of functions that when given a react-router location object returns an array of actions to dispatch when the location match.
The array should be an array of objects whose type is `RouteEnterActionCreator`
```
type RouteEnterActionCreator = (location: Location) -> Action[];
```

### Step 2: Add a middleware
The `createMiddleware` method creates a Redux middleware that listens to navigation actions and dispatch your actions.
Add the created middleware to the Redux store.     

Pass to `createMiddleware` method the array you created in step 1.

```
function createMiddleware(routeEnterActionCreators: RouteEnterActionCreator[]) -> ReduxMiddleware
```

### Helper To create RouteEnterActionCreator 
You can use the `createRouteEnterActionCreator` helper method to create the array.
```
function createRouteEnterActionCreator(actionTypes: string[] | string, matchFunction: (path: string) => any) -> RouteEnterActionCreator;
```

Then you can use [route-parser](https://github.com/rcs/route-parser)as the matchFunction argument

## Dispatching actions on exiting route
### Step 1: Specify what to dispatch on entering a location
Create an array of functions that when given a react-router location object returns an array of actions to dispatch when the location match.
The array should be an array of objects whose type is `RouteEnterActionCreator`
```
type RouteExitActionCreator = (location: Location) -> {
            actions: Action[];
            confirmatioPromptText?: string | ConfirmationTextRule;
            shouldHandleRouteExit?: ExitLocationRule;
        } | null;
type ConfirmationTextRule = (parms: {
        state: any;
        newLoaction: Location;
        previousLocation: Location;
    }) -> string | null;
type ExitLocationRule = (parms: {
        state: any;
        newLoaction: Location;
        previousLocation: Location;
    }) => boolean;    
```
Where:
* actions - An array of actions to dispatch when leaving the location.
* confirmatioPromptText - The text to display when leaving the location. can be string o a function that returns a string based on the state, current location and the location we leave to. return null to avoid displaying the message. If not specified then no confirmation message will displayed. 
* shouldHandleRouteExit -  A function that should return true if to run actions (and show the confirmation). if not specified it considered true

### Step 2: register history.getUserConfirmation
There is a need to override the history default user confirmation dialog for two reasons:
* We want some nice React component dialog.
* We want our actions to run only if the user confirms navigation.

You need to use a code like this to create the history object:
```
import { createHistory } from "history";
import { useRouterHistory } from "react-router"
import {historyGetUserConfirmationConfigFunction} from "redux-router-transition-binding"

export const browserHistory = useRouterHistory(createHistory)({
    basename: URL_BASE,
    getUserConfirmation: historyGetUserConfirmationConfigFunction,
});
```

Use this history when defining the Router:
```
import { Router, Route, IndexRoute } from "react-router"
import { syncHistoryWithStore } from "react-router-redux"
import {browserHistory} from "/utils/browserHistoryUtils"

const store = configureStore(...);
registerRouteExitActionDispatcher(browserHistory, store, routeExitActionCreators); // see below
const history = syncHistoryWithStore(browserHistory, store)

 <Provider store={store}>
    <Router history={history}>
        <Route path="/" component={App}>
        //...
        </Route>
    </Router>
 </Provider>
```

### Step 3: Register a listener on the history leave event to dispatch the actions.
```
function registerRouteExitActionDispatcher(history, store, actionCreators: RouteExitActionCreator[]) -> void;
```
Where:
* history - The history object created above. see usage example in the previous step.
* store - The redux store.
* actionCreators - the array from step 1.

#### How does it work?
1. Checks if any functions in the _actionCreators_ array return the object. It takes the first one.
2. Checks if the _shouldHandleRouteExit_ return true (or it is not defined)
3. Checks if _confirmatioPromptText_ returns a non-nullable string and if so dispatch _SHOW_CONFIRMATION_ACTION_ action with the actions passed in the actions property as the payload.
4. If the _confirmatioPromptText_ return a null value or it is undefined. dispatch the actions specified in the actions property.

### Step 4: register the routeExitConfirmationReducer 
This step is required if you want to have confirmation on route leave. 
Make sure the middleware is registered as described above.

The reducer should be at the root reducer at the _"routeExitConfirmation"_ key. 
for example:
```
import { routeExitConfirmationReducer } from "redux-router-transition-binding"

export const rootReducer = combineReducers({
    //other reducers....,
    routeExitConfirmation: routeExitConfirmationReducer,
})
```

The routeExitConfirmation state has the following shape:
```
interface RouteExitConfirmationState {
    showConfirmation: boolean
    promptText?: string;
    locationToLeaveTo?: Location;
    actionsToRunOnLeave?: any[];
}
```
There is an helper selector method to retrieve this state: `exitConfirmationStateSelector: (state: any) => RouteExitConfirmationState` 

### Step 5 (option a): Add the supplied confirmation dialog
There is a simple confirmation dialog supplied with this library. Just add as a child to the top component.
```
import { RouteExitConfirmationDialog } from "redux-router-transition-binding"

export class App extends React.Component {
    public render() {
        return (
            <div className="appContainer">
                {this.props.children}
                <RouteExitConfirmationDialog />
            </div>
        )
    }
}
```
The dialog can be styled with the following CSS classes:
* div.RouteExitConfirmationDialog - the dialog container div 
* div.RouteExitConfirmationDialog div.message - the message text div
* div.RouteExitConfirmationDialog button.ConfirmButton - the confirm leave route button
* div.RouteExitConfirmationDialog button.StayButton - the stay and do not leave route button

At the minimum the style sheet should be something like:
```
.RouteExitConfirmationDialog {
    position: fixed;
    background-color: gray;
    color: black;
}
```
### Step 5 (option b): Or create your own confirmation dialog
If you want to build your own confirm dialog you can do it easily:
1. connect your dialog component to the redux state and map the _showConfirmation_ property.
You can use the supplied  _exitConfirmationStateSelector_ method as noted above.
2. `import {Actions} from "redux-router-transition-binding"`, and use the _Actions.confirmLeave_ and _Actions.confirmStay_ action creators to dispatch the relevent actions

See the code of _RouteExitConfirmationDialog_ for an example.

## Known Issues
When using the browser's back command and a confirmation dialog is displayed. Confirming the navigation does not leave the page.

This is because the  the state maintained by _react-router-redux_ is changed to the route we are on.  

##License
[MIT License](https://raw.githubusercontent.com/zivni/redux-router-transition-binding/master/LICENSE.md)
