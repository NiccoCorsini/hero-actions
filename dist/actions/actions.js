var createSimpleAction = function (type) {
    return function () { return ({ type: type }); };
};
var createPayloadAction = function (type) {
    return function (payload) { return ({ type: type, payload: payload }); };
};
/**
 * Creates a factory function for generating type-safe Redux action creators based on a mapping of action payloads.
 *
 * @template Payloads - An object mapping action type strings to their respective payload types.
 *
 * @returns {<T extends Extract<keyof Payloads, string>>(type: T) => Function} A function that, given an action type `T`, returns a Redux action creator.
 *
 * @remarks
 * The returned factory function allows you to create action creators that are strongly typed according to the specified `Payloads`.
 * It ensures that actions are created with the correct type and payload, enhancing type safety and reducing runtime errors.
 *
 * - If `Payloads[T]` is `undefined`, the action creator requires no payload and returns an action of type `{ type: T }`.
 * - If `Payloads[T]` is defined, the action creator requires a payload of type `Payloads[T]` and returns an action of type `{ type: T; payload: Payloads[T] }`.
 *
 * This function utilizes TypeScript's conditional types to provide the appropriate action creator signature based on the payload type.
 *
 * @example
 * ```typescript
 * // authTypes.ts
 * export const AUTH_ACTIONS = {
 *   LOGIN_REQUEST: 'LOGIN_REQUEST',
 *   LOGIN_SUCCESS: 'LOGIN_SUCCESS',
 *   LOGOUT: 'LOGOUT',
 * } as const;
 *
 * // authPayloads.ts
 * interface AuthPayloads {
 *   [AUTH_ACTIONS.LOGIN_REQUEST]: { username: string; password: string };
 *   [AUTH_ACTIONS.LOGIN_SUCCESS]: { userId: string };
 *   [AUTH_ACTIONS.LOGOUT]: undefined;
 * }
 *
 * // authActions.ts
 * import { createActionForPayloads } from 'path-to-your-createAction';
 * import { AUTH_ACTIONS } from './authTypes';
 * import { AuthPayloads } from './authPayloads';
 *
 * const createAction = createActionForPayloads<AuthPayloads>();
 *
 * export const loginRequest = createAction(AUTH_ACTIONS.LOGIN_REQUEST);
 * export const loginSuccess = createAction(AUTH_ACTIONS.LOGIN_SUCCESS);
 * export const logout = createAction(AUTH_ACTIONS.LOGOUT);
 *
 * // Usage in a component or middleware
 * import { dispatch } from 'redux';
 * import { loginRequest, logout } from './authActions';
 *
 * // Dispatching a login request action
 * dispatch(loginRequest({ username: 'user1', password: 'pass123' }));
 * // Dispatching a logout action
 * dispatch(logout());
 * ```
 */
export var createActionForPayloads = function () {
    return function (type) {
        return (function (payload) {
            return payload !== undefined
                ? createPayloadAction(type)(payload)
                : createSimpleAction(type)();
        });
    };
};
//# sourceMappingURL=actions.js.map