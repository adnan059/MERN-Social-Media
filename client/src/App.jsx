import React from "react";
import Smedia from "./Smedia/Smedia";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./Smedia/redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <Smedia />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;
