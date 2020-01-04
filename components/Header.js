import React, { useEffect, useCallback, useContext } from "react";
import Link from "next/link";
import { withRouter } from "next/router";
import YumeLogo from "../icons/logo.svg";
import User from "./User";
import { useApolloClient } from "@apollo/react-hooks";
import { logout } from "../lib/auth";
import { SearchBox, MobileSearchBox, SearchButton } from "./SearchBox";
import { slide as Menu } from "react-burger-menu";

import { useToggle, ToggleCtxProvider } from "../lib/custom-hooks";

const isPath = (router, path) =>
  router && router.pathname.split("/")[1] === path.split("/")[0];

const [MenuContext, MenuProvider] = ToggleCtxProvider();

const BurgerButton = ({ styles }) => {
  const ctx = useContext(MenuContext);

  return (
    <button style={styles.bmBurgerButton} onClick={ctx.toggleMenu}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
  );
};

const Sidebar = ({ styles, user, router }) => {
  const ctx = useContext(MenuContext);
  const {
    isOpen: accountOpen,
    setIsOpen: setAccountOpen,
    close,
    open,
    toggle
  } = useToggle(false);
  const client = useApolloClient();
  const _handleRouteChange = () => close();

  useEffect(() => {
    router.events.on("routeChangeStart", _handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", _handleRouteChange);
    };
  }, []);

  const SideBarButton = ({ children, path, toggleAccount, ...props }) => (
    <>
      <button
        className={
          "ripple w-full mt-2 text-xl outline-none focus:outline-none py-3" +
          (isPath(router, path) ? " text-yume-red" : "")
        }
        onClick={() =>
          setTimeout(() => {
            if (path === "account") {
              toggleAccount();
              return;
            }
            ctx.toggleMenu();
            router.push("/" + path);
          }, 400)
        }
        {...props}
      >
        {children}
      </button>
      <style jsx>{`
        .ripple {
          background-position: center;
          transition: background 0.8s;
        }
        .ripple:hover {
          background: #edf2f7
            radial-gradient(circle, transparent 1%, #edf2f7 1%) center/15000%;
        }
        .ripple:active {
          background-color: #a0aec0;
          background-size: 100%;
          transition: background 0s;
        }
      `}</style>
    </>
  );
  return (
    <Menu
      styles={styles}
      customBurgerIcon={false}
      isOpen={ctx.isMenuOpen}
      onStateChange={state => ctx.stateChangeHandler(state)}
      className={" shadow-xl pt-8 bg-white"}
    >
      <ul>
        <li id="forum">
          <SideBarButton path="forum">Forum</SideBarButton>
        </li>
        <li className="mt-1">
          {user && (
            <div className="w-full">
              <SideBarButton path="account" toggleAccount={() => toggle()}>
                <div className="w-full flex justify-center items-center text-xl">
                  Account <ChevronDownSvg />
                </div>
              </SideBarButton>
              <ul
                className={!accountOpen ? "hidden " : ""}
                style={{ paddingLeft: 18 }}
              >
                <SideBarButton path={`profile/${user.username}`}>
                  Profile
                </SideBarButton>
                <SideBarButton path="bookmarks">Bookmarks</SideBarButton>
                <SideBarButton path="settings">Settings</SideBarButton>
                <SideBarButton
                  path="logout"
                  onClick={() => {
                    ctx.toggleMenu();
                    logout(client);
                  }}
                >
                  Logout
                </SideBarButton>
              </ul>
            </div>
          )}
          {!user && <SideBarButton path="login">Log In</SideBarButton>}
        </li>
      </ul>
    </Menu>
  );
};

function MobileNav({ router, visible, setVisible, user, styles }) {
  const { isOpen: searchboxOpen, toggle: toggleSearch } = useToggle(false);
  const toggleSearchbar = () => toggleSearch();
  return (
    <div className="sm:hidden w-screen flex justify-center items-center border py-2 border-b-1 fixed z-50 bg-white mb-12">
      {!searchboxOpen && (
        <div>
          <MenuProvider>
            <div>
              <BurgerButton styles={styles} />
              <Sidebar
                styles={styles}
                user={user}
                router={router}
                visible={visible}
                setVisible={setVisible}
              />
            </div>
          </MenuProvider>

          <Link href="/">
            <a className="flex mx-2 -ml-2 text-center font-black  text-xl inline-block cursor-pointer items-center">
              <img
                className={"w-8 h-8 inline-block mr-4  w-10 h-10"}
                src={YumeLogo}
              />
              <p className="text-3xl">yume</p>
            </a>
          </Link>
          <SearchButton toggleSearchbar={toggleSearchbar} />
        </div>
      )}

      <MobileSearchBox
        searchboxOpen={searchboxOpen}
        toggleSearchbar={toggleSearchbar}
      />
    </div>
  );
}

function AccountDropDown({ user, router }) {
  const { isOpen: accountOpen, open, close, toggle } = useToggle(false);
  const client = useApolloClient();

  const _handleRouteChange = () => close();

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
          toggle();
        }}
        onMouseEnter={() => open()}
      >
        <div className="flex items-center mr-1 font-semibold">
          Account <ChevronDownSvg />
        </div>
      </button>
      <ul
        className={
          (!accountOpen ? "hidden " : "") +
          " z-50 absolute top-0 left-0 mt-8 bg-white border shadow-md rounded-lg flex flex-col items-start "
        }
        onMouseLeave={() => close()}
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
          (isPath(router, "") ? "mr-4  w-10 h-10" : " mr-2")
        }
        src={YumeLogo}
      />
      <p className={isPath(router, "") ? "text-2xl" : "text-xl"}>yume</p>
    </a>
  </Link>
);

function Header({ router, pageWrapID }) {
  const { isOpen: visible, setIsOpen: setVisible, toggle } = useToggle(false);
  const toggleSidebar = useCallback(() => toggle());
  return (
    <User>
      {({ data, error }) => {
        const me = data ? data.whoami : null;
        return (
          <div className="bg-white">
            <header className="container mx-auto">
              {/* Header for very small sizes (only logo) */}
              <MobileNav
                router={router}
                visible={visible}
                setVisible={toggleSidebar}
                user={me}
                styles={styles}
              />
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
                <div className="mr-6 flex items-center justify-end w-4/12 font-semibold text-black">
                  <div>
                    {me && <AccountDropDown user={me} router={router} />}
                  </div>
                  {!me && (
                    <Link href="/login">
                      <a
                        href="/login"
                        className={
                          "ml-8 " +
                          (isPath(router, "login") ? "text-yume-red" : "")
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
                        (isPath(router, "forum") ? "text-yume-red" : "")
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
  router: { pathname: "/" },
  pageWrapID: "page-wrap"
};

const ChevronDownSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-chevron-down"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const styles = {
  bmBurgerButton: {
    position: "absolute",
    width: "20px",
    height: "16px",
    left: "20px",
    top: "20px"
  },
  bmItem: {
    outline: 0
  },
  bmCrossButton: {
    height: "32px",
    width: "32px"
  },
  bmCross: {
    background: "#292b2b"
  },
  bmMenuWrap: {
    position: "fixed",
    height: "100%",
    bottom: "0",
    left: "0",
    width: "200px"
  },
  bmMorphShape: {
    fill: "#fff"
  },
  bmOverlay: {
    background: "rgba(0, 0, 0, 0)"
  },
  listItemText: {
    fontSize: "0.7em"
  }
};
export default withRouter(Header);
