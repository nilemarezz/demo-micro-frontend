import React, { lazy, Suspense, useState } from "react";
import Header from "./components/Header";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";

const MarketingLazy = lazy(() => import("./components/MarketingApp"));
const AuthLazy = lazy(() => import("./components/AuthApp"));

const generateClassName = createGenerateClassName({
  productionPrefix: "co",
});

export default function App() {
  const [isSignin, setIsSignin] = useState(false);

  const onSignOut = () => {
    setIsSignin(false);
  };
  return (
    <div>
      <BrowserRouter>
        <StylesProvider generateClassName={generateClassName}>
          <div>
            <Header isSignin={isSignin} onSignOut={onSignOut} />
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route path="/auth">
                  <AuthLazy setIsSignin={setIsSignin} />
                </Route>
                <Route path="/">
                  <MarketingLazy />
                </Route>
              </Switch>
            </Suspense>
          </div>
        </StylesProvider>
      </BrowserRouter>
    </div>
  );
}
