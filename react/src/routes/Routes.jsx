import { createBrowserRouter } from "react-router";
import Root from "../layout/Root";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SIgnUp from "../pages/SIgnUp";
import BrowseBooks from "../pages/BrowseBooks";
import BookDetails from "../pages/BookDetails";
import MyReserve from "../pages/MyReserve";
import PrivateRoutes from "./PrivateRoutes";
import UserPage from "../pages/UserPage";
import ChangePassword from "../pages/ChangePassword";
import AdminLayout from "../layout/AdminLayout";
import ManageBook from "../pages/admin/ManageBook";
import EditBook from "../pages/admin/EditBook";
import IssueBook from "../pages/admin/IssueBook";
import MyIssue from "../pages/MyIssue";
import ManageIssueBook from "../pages/admin/ManageIssueBook";
import AdminProtected from "./AdminProtected";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SIgnUp />,
      },
      {
        path: "/books",
        element: <BrowseBooks />,
      },
      {
        path: "/books/:id",
        element: (
          <PrivateRoutes>
            <BookDetails />
          </PrivateRoutes>
        ),
      },
      {
        path: "/reserve/my",
        element: (
          <PrivateRoutes>
            <MyReserve />
          </PrivateRoutes>
        ),
      },
      {
        path: "/user/profile",
        element: (
          <PrivateRoutes>
            <UserPage />
          </PrivateRoutes>
        ),
      },
      {
        path: "/passwordchange",
        element: (
          <PrivateRoutes>
            <ChangePassword />
          </PrivateRoutes>
        ),
      },
      {
        path: "/issues/my",
        element: (
          <PrivateRoutes>
            <MyIssue />
          </PrivateRoutes>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminProtected><AdminLayout /></AdminProtected>,
    children: [
      {
        path: "manage-book",
        element: <ManageBook />,
      },
      {
        path: "edit/book/:id",
        element: <EditBook />,
      },
      {
        path: "issue-book",
        element: <IssueBook />,
      },
      {
        path: "manage-issue",
        element: <ManageIssueBook />,
      },
    ],
  },
]);

export default router;
