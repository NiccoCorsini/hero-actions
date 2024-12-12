import { createHandlers, createReducer } from "../src/reducer/reducer";
import {
  AuthActionsPayloads,
  loginFailure,
  loginRequest,
  loginSuccess,
} from "./createActionForPayloads.test";

/**
 * Interface defining the structure of the authentication state.
 * - `isAuthenticated`: Indicates if the user is authenticated.
 * - `status`: Represents the current status of the authentication process.
 * - `userId` (optional): The ID of the authenticated user.
 * - `token` (optional): The authentication token.
 * - `error` (optional): The error object in case of a failure.
 */
interface AuthState {
  isAuthenticated: boolean;
  status: "idle" | "loading" | "success" | "failure";
  userId?: string;
  token?: string;
  error?: Error;
}

/**
 * The initial state of the authentication reducer.
 * - `isAuthenticated` is set to false by default.
 * - `status` is set to `"idle"`, indicating no ongoing operation.
 */
const initialState: AuthState = {
  isAuthenticated: false,
  status: "idle",
};

/**
 * Handlers for managing the authentication state based on actions.
 * - `"auth/LOGIN_REQUEST"`: Sets the status to `"loading"`.
 * - `"auth/LOGIN_SUCCESS"`: Updates the state with user data and marks the login as successful.
 * - `"auth/LOGIN_FAILURE"`: Updates the state with the error and sets the status to `"failure"`.
 */
const handlers = createHandlers<AuthState, AuthActionsPayloads>()({
  "auth/LOGIN_REQUEST": (state) => ({
    ...state,
    status: "loading",
  }),
  "auth/LOGIN_SUCCESS": (state, action) => ({
    ...state,
    isAuthenticated: true,
    status: "success",
    userId: action.payload.userId,
    token: action.payload.token,
  }),
  "auth/LOGIN_FAILURE": (state, action) => ({
    ...state,
    status: "failure",
    error: action.payload.error,
  }),
});

/**
 * The authentication reducer combines the initial state and handlers.
 * It processes actions to update the authentication state accordingly.
 */
const authReducer = createReducer<AuthState, AuthActionsPayloads>(
  initialState,
  handlers
);

/**
 * Unit tests for the `authReducer`.
 * These tests verify that the reducer updates the state correctly for each action type.
 */
describe("authReducer", () => {
  it("should handle login request", () => {
    // Simulates a login request and verifies the state update
    const newState = authReducer(initialState, loginRequest());

    expect(newState).toEqual({
      ...initialState,
      status: "loading",
    });
  });

  it("should handle login success", () => {
    // Simulates a successful login and verifies the state update
    const newState = authReducer(
      initialState,
      loginSuccess({ userId: "test_user", token: "test_token" })
    );

    expect(newState).toEqual({
      ...initialState,
      isAuthenticated: true,
      status: "success",
      userId: "test_user",
      token: "test_token",
    });
  });

  it("should handle login failure", () => {
    // Simulates a login failure and verifies the state update
    const error = new Error("Invalid credentials");
    const newState = authReducer(initialState, loginFailure({ error }));

    expect(newState).toEqual({
      ...initialState,
      status: "failure",
      error,
    });
  });

  it("should ignore unknown actions", () => {
    // Ensures that unknown actions do not modify the state
    const action = { type: "unknown/action" };
    const newState = authReducer(initialState, action);

    expect(newState).toEqual(initialState);
  });
});
