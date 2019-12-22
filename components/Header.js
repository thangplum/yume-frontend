import React, { useEffect } from "react";
import Link from "next/link";
import { withRouter } from "next/router";
import YumeLogo from "../icons/logo.svg";
import User from "./User";
import { useApolloClient } from "@apollo/react-hooks";
import { logout } from "../lib/auth";
import { SearchBox } from ".";
import { useState } from "react";

const MobileNav = ({ router }) => (
  <div className="sm:hidden w-screen flex justify-center ">
    <a className="mx-2 text-center font-bold text-4xl inline-block cursor-pointer hover:text-black">
      yume
    </a>
  </div>
);

function AccountDropDown({ user, router }) {
  const [accountOpen, setAccountOpen] = useState(false);
  const client = useApolloClient();

  const _handleRouteChange = () => {
    setAccountOpen(false);
  };

  useEffect(() => {
    router.events.on("routeChangeStart", _handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", _handleRouteChange);
    };
  }, []);

  return (
    <div className="relative block ml-8 mt-1 rounded hover:bg-gray-200 px-2 py-1 sm:mt-0 sm:ml-2">
      <button
        onMouseDown={e => {
          e.preventDefault();
          setAccountOpen(!accountOpen);
        }}
        onMouseEnter={() => setAccountOpen(true)}
      >
        <div className="flex items-center mr-1 font-medium">
          Account <ChevronDownSvg />
        </div>
      </button>
      <ul
        className={
          (!accountOpen ? "hidden " : "") +
          " z-50 absolute top-0 left-0 mt-8 bg-white border shadow-md rounded-lg flex flex-col items-start "
        }
        onMouseLeave={() => setAccountOpen(false)}
      >
        <Link href="/profile/[username]" as={`/profile/${user.username}`}>
          <a
            className={`flex w-full px-4 py-3 hover:bg-gray-200 ${
              router && router.pathname.split("/")[1] === "profile"
                ? " text-yume-red"
                : ""
            }`}
          >
            Profile
          </a>
        </Link>

        <Link href="/bookmarks">
          <a
            className={`flex w-full px-4 py-3 hover:bg-gray-200 ${
              router && router.pathname.split("/")[1] === "bookmarks"
                ? " text-yume-red"
                : ""
            }`}
          >
            Bookmarks
          </a>
        </Link>
        <Link href="/settings">
          <a
            className={`flex w-full px-4 py-3 hover:bg-gray-200 ${
              router && router.pathname.split("/")[1] === "settings"
                ? " text-yume-red"
                : ""
            }`}
          >
            Settings
          </a>
        </Link>

        <li className="flex w-full px-4 py-3 hover:bg-gray-200 ">
          <button className="font-medium" onClick={() => logout(client)}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

const NavLogo = ({ router }) => (
  <Link href="/">
    <a className="flex mr-3 text-center font-black  text-xl inline-block cursor-pointer items-center hover:text-black">
      <img
        className={
          "w-8 h-8 inline-block " +
          (router && router.pathname === "/" ? "mr-4  w-10 h-10" : " mr-2")
        }
        src={YumeLogo}
      />
      <p className={"text-base  " + (router && router.pathname === "/" ? "sm:text-2xl" : "sm:text-xl")}>
        yume
      </p>
    </a>
  </Link>
);
function Header({ router }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <User>
      {({ data, error }) => {
        const me = data ? data.whoami : null;
        return (
          <header className="container mx-auto sm:flex sm:justify-between sm:items-center bg-white">
            {/* Header for very small sizes (only logo) */}
            {/* <MobileNav router={router} /> */}
            {/* Header for small and anything bigger */}
            <div className="flex justify-between py-4 px-2 items-center">
              <div className="sm:w-4/12">
                <NavLogo router={router} />
              </div>
              {router && router.pathname !== "/" && (
                <div className="flex items-center px-7 sm:w-4/12 sm:px-20">
                  <SearchBox />
                </div>
              )}
              <div className="px-2 sm:w-4/12 sm:p-0">
                <button onClick={() => setOpen(!isOpen)} type="button" className="sm:hidden block text-gray hover:text-gray-500 focus:text-gray-500 focus:outline-none items-center">
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                    {isOpen ? 
                    <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/> 
                    : 
                    <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/>}
                  </svg>
                </button>
              </div>
            </div>
            <div className={"px-2 pt-2 pb-4 sm:p-0 sm:mr-6 font-medium sm:flex sm:items-center sm:justify-end w-4/12 font-medium text-black" + (isOpen ? " block" : " hidden")}>
                <div>
                  {me && <AccountDropDown user={me} router={router} />}
                </div>
                {!me && (
                  <Link href="/login">
                    <a
                      href="/login"
                      className={
                        "block ml-8 mt-1 rounded hover:bg-gray-200 px-2 py-1 sm:mt-0 sm:ml-2 " +
                        (router && router.pathname === "/login"
                          ? "text-yume-red"
                          : "")
                      }
                    >
                      Log In
                    </a>
                  </Link>
                )}
                <Link href="/forum">
                  <a
                    className={
                      "block ml-8 mt-1 rounded hover:bg-gray-200 px-2 py-1 sm:mt-0 sm:ml-2 " +
                      (router && router.pathname === "/forum"
                        ? "text-yume-red"
                        : "")
                    }
                  >
                    Forum
                  </a>
                </Link>
              </div>
          </header>
        );
      }}
    </User>
  );
}

Header.defaultProps = {
  router: { pathname: "/" }
};

const ChevronDownSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-chevron-down"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);
export default withRouter(Header);
