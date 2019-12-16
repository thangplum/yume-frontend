import React from "react";
import Link from "next/link";
import { withRouter } from "next/router";
import YumeLogo from "../icons/logo.svg";
import User from "./User";
import { useApolloClient } from "@apollo/react-hooks";
import { logout } from "../lib/auth";
import { SearchBox } from ".";
import { useState } from "react";

function Header({ router }) {
  const client = useApolloClient();
  const [accountOpen, setAccountOpen] = useState(false);

  router.events.on("routeChangeStart", () => {
    setAccountOpen(false);
  });
  return (
    <User>
      {({ data, error }) => {
        const me = data ? data.whoami : null;
        return (
          <div className="bg-white">
            <header className="container mx-auto">
              {/* Header for very small sizes (only logo) */}
              <div className="sm:hidden w-screen flex justify-center ">
                <a className="mx-2 text-center font-bold text-4xl inline-block cursor-pointer hover:text-black">
                  yume
                </a>
              </div>
              {/* Header for small and anything bigger */}
              <div className="hidden sm:flex justify-between py-5 mx-12 items-center">
                <div className="ml-6 flex w-4/12">
                  <Link href="/">
                    <a className="flex mr-3 text-center font-black  text-xl inline-block cursor-pointer items-center hover:text-black">
                      <img
                        className={
                          "w-8 h-8 inline-block " +
                          (router && router.pathname === "/"
                            ? "mr-4  w-10 h-10"
                            : " mr-2")
                        }
                        src={YumeLogo}
                      />
                      <p
                        className={
                          router && router.pathname === "/"
                            ? "text-2xl"
                            : "text-xl"
                        }
                      >
                        yume
                      </p>
                    </a>
                  </Link>
                </div>
                {router && router.pathname !== "/" && (
                  <div className="flex items-center justify-center w-4/12">
                    <SearchBox />
                  </div>
                )}
                <div className="mr-6 font-medium flex items-ceneter justify-end w-4/12">
                  {/* <Link href="/about">
                    <a
                      className={
                        "ml-8 " +
                        (router && router.pathname === "/about"
                          ? "text-yume-red"
                          : "")
                      }
                    >
                      About
                    </a>
                  </Link> */}
                  <div>
                    {me && (
                      <div className="relative pl-4">
                        <button
                          onMouseDown={e => {
                            e.preventDefault();
                            setAccountOpen(!accountOpen);
                          }}
                          onMouseEnter={() => setAccountOpen(true)}
                        >
                          <span className="mr-1"> Account </span>
                          <i className="fas fa-angle-down"></i>
                        </button>
                        <ul
                          className={
                            (!accountOpen ? "hidden " : "") +
                            " z-50 absolute top-0 left-0 mt-8 bg-white border shadow-md py-4 rounded-lg flex flex-col items-start text-gray-700"
                          }
                          onMouseLeave={() => setAccountOpen(false)}
                        >
                          <Link
                            href="/profile/[username]"
                            as={`/profile/${me.username}`}
                          >
                            <a className="px-4 mb-4 hover:text-yume-red">
                              Profile
                            </a>
                          </Link>

                          <Link href="/settings">
                            <a className="px-4 mb-4 hover:text-yume-red">
                              Settings
                            </a>
                          </Link>

                          {/* <li className="w-full h-0 border border-gray-400 mb-1"></li> */}
                          <li className="px-4  hover:text-yume-red">
                            <button onClick={() => logout(client)}>
                              Logout
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                  {!me && (
                    <Link href="/login">
                      <a
                        href="#"
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
                  {/* <a className="ml-8">
                    <svg
                      className="w-5 h-5 m-auto fill-current text-yume-red"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 18 18"
                    >
                      <path d="M17.946 5.29a6.606 6.606 0 0 0-.418-2.185 4.412 4.412 0 0 0-1.039-1.594A4.412 4.412 0 0 0 14.895.472a6.606 6.606 0 0 0-2.184-.418C11.75.01 11.444 0 9 0S6.25.01 5.29.054a6.606 6.606 0 0 0-2.185.418A4.412 4.412 0 0 0 1.51 1.511 4.412 4.412 0 0 0 .472 3.105a6.606 6.606 0 0 0-.418 2.184C.01 6.25 0 6.556 0 9s.01 2.75.054 3.71a6.606 6.606 0 0 0 .418 2.185 4.412 4.412 0 0 0 1.039 1.594 4.411 4.411 0 0 0 1.594 1.039 6.606 6.606 0 0 0 2.184.418C6.25 17.99 6.556 18 9 18s2.75-.01 3.71-.054a6.606 6.606 0 0 0 2.185-.418 4.602 4.602 0 0 0 2.633-2.633 6.606 6.606 0 0 0 .418-2.184C17.99 11.75 18 11.444 18 9s-.01-2.75-.054-3.71zm-1.62 7.347a4.978 4.978 0 0 1-.31 1.67 2.98 2.98 0 0 1-1.708 1.709 4.979 4.979 0 0 1-1.671.31c-.95.043-1.234.052-3.637.052s-2.688-.009-3.637-.052a4.979 4.979 0 0 1-1.67-.31 2.788 2.788 0 0 1-1.036-.673 2.788 2.788 0 0 1-.673-1.035 4.978 4.978 0 0 1-.31-1.671c-.043-.95-.052-1.234-.052-3.637s.009-2.688.052-3.637a4.979 4.979 0 0 1 .31-1.67 2.788 2.788 0 0 1 .673-1.036 2.788 2.788 0 0 1 1.035-.673 4.979 4.979 0 0 1 1.671-.31c.95-.043 1.234-.052 3.637-.052s2.688.009 3.637.052a4.979 4.979 0 0 1 1.67.31 2.788 2.788 0 0 1 1.036.673 2.788 2.788 0 0 1 .673 1.035 4.979 4.979 0 0 1 .31 1.671c.043.95.052 1.234.052 3.637s-.009 2.688-.052 3.637zM9 4.378A4.622 4.622 0 1 0 13.622 9 4.622 4.622 0 0 0 9 4.378zM9 12a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm5.884-7.804a1.08 1.08 0 1 1-1.08-1.08 1.08 1.08 0 0 1 1.08 1.08z" />
                    </svg>
                  </a> */}
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
