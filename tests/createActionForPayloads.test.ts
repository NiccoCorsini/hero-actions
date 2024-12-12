import { createActionForPayloads } from "../src/actions/actions";

/**
 * Enumeration of authentication action types.
 * These action types define the different states of the authentication process
 * (e.g., login request, login success, login failure).
 */
enum AuthActionTypes {
  LOGIN_REQUEST = "auth/LOGIN_REQUEST",
  LOGIN_SUCCESS = "auth/LOGIN_SUCCESS",
  LOGIN_FAILURE = "auth/LOGIN_FAILURE",
}

/**
 * Interface defining the payload structure for each authentication action.
 * - LOGIN_REQUEST: No payload.
 * - LOGIN_SUCCESS: Contains the user ID and authentication token.
 * - LOGIN_FAILURE: Contains an error object.
 */
export interface AuthActionsPayloads {
  [AuthActionTypes.LOGIN_REQUEST]: undefined;
  [AuthActionTypes.LOGIN_SUCCESS]: { userId: string; token: string };
  [AuthActionTypes.LOGIN_FAILURE]: { error: Error };
}

// Factory function to create typed authentication actions
const createAuthAction = createActionForPayloads<AuthActionsPayloads>();

/**
 * Action creators for authentication.
 * - loginRequest: Action to initiate the login process.
 * - loginSuccess: Action to signify successful login with user data.
 * - loginFailure: Action to signify login failure with error details.
 */
export const loginRequest = createAuthAction(AuthActionTypes.LOGIN_REQUEST);
export const loginSuccess = createAuthAction(AuthActionTypes.LOGIN_SUCCESS);
export const loginFailure = createAuthAction(AuthActionTypes.LOGIN_FAILURE);

/**
 * Unit tests for the createActionForPayloads function.
 * These tests verify the correct creation of actions with and without payloads.
 */
describe("createActionForPayloads", () => {
  it("should create an action with only the type if no payload is provided", () => {
    // Test that the loginRequest action is created correctly without a payload
    const result = loginRequest();

    expect(result).toEqual({
      type: "auth/LOGIN_REQUEST",
    });
  });

  it("should create an action with the correct type and payload", () => {
    // Test that the loginSuccess action is created correctly with the provided payload
    const result = loginSuccess({ userId: "test_user", token: "test_token" });

    expect(result).toEqual({
      type: "auth/LOGIN_SUCCESS",
      payload: { userId: "test_user", token: "test_token" },
    });
  });

  it("should create an action with the correct type and payload", () => {
    // Test that the loginFailure action is created correctly with the provided payload
    const error = new Error("Invalid credentials");
    const result = loginFailure({ error });

    expect(result).toEqual({
      type: "auth/LOGIN_FAILURE",
      payload: { error },
    });
  });
});
