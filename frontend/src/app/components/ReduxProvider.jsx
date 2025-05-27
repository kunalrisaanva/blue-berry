"use client";
import { Provider } from "react-redux";
import { store } from "@/lib/store";

export default function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
// This component wraps the Redux store provider around the children components.
// It allows the components to access the Redux store and its state.
// The store is imported from the store.js file in the lib directory.
// The Provider component from react-redux is used to connect the store to the components.
// The children prop represents the components that will be wrapped by the provider.
// This is a common pattern in React applications that use Redux for state management.
