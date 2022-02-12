import React, { useEffect } from "react";
import "./App.less";
import jwtDecode from "jwt-decode";
import { Switch, Route, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userRoutes } from "./routes/index";
import { isLogined, getToken } from "./utils/auth";
import setCurrentUser from "./store/action/user";
import socket from "./utils/socket";
import TopBar from "./components/TopBar/TopBar";

function App() {
  if (isLogined()) {
    // Redux
    const dispatch = useDispatch();

    // Decode token stored in local storage
    const tokenCoded = getToken();
    const tokenDecoded = jwtDecode(tokenCoded);

    // AddUser
    useEffect(() => {
      if (tokenDecoded) {
        // Set user in global state
        dispatch(setCurrentUser(tokenDecoded));
        socket.emit("addUser", tokenDecoded._id);
      }
    }, [tokenDecoded]);
  }

  return isLogined() ? (
    <div className="App">
      <TopBar />
      <Switch>
        {userRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            exact={route.exact}
            render={(routeProps) => <route.component {...routeProps} />}
          />
        ))}
        <Redirect to="/404" from="/user/post" exact />
        <Redirect to={userRoutes[0].path} from="/" />
        <Redirect to="/404" />
      </Switch>
    </div>
  ) : (
    <Redirect to="/login" />
  );
}

export default App;
