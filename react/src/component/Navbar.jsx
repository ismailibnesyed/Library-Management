import React, { useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../context/AuthProvider";

const Navbar = () => {
  const { authUser, logout } = useContext(AuthContext);
  console.log(authUser);

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              aria-label="Menu"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li>
              <Link to={"/books"}>Browse Books</Link>
            </li>
            {authUser && (
              <li>
                <Link to={"/reserve/my"}>My Reserve</Link>
              </li>
            )}
            {authUser && (
              <li>
                <Link to={"/issues/my"}>My Issue</Link>
              </li>
            )}
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/books"}>Browse Books</Link>
          </li>
          {authUser && (
            <li>
              <Link to={"/reserve/my"}>My Reserve</Link>
            </li>
          )}
          {authUser && (
            <li>
              <Link to={"/issues/my"}>My Issue</Link>
            </li>
          )}
        </ul>
      </div>
      <div className="navbar-end">
        {authUser ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn m-1">
              {authUser?.username} Login ⬇️
            </div>
            <ul
              tabIndex={-1}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              {authUser?.role === "librarian" && (
                <li>
                  <Link to={"/admin/manage-book"}>Admin Profile</Link>
                </li>
              )}
              <li>
                <Link to={"/user/profile"}>Profile</Link>
              </li>
              <li>
                <Link to={"/passwordchange"}>Change Password</Link>
              </li>
              <li>
                <button onClick={logout} className="btn cursor-pointer">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to={"/login"} className="btn cursor-pointer">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
