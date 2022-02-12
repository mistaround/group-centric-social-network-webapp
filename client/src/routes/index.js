import Login from "../pages/Login";
import Home from "../components/Home/Home";
import PageNotFound from "../pages/PageNotFound";
import Group from "../components/Group/Group";
import Register from "../pages/Register";
import Chat from "../pages/Chat";
import CreatePost from "../components/Post/CreatePost";
import Forbidden from "../pages/Forbidden";
import Notification from "../pages/Notification";
import CreateGroup from "../components/Group/CreateGroup";
import AccountSettings from "../components/User/AccountSettings";
import GroupProfile from "../components/Group/GroupProfile";
import PostDetail from "../components/Post/PostDetail";
import PersonalProfile from "../components/User/PersonalProfile";

export const mainRoutes = [
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/404",
    component: PageNotFound,
  },
  {
    path: "/403",
    component: Forbidden,
  },
  {
    path: "/register",
    component: Register,
  },
];

export const userRoutes = [
  {
    path: "/user/home",
    component: Home,
  },
  {
    path: "/user/group/:id",
    component: Group,
  },
  {
    path: "/user/chat",
    component: Chat,
  },
  {
    path: "/user/notification",
    component: Notification,
  },
  {
    path: "/user/create_post",
    component: CreatePost,
  },
  {
    path: "/user/create_group",
    component: CreateGroup,
  },
  {
    path: "/user/settings",
    component: AccountSettings,
  },
  {
    path: "/user/group",
    component: GroupProfile,
    exact: true,
  },
  {
    path: "/user/post/:id",
    component: PostDetail,
  },
  {
    path: "/user/:id",
    component: PersonalProfile,
  },
];
