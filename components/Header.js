import React, { useEffect, useCallback, useContext } from "react";
import Link from "next/link";
import { withRouter } from "next/router";
import YumeLogo from "../icons/logo.svg";
import BurgerMenu from "../icons/burger_menu.svg";
import LeftArrow from "../icons/left-arrow.svg";
import User from "./User";
import { useApolloClient } from "@apollo/react-hooks";
import { logout } from "../lib/auth";
import { SearchBox } from ".";
import { useState } from "react";
import { slide as Menu } from 'react-burger-menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { set } from "store2";
import { style } from "@material-ui/system";
import { MenuItem } from "@material-ui/core";

const MyContext = React.createContext();

const MyProvider = (props) => {
  const [menuOpenState, setMenuOpenState] = useState(false)
  
  return (
    <MyContext.Provider value={{
      isMenuOpen: menuOpenState,
      toggleMenu: () => setMenuOpenState(!menuOpenState),
      stateChangeHandler: (newState) => setMenuOpenState(newState.isOpen)
    }}>
      {props.children}
    </MyContext.Provider>
  )
}

const Button = ({styles}) => {
  const ctx = useContext(MyContext)
  return (
    <button style={styles.bmBurgerButton} onClick={ctx.toggleMenu}><img src={BurgerMenu} /></button>
  )
}

const Sidebar = ({styles, user, router}) => {
  const ctx = useContext(MyContext)
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
    <Menu styles={styles} customBurgerIcon={false} isOpen={ctx.isMenuOpen} onStateChange={(state) => ctx.stateChangeHandler(state)}>
      <List disablePadding dense>
        <React.Fragment key="forum">
          <ListItem button >
            <Link href="/forum">
              <a
                className={
                  "mt-2 text-xl " +
                  (router && router.pathname === "/forum"
                    ? "text-yume-red"
                    : "")
                }
                onClick={ctx.toggleMenu}
              >
                Forum
              </a>
            </Link>
          </ListItem>
        </React.Fragment>
        <React.Fragment  key="account">
          <div className="mt-8">
            {user && 
              (
              <div>
                <ListItem button
                  onMouseDown={e => {
                    e.preventDefault();
                    setAccountOpen(!accountOpen);
                  }}
                  onMouseEnter={() => setAccountOpen(true)}
                >
                  <div className="flex items-center text-xl">
                    Account <ChevronDownSvg />
                  </div>
                </ListItem>
                <List
                  disablePadding 
                  dense
                  className={
                    (!accountOpen ? "hidden " : "")
                  }
                  style={{ paddingLeft: 18 }}
                  onMouseLeave={() => setAccountOpen(false)}
                >
                  <Link href="/profile/[username]" as={`/profile/${user.username}`}>
                    <a
                      className={`flex w-full px-4 py-3 hover:bg-gray-200 ${
                        router && router.pathname.split("/")[1] === "profile"
                          ? " text-yume-red"
                          : ""
                      }`}
                      onClick={ctx.toggleMenu}
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
                      onClick={ctx.toggleMenu}
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
                      onClick={ctx.toggleMenu}
                    >
                      Settings
                    </a>
                  </Link>

                  <li className="flex w-full px-4 py-3 hover:bg-gray-200 ">
                    <button className="font-medium" onMouseEnter={ctx.toggleMenu} onClick={() => { logout(client);  }}>
                      Logout
                    </button>
                  </li>
                </List>
              </div>
            )}
          </div>
          {!user && (
            <ListItem button>
              <Link href="/login">
                <a
                  href="/login"
                  className={
                    "ml-0 text-xl " +
                    (router && router.pathname === "/login"
                      ? "text-yume-red"
                      : "")
                  }
                  onClick={ctx.toggleMenu}
                >
                  Log In
                </a>
              </Link>
            </ListItem>
          )}
        </React.Fragment>
      </List>
    </Menu>
  );
}

