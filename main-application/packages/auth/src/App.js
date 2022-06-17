import React from "react";
import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";
import { Router, Switch, Route } from "react-router-dom";
import Signin from "./components/Signin";
import Signup from "./components/Signup";

const genereateClassName = createGenerateClassName({
  productionPrefix: "ma",
});

export default ({ history, onAuthChange }) => {
  return (
    <>
      <StylesProvider generateClassName={genereateClassName}>
        <Router history={history}>
          <Switch>
            <Route exact path="/auth/signin">
              <Signin onSignIn={onAuthChange} />
            </Route>
            <Route exact path="/auth/signup">
              <Signup />
            </Route>
          </Switch>
        </Router>
      </StylesProvider>
      {/* <h1>hELLO</h1> */}
    </>
  );
};
