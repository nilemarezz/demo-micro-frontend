import React from "react";
import { mount } from "auth/AuthApp";
import { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

const AuthApp = ({ setIsSignin }) => {
  const ref = useRef(null);
  const history = useHistory();

  useEffect(() => {
    const { onParentNavigate } = mount(ref.current, {
      initialPath: history.location.pathname,
      onNavigate: ({ pathname: nextPathname }) => {
        const { pathname } = history.location;
        if (pathname !== nextPathname) {
          history.push(nextPathname);
        }
      },
      onAuthChange: (token) => {
        if (token) {
          setIsSignin(true);
        }
      },
    });

    history.listen(onParentNavigate);
  }, []);

  return <div ref={ref}></div>;
};

export default AuthApp;
