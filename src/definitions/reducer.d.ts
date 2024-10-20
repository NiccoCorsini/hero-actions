import { Action, ActionWithPayload, PayloadsTree } from "./actions";

/**
 * A type that represents a collection of action handler functions for a reducer.
 *
 * Each handler function is responsible for updating the state based on the action dispatched.
 * It maps each action type (from the payloads object) to a corresponding handler function.
 *
 * - If the action type does not have a payload (i.e., `undefined`), the handler takes the current state
 *   and the action, and returns the new state.
 * - If the action type has a payload, the handler takes the current state and the action (which includes the payload),
 *   and returns the new state.
 *
 * @template State - The type representing the state managed by the reducer.
 * @template Payloads - An object where each key is an action type, and the corresponding value is the type of the payload for that action.
 *                      If an action does not have a payload, the value should be `undefined`.
 *
 * @typedef {Object} ActionHandlers
 * @property {Function} [Type] - A function that handles the action and updates the state.
 *    - If `Payloads[Type]` is `undefined`, the function signature is `(state: State, action: Action<Type>) => State`.
 *    - If `Payloads[Type]` is not `undefined`, the function signature is `(state: State, action: ActionWithPayload<Type, Payloads[Type]>) => State`.
 */
export type ActionHandlers<State, Payloads extends PayloadsTree> = {
  [Type in Extract<keyof Payloads, string>]: Payloads[Type] extends undefined
    ? (state: State, action: Action<Type>) => State
    : (state: State, action: ActionWithPayload<Type, Payloads[Type]>) => State;
};
