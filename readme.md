# redux-router-transition-binding 
Dispatch Redux actions before or after navigation with ability to define a confirmation dialog

**_NOTE:_ This is a work in progress and the API may change.** 
**The documentation is incomplete, but you may refer to the typescript definition file to see the API.**

This is a [react-router-redux](https://github.com/reactjs/react-router-redux) add-on
that will dispatch actions when navigating to a location or from a location.

It also gives a way to specify a confirmation message as a react component 
and dispatch the actions only when the user confirms the navigation.

## Dispatching actions on entering route
```
createMiddleware: (routeEnterActionCreators: RouteEnterActionCreator[])
RouteEnterActionCreator: (location: Location): Action[];
```
The `createMiddleware` method creates a Redux middleware that listens to navigation actions and dispatch your actions.
Add the created middleware to the Redux store.     

Pass to `createMiddleware` method an array of functions that when given a react-router location object returns an array of actions to dispatch when the location match.

You can use the `createRouteEnterActionCreator` helper method to create the array.


## License (MIT)
