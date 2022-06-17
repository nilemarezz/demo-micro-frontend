## Connect Frontend App

### Stack
1. React
2. Webpack Module Federation

### Step
1. Create child service and expose it
2. Create container service and request for the child service and mount it

### Create Child App with React
1. Init React App using babel and webpack [(link)](https://medium.com/age-of-awareness/setup-react-with-webpack-and-babel-5114a14a47e9)
2. Create public/index.html for dev the service (dev only)
```html
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div id="_auth-dev-root"></div>
  </body>
</html>
```
3. Create src/index.js and src/bootstrap.js for render the react app to the html
```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// Mount function to start up the app
const mount = (el) => {
  ReactDOM.render(<App/>, el);
};

// If we are in development and in isolation,
// call mount immediately
if (process.env.NODE_ENV === "development") {
  const devRoot = document.querySelector("#_marketing-dev-root");

  if (devRoot) {
    mount(devRoot, { defaultHistory: createBrowserHistory() });
  }
}

// We are running through container
// and we should export the mount function
export { mount };
```
4. create config/webpack.dev.js then mount react to html and expose it
```js
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const commonConfig = require("./webpack.common");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const packageJson = require("../package.json");
const devConfig = {
  // config the react app server 
  mode: "development",
  output: {
    publicPath: "http://localhost:8082/",
  },
  devServer: {
    port: 8082,
    historyApiFallback: {
      index: "index.html",
    },
  },
  plugins: [
    // Mount index.js to index.html (run js file in html) 
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    // expose the service and shared dependency
    new ModuleFederationPlugin({
        name: "marketing",
        filename: "remoteEntry.js",
        exposes: {
            "./MarketingApp": "./src/bootstrap",
        },
        shared: packageJson.dependencies,
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);
```

### Create Container App with React
1. Init React App using babel and webpack [(link)](https://medium.com/age-of-awareness/setup-react-with-webpack-and-babel-5114a14a47e9)
2. Create public/index.html
```html
<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div id="root"></div>
    </body>
</html>
```
3. Create config/webpack.dev.js for mount react app and get tie child service
```js
const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const packageJson = require("../package.json");

const devConfig = {
  mode: "development",
  output: {
    publicPath: "http://localhost:8080/",
  },
  devServer: {
    port: 8080,
    historyApiFallback: {
      index: "index.html",
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "container",
      remotes: {
        marketing: "marketing@http://localhost:8081/remoteEntry.js",
      },
      shared: packageJson.dependencies,
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);
```
4. import and mount child service to react component
```js
import React from "react";
import { mount } from "marketing/MarketingApp";
import { useEffect, useRef } from "react";

const MarketingApp = () => {
  const ref = useRef(null);

  useEffect(() => {
    mount(ref.current)
  }, []);

  return <div ref={ref}></div>;
};

export default MarketingApp;
```