const SearchButton = ({toggleSearchbar}) => {
  
  return (
    <div>
      <button className="absolute right-0 top-0 mt-6 mr-8" onClick={toggleSearchbar}>
        <svg
          className="h-4 w-4 fill-current"
          version="1.1"
          id="Capa_1"
          x="0px"
          y="0px"
          viewBox="0 0 56.966 56.966"
          enableBackground="new 0 0 56.966 56.966"
          xml-space="preserve"
          width="512px"
          height="512px"
        >
          <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
        </svg>
      </button>
    </div>
      
  );
};

const Searchbox = ({searchboxOpen, toggleSearchbar}) => {
  if (searchboxOpen) {
    return (
      <form action="/search">
        <div className="relative justify-between w-screen text-gray-600">
          <button className="left-0 top-0 w-4 h-3 mt-4 ml-4 mr-4" onClick={toggleSearchbar}><img src={LeftArrow} /></button>
          <input
            type="search"
            name="query"
            placeholder="Search"
            className="bg-gray-200 mt-2 mb-2 h-10 px-5 pr-10 rounded-full text-sm focus:outline-none"
          />
          <button type="submit" className="absolute right-0 top-0 mt-5 mr-4">
            <svg
              className="h-4 w-4 fill-current"
              version="1.1"
              id="Capa_1"
              x="0px"
              y="0px"
              viewBox="0 0 56.966 56.966"
              enableBackground="new 0 0 56.966 56.966"
              xml-space="preserve"
              width="512px"
              height="512px"
            >
              <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
            </svg>
          </button>
        </div>
      </form>
    );
  } else {
    return (
      <></>
    );
  }
};

function MobileNav({ router, visible, setVisible, user, styles }) {
  const [searchboxOpen, setSearchboxOpen] = useState(false);
  const toggleSearchbar = () => {
    setSearchboxOpen(!searchboxOpen)
  };
  return (
    <div className="sm:hidden w-screen flex justify-center items-center">
      {!searchboxOpen  && 
        <div>
          <MyProvider>
            <div>
              <Button styles={styles} />
              <Sidebar styles={styles} user={user} router={router} visible={visible} setVisible={setVisible} />
            </div>
          </MyProvider>
          
        
          <a className="mx-2 text-center font-bold text-4xl inline-block cursor-pointer hover:text-black">
            yume
          </a>
          <SearchButton toggleSearchbar={toggleSearchbar} />
        </div>
      }
      
      <Searchbox searchboxOpen={searchboxOpen} toggleSearchbar={toggleSearchbar} />
    </div>
  );
}



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
      <p className={(router && router.pathname === "/" ? "text-2xl" : "text-xl")}>
        yume
      </p>
    </a>
  </Link>
);

function Header({ router, pageWrapID }) {
  const [visible, setVisible] = useState(false)
  const toggleSidebar = useCallback(() => setVisible(!visible));
  return (
    <User>
      {({ data, error }) => {
        const me = data ? data.whoami : null;
        return (
          <div className="bg-white">
            <header className="container mx-auto">
                {/* Header for very small sizes (only logo) */}
                <MobileNav router={router} visible={visible} setVisible={toggleSidebar} user={me} styles={styles} />
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
                  <div className="mr-6 font-medium flex items-center justify-end w-4/12 font-semibold text-black">
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
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-chevron-down"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const styles = {
  bmBurgerButton: {
    position: 'absolute',
    width: '20px',
    height: '16px',
    left: '20px',
    top: '20px'
  },
  bmBurgerBars: {
    background: '#373a47'
  },
  bmBurgerBarsHover: {
    background: '#a90000'
  },
  bmCrossButton: {
    height: '24px',
    width: '24px'
  },
  bmCross: {
    background: '#292b2b'
  },
  bmMenuWrap: {
    position: 'fixed',
    height: '100%',
    bottom: '0',
    left: '0',
    width: '200px'
  },
  bmMenu: {
    background: '#88d9db',
    padding: '2em 0 0'
  },
  bmMorphShape: {
    fill: '#88d9db'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0)'
  },
  listItemText:{
    fontSize:'0.7em'
  }
}
export default withRouter(Header);
