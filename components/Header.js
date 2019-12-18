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
    <div className="relative pl-4">
      <button
        onMouseDown={e => {
          e.preventDefault();
          setAccountOpen(!accountOpen);
        }}
        onMouseEnter={() => setAccountOpen(true)}
      >
        <div className="flex items-center mr-1 font-semibold">
          Account
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
        </div>
      </button>
      <ul
        className={
          (!accountOpen ? "hidden " : "") +
          " z-50 absolute top-0 left-0 mt-8 bg-white border shadow-md py-4 rounded-lg flex flex-col items-start "
        }
        onMouseLeave={() => setAccountOpen(false)}
      >
        <Link href="/profile/[username]" as={`/profile/${user.username}`}>
          <a
            className={`px-4 mb-4 hover:text-yume-red ${
              router && router.pathname.split("/")[1] === "profile"
                ? " text-yume-red"
                : ""
            }`}
          >
            Profile
          </a>
        </Link>

        <Link href="/settings">
          <a
            className={`px-4 mb-4 hover:text-yume-red ${
              router && router.pathname.split("/")[1] === "settings"
                ? " text-yume-red"
                : ""
            }`}
          >
            Settings
          </a>
        </Link>

        {/* <li className="w-full h-0 border border-gray-400 mb-1"></li> */}
        <li className="px-4  hover:text-yume-red ">
          <button className="font-semibold" onClick={() => logout(client)}>
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
      <p className={router && router.pathname === "/" ? "text-2xl" : "text-xl"}>
        yume
      </p>
    </a>
  </Link>
);
function Header({ router }) {
  return (
    <User>
      {({ data, error }) => {
        const me = data ? data.whoami : null;
        return (
          <div className="bg-white">
            <header className="container mx-auto">
              {/* Header for very small sizes (only logo) */}
              <MobileNav router={router} />
              {/* Header for small and anything bigger */}
              <div className="hidden sm:flex justify-between py-5 mx-12 items-center">
                <div className="ml-6 flex w-4/12">
                  <NavLogo router={router} />
                </div>
                {router && router.pathname !== "/" && (
                  <div className="flex items-center justify-center w-4/12">
                    <SearchBox />
                  </div>
                )}
                <div className="mr-6 font-medium flex items-ceneter justify-end w-4/12 font-semibold text-black">
                  <div>
                    {me && <AccountDropDown user={me} router={router} />}
                  </div>
                  {!me && (
                    <Link href="/login">
                      <a
                        href="/login"
                        className={
                          "ml-8 " +
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
                        "ml-8 " +
                        (router && router.pathname === "/forum"
                          ? "text-yume-red"
                          : "")
                      }
                    >
                      Forum
                    </a>
                  </Link>
                </div>
              </div>
            </header>
          </div>
        );
      }}
    </User>
  );
}

Header.defaultProps = {
  router: { pathname: "/" }
};

export default withRouter(Header);
