import { createBrowserRouter } from "react-router";
import Root from "../layout/Root";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import BrowseBooks from "../pages/BrowseBooks";
import BookDetails from "../pages/BookDetails";
import MyReserve from "../pages/MyReserve";
import PrivateRoutes from "./PrivateRoutes";
import StaffRoutes from "./StaffRoutes";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";




const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children:[
        {
            path:"/",
            element:<Home/>
        },
        {
            path:'/login',
            element:<Login/>
        },
        {
          path:"/signup",
          element:<Signup/>
        },
        {
          path:'/books',
          element:<BrowseBooks/>
        },
        {
          path:'/books/:id',
          element:<BookDetails/>
        },
        {
          path:'/reserve/my',
          element:<PrivateRoutes><MyReserve/></PrivateRoutes>
        },
        {
          path:'/dashboard',
          element:<StaffRoutes><Dashboard/></StaffRoutes>
        },
        {
          path:'/profile',
          element:<PrivateRoutes><Profile/></PrivateRoutes>
        },
    ]
  },
]);

export default router;