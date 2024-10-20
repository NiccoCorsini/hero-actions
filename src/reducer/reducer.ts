import { ActionWithPayload, PayloadsTree } from "../definitions/actions";
import { ActionHandlers } from "../definitions/reducer";

/**
 * Creates a type-safe reducer function for managing state in Redux.
 *
 * @template State - The type representing the state managed by the reducer.
 * @template Payloads - An object mapping action type strings to their respective payload types.
 *
 * @param {State} initialState - The initial state of the reducer.
 * @param {ActionHandlers<State, Payloads>} handlers - An object mapping action type strings to handler functions.
 * Each handler function updates the state in response to its associated action type.
 *
 * @returns {(state: State | undefined, action: any) => State} A reducer function compatible with Redux.
 *
 * @remarks
 * The returned reducer function operates as follows:
 * - It checks if a handler exists for the `action.type` in the provided `handlers` object.
 * - If a matching handler is found, it invokes the handler with the current `state` and `action`, returning the new state.
 * - If no matching handler is found, it returns the current `state` unchanged.
 *
 * The `handlers` object should have keys corresponding to action type strings, and values as functions that handle those actions.
 * The handlers ensure type safety by specifying the expected action type and payload.
 *
 * @example
 * ```typescript
 * // counterTypes.ts
 * export const COUNTER_ACTIONS = {
 *   INCREMENT: 'INCREMENT',
 *   ADD: 'ADD',
 * } as const;
 *
 * // counterPayloads.ts
 * interface CounterPayloads {
 *   [COUNTER_ACTIONS.INCREMENT]: undefined;
 *   [COUNTER_ACTIONS.ADD]: { amount: number };
 * }
 *
 * // counterActions.ts
 * import { createActionForPayloads } from 'path-to-your-createAction';
 * import { COUNTER_ACTIONS } from './counterTypes';
 * import { CounterPayloads } from './counterPayloads';
 *
 * const createAction = createActionForPayloads<CounterPayloads>();
 *
 * export const increment = createAction(COUNTER_ACTIONS.INCREMENT);
 * export const add = createAction(COUNTER_ACTIONS.ADD);
 *
 * // counterReducer.ts
 * import { createReducer } from 'path-to-your-createReducer';
 * import { CounterPayloads } from './counterPayloads';
 * import { ActionHandlers } from 'path-to-your-types';
 * import { COUNTER_ACTIONS } from './counterTypes';
 *
 * interface CounterState {
 *   count: number;
 * }
 *
 * const initialState: CounterState = { count: 0 };
 *
 * const counterHandlers: ActionHandlers<CounterState, CounterPayloads> = {
 *   [COUNTER_ACTIONS.INCREMENT]: (state) => ({ count: state.count + 1 }),
 *   [COUNTER_ACTIONS.ADD]: (state, action) => ({ count: state.count + action.payload.amount }),
 * };
 *
 * export const counterReducer = createReducer<CounterState, CounterPayloads>(initialState, counterHandlers);
 *
 * // store.ts
 * import { createStore } from 'redux';
 * import { counterReducer } from './counterReducer';
 *
 * const store = createStore(counterReducer);
 *
 * // Usage in a component or middleware
 * import { increment, add } from './counterActions';
 *
 * store.dispatch(increment());
 * // State is now { count: 1 }
 *
 * store.dispatch(add({ amount: 5 }));
 * // State is now { count: 6 }
 * ```
 */
export const createReducer = <State, Payloads extends PayloadsTree>(
  initialState: State,
  handlers: ActionHandlers<State, Payloads>
): ((state: State | undefined, action: any) => State) => {
  // Reducer function
  return (state = initialState, action: any): State => {
    const handler = handlers[action.type as Extract<keyof Payloads, string>];
    if (handler) {
      return handler(state, action);
    }
    return state;
  };
};

/**
 * A utility function for creating type-safe action handlers for a Redux reducer.
 *
 * This function returns another function that accepts a set of action handlers.
 * These handlers are automatically typed based on the `State` and `Payloads` provided.
 *
 * Each handler function is responsible for updating the state in response to a specific action.
 * The function provides strong typing for both actions with payloads and actions without payloads,
 * ensuring type safety when defining how each action affects the state.
 *
 * ### Example usage:
 * ```typescript
 * const handlers = createHandlers<State, Payloads>()({
 *   INCREMENT: (state) => ({ ...state, count: state.count + 1 }),
 *   SET_NAME: (state, action) => ({ ...state, name: action.payload.name })
 * });
 * ```
 *
 * @template State - The type of the state that the reducer manages.
 * @template Payloads - An object where the keys are action types (as strings) and the values represent
 *                      the payload type for each action. If an action doesn't have a payload, the value should be `undefined`.
 *
 * @returns {function} A function that takes an object of handlers as an argument.
 *                     Each handler function will be type-checked based on the payload type for the corresponding action.
 *                     It ensures that:
 *                     - For actions without a payload, the handler accepts only the state.
 *                     - For actions with a payload, the handler accepts both the state and the action containing the payload.
 *
 * @template Handlers - Represents the set of handlers that this function will manage. The keys correspond to action types, and
 *                      the values are functions that handle how each action modifies the state. The handlers must adhere to
 *                      the following rules:
 *                      - If the action type has no payload (`undefined`), the handler accepts only the `state`.
 *                      - If the action type has a payload, the handler accepts both `state` and `action`.
 *
 * @param {Handlers} handlers - An object mapping action types to their corresponding handler functions.
 *                              Each handler defines how a specific action modifies the state.
 *                              The type of each handler is inferred based on whether the action type has a payload or not.
 *
 * @returns {Handlers} - Returns the handlers passed to the function, ensuring type safety.
 */
export const createHandlers = <State, Payloads extends PayloadsTree>() => {
  return function <
    Handlers extends {
      [Type in Extract<
        keyof Payloads,
        string
      >]: Payloads[Type] extends undefined
        ? (state: State) => State
        : (
            state: State,
            action: ActionWithPayload<Type, Payloads[Type]>
          ) => State;
    }
  >(handlers: Handlers): Handlers {
    return handlers;
  };
};
