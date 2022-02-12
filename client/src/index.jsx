import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "antd/dist/antd.less";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";
import { mainRoutes } from "./routes/index";
import App from "./App";

import store from "./store/store";

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Redirect path="/" to="/user/home" exact />
        <Route path="/user" render={(routeProps) => <App {...routeProps} />} />
        {mainRoutes.map((route) => (
          <Route key={route.path} {...route} />
        ))}
        <Redirect to="/404" />
      </Switch>
    </Router>
    ,
  </Provider>,

  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
