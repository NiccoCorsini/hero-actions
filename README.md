# hero-actions

A powerful TypeScript library designed to streamline the creation of type-safe Redux action creators and reducers. With **hero-actions**, you can reduce boilerplate code, improve type safety, and write cleaner, more maintainable Redux logic.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
  - [Defining Action Types](#defining-action-types)
  - [Defining Payload Types](#defining-payload-types)
  - [Creating Action Creators](#creating-action-creators)
  - [Dispatching Actions](#dispatching-actions)
  - [Creating Reducers](#creating-reducers)
  - [Compatibility](#compatibility)
- [API Reference](#api-reference)
  - [createActionForPayloads](#createactionforpayloads)
  - [createReducer](#createreducer)
  - [Why Use hero-actions?](#why-use-hero-actions)
- [License](#license)

## Introduction

**hero-actions** is a TypeScript-first library built to improve the Redux development experience by providing type-safe utilities for creating action creators and reducers. In typical Redux applications, developers often encounter repetitive patterns and a lack of strong type safety when handling actions and state. **hero-actions** eliminates these issues by leveraging TypeScript's advanced type system, allowing you to define actions with their corresponding payloads and reducers in a way that ensures correctness at compile time.

With **hero-actions**, you'll benefit from:

- **Automatic type inference** for actions and their payloads, reducing the chance of runtime errors.
- **Less boilerplate**: Avoid repetitive switch statements and manual action typing.
- **Enhanced readability and maintainability**: By focusing on defining clear action creators and handlers, your code becomes more modular and easier to reason about.
- **Seamless integration** with Redux and Redux Toolkit, fitting naturally into your existing Redux architecture.

## Installation

To install **hero-actions**, run:

```bash
npm install hero-actions
```

## Features

- **Type-safe action creators**: Create actions with the correct type and payload.
- **Simplified reducers**: Define reducers with type-safe handlers for each action.
- **Minimal boilerplate**: Reduce repetitive code in your Redux setup.
- **Modular support**: Easily integrate with modular Redux stores using `combineReducers`.

## Usage

### Defining Action Types

Start by defining your action types using an `enum` for better type safety and auto-completion.

Example:

Define an enum like `AuthActionTypes` with the following action types:

```typescript
// definitions/actions/auth.ts

enum AuthActionTypes {
  LOGIN_REQUEST = "auth/LOGIN_REQUEST",
  LOGIN_SUCCESS = "auth/LOGIN_SUCCESS",
  LOGIN_FAILURE = "auth/LOGIN_FAILURE",
  LOGOUT = "auth/LOGOUT",
}
```

### Defining Payload Types

Create an interface `AuthPayloads` mapping each action type to its payload:

```typescript
// definitions/actions/auth.ts

export interface AuthActionsPayloads {
  [AuthActionTypes.LOGIN_REQUEST]: { username: string; password: string };
  [AuthActionTypes.LOGIN_SUCCESS]: { userId: string; token: string };
  [AuthActionTypes.LOGIN_FAILURE]: { error: Error };
  [AuthActionTypes.LOGOUT]: undefined; // No payload for logout
}
```

### Creating Action Creators

Use `createActionForPayloads` to generate action creators for your actions.

Example:

```typescript
// store/actions/auth.ts

import { createActionForPayloads } from "hero-actions"; // Assuming hero-actions is installed
import { AuthActionTypes, AuthPayloads } from "../../definitions/actions/auth";

// Create a factory function for action creators
const createAuthAction = createActionForPayloads<AuthPayloads>();

// Create action creators
export const loginRequest = createAuthAction(AuthActionTypes.LOGIN_REQUEST);
export const loginSuccess = createAuthAction(AuthActionTypes.LOGIN_SUCCESS);
export const loginFailure = createAuthAction(AuthActionTypes.LOGIN_FAILURE);
export const logout = createAuthAction(AuthActionTypes.LOGOUT);
```

### Dispatching Actions

You can now dispatch actions with the correct payloads.

Example in React component:

```typescript
// components/MyComponent.tsx

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
} from "../../../store/actions/auth";

const MyComponent = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to handle login, triggered on button click
  const handleLogin = async () => {
    // Set loading state to true
    setLoading(true);

    // Dispatching login request with the entered credentials
    dispatch(loginRequest({ username, password }));

    try {
      // Perform the login API call
      const response = await fetch("https://exampleapi.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = "Login failed";
        dispatch(loginFailure({ error }));
        throw new Error(error);
      }

      // Parse the response data
      const { userId, token } = await response.json();

      // Dispatching login success with the received user data
      dispatch(loginSuccess({ userId, token }));

      // Simulate a logout after 3 seconds
      setTimeout(() => {
        dispatch(logout());
      }, 3000);
    } catch (error) {
      dispatch(loginFailure({ error }));
      console.error("Login failed", error);
      // You can dispatch a login failure action here if needed
    } finally {
      // Reset loading state after the process is done
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
};

export default MyComponent;
```

This example is purely for demonstration purposes to illustrate how to dispatch actions from a React component. However, it's important to note that API calls and other asynchronous side effects should not be handled directly within components.

For a clean, scalable, and maintainable architecture, we strongly recommend using middleware like **Redux-Saga** to handle asynchronous logic (such as API calls). Redux-Saga allows you to manage side effects in a more declarative manner, improving testability and separation of concerns.

By offloading side effects to sagas, you can ensure that your components remain pure and focused on rendering UI, while Redux-Saga handles the more complex asynchronous workflows.

### Why Use Redux-Saga?

- **Separation of Concerns**: Redux-Saga helps keep your components free of side effects like API calls, ensuring that they remain purely focused on rendering and state management.
- **Declarative Side Effects**: With sagas, you can define side effects in a way that's easy to follow, maintain, and test, which is crucial for building scalable applications.
- **Efficient Error Handling**: Redux-Saga makes it straightforward to manage errors and retries in a more resilient and robust way.
- **Perfect Integration**: `hero-actions` integrates seamlessly with Redux-Saga, making it a great companion to manage complex async workflows and side effects.

For more details on how to implement Redux-Saga, check out the official documentation:  
[Redux-Saga Documentation](https://redux-saga.js.org/).

By using Redux-Saga in combination with `hero-actions`, you can build a robust, scalable state management system with solid support for side effects and async logic.

### Creating Reducers

Define your initial state as an interface like `AuthState` with properties:

- `isAuthenticated: boolean`
- `userId?: string`
- `token?: string`
- `error?: Error` (just an error example type)

Set `initialState` as:

- `isAuthenticated` set to `false`

Define your action handlers using `createHandlers`, which helps you create type-safe handlers for each action and simplifies the reducer creation process.

Example:

```typescript
// store/reducers/auth.ts

import { createReducer, createHandlers } from "hero-actions";
import { AuthActionTypes, AuthPayloads } from "../../definitions/actions/auth";

// Define the state interface
export interface AuthState {
  isAuthenticated: boolean;
  userId?: string;
  token?: string;
  error?: Error;
}

// Set the initial state
const initialState: AuthState = {
  isAuthenticated: false,
};

// Define action handlers using createHandlers
const authHandlers = createHandlers<AuthState, AuthPayloads>()({
  [AuthActionTypes.LOGIN_REQUEST]: (state) => ({
    ...state,
    isAuthenticated: false, // Optionally set to false while logging in
  }),
  [AuthActionTypes.LOGIN_SUCCESS]: (state, action) => ({
    ...state,
    isAuthenticated: true,
    userId: action.payload.userId,
    token: action.payload.token,
  }),
  [AuthActionTypes.LOGIN_FAILURE]: (state, action) => ({
    ...state,
    isAuthenticated: false,
    error: action.payload.error,
  }),
  [AuthActionTypes.LOGOUT]: (state) => ({
    ...state,
    isAuthenticated: false,
    userId: undefined,
    token: undefined,
  }),
});

// Create the reducer
export const authReducer = createReducer<AuthState, AuthPayloads>(
  initialState,
  authHandlers
);
```

### Compatibility

**hero-actions** is compatible with both legacy Redux setups using `createStore` and modern approaches using `@reduxjs/toolkit`'s `configureStore`. This means you can easily integrate it into any Redux project, whether you're using `combineReducers` or the more modern `configureStore`.

#### Example with `createStore` and `combineReducers` (Legacy Redux)

If you're using the traditional `createStore` and `combineReducers`, you can integrate `hero-actions` without any issues. You can combine multiple reducers using `combineReducers`, such as `authReducer` and other reducers, and then create the store with `createStore`, passing in the combined reducers.

```typescript
// store.ts

import { legacy_createStore as createStore, combineReducers } from "redux";
import { authReducer } from "./authReducer";
// Import other reducers if you have them
// import { otherReducer } from './otherReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  // Include other reducers here
  // other: otherReducer,
});

const store = createStore(rootReducer);

export default store;
```

#### Example with `configureStore` from `@reduxjs/toolkit`

If you're using `@reduxjs/toolkit`'s more modern `configureStore`, `hero-actions` works seamlessly with this as well. In this case, you can configure the store by passing an object where each key represents a slice of the state, and each value is a reducer, such as `authReducer` and other reducers.

```typescript
// store.ts

import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authReducer";
// Import other reducers if you have them
// import { otherReducer } from './otherReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Include other reducers here
    // other: otherReducer,
  },
});

export default store;
```

### Key Benefits of Compatibility

- **Legacy Support**: If you're maintaining an older codebase that uses `createStore`, you can easily integrate `hero-actions` without breaking any existing functionality.
- **Modern Support**: For newer projects or refactoring efforts, `hero-actions` works perfectly with `@reduxjs/toolkit`, supporting `configureStore` for a cleaner, more maintainable setup.
- **Reducer Combination**: Both `combineReducers` and `configureStore` allow for combining multiple reducers, making `hero-actions` compatible with modular and scalable Redux architectures.

## API Reference

### `createActionForPayloads`

Creates a factory function for generating type-safe action creators.

**Usage:**

- Call `createActionForPayloads<YourPayloads>()` to get a `createAction` function.

**Parameters:**

- `YourPayloads`: An interface mapping action types to their payloads.

**Returns:**

A function that creates action creators for the specified action types.

### `createReducer`

Creates a type-safe reducer function with handlers for each action.

**Usage:**

- Call `createReducer<YourState, YourPayloads>(initialState, handlers)` to create a reducer.

**Parameters:**

- `initialState`: The initial state of your reducer.
- `handlers`: An object mapping action types to handler functions.

**Returns:**

A reducer function compatible with Redux.

## Why Use hero-actions?

**hero-actions** provides a range of benefits for Redux developers, especially those using TypeScript. Here are the key reasons to adopt it in your projects:

- **Type Safety**: Automatically infer types for actions and payloads, catching errors at compile time.

- **Reduced Boilerplate**: Avoid repetitive code in defining actions and reducers.

- **Modularity**: Easily manage modular Redux logic in larger applications.

- **Error Reduction**: Leverage TypeScript to reduce runtime errors and improve stability.

- **Easy Integration**: Seamlessly integrate with existing Redux projects and Redux Toolkit.

- **Readable and Maintainable Code**: Cleaner, more expressive code that’s easier to maintain.

- **Support for Async Operations**: Provides a structured approach to handling asynchronous actions.

## License

This project is licensed under the ISC License. See the LICENSE file for details.

---

Made with ❤️ by [Opentrentuno](https://opentrentuno.it).
