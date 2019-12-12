import Router from "next/router";
import cookie from "js-cookie";
import nextCookie from "next-cookies";
import { useEffect } from "react";
import redirect from "./redirect";

export const login = ({ token, client }) => {
  cookie.set("token", token, { expires: 1, sameSite: true, path: "/" });
  // Force a reload of all the current queries now that the user is logged in
  client.resetStore().then(() => {
    Router.push("/");
  });
};

export const auth = async ctx => {
  const { token } = nextCookie(ctx);

  // If there is no token, then user is not logged in
  if (!token) {
    redirect(ctx, "/login");
  }

  return token;
};

export const logout = client => {
  cookie.remove("token");
  // to support logging out of all windows
  window.localStorage.setItem("logout", Date.now());

  // Reset store and Redirect to a more useful page when signed out
  // Note: client.resetStore() will also refetch all the queries
  // Also: if just want to clear store without refresing queries look at client.clearStore()
  if (client) {
    client
      .resetStore()
      .catch(err => {
        // Gracefully catch all the failed auth error as user is not logged In anymore
        return null;
      })
      .finally(() => {
        Router.push("/");
      });
  } else {
    Router.push("/");
  }
};

export const withAuthSync = WrappedComponent => {
  const Wrapper = props => {
    const syncLogout = event => {
      if (event.key === "logout") {
        Router.push("/");
      }
    };

    useEffect(() => {
      window.addEventListener("storage", syncLogout);
      return () => {
        window.removeEventListener("storage", syncLogout);
        window.localStorage.removeItem("logout");
      };
    }, []);

    return <WrappedComponent {...props} />;
  };

  Wrapper.getInitialProps = async ctx => {
    const token = await auth(ctx);

    const componentProps =
      WrappedComponent.getInitialProps &&
      (await WrappedComponent.getInitialProps(ctx));

    return { ...componentProps, token };
  };

  return Wrapper;
};
