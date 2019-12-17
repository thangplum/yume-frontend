import Router from "next/router";
import cookie from "js-cookie";
import { apiUrl } from "../config";

export const login = ({ token, client }) => {
  cookie.set("token", token, { expires: 1, sameSite: true, path: "/" });
  // Force a reload of all the current queries now that the user is logged in
  client.resetStore().then(() => {
    Router.push("/");
  });
};

export const loginWithoutRedirect = ({ token, client }) => {
  cookie.set("token", token, { expires: 1, sameSite: true, path: "/" });
  // Force a reload of all the current queries now that the user is logged in
  client.resetStore().then(() => {});
};

export const logout = async client => {
  try {
    const response = await fetch(`${apiUrl}/logout`, {
      method: "POST"
    });
    if (!response.ok) return;
  } catch (e) {
    return;
  }
  // remove cookie this way, by rewriting it with cookie that immediately expires
  // this is because we cannot delete cookie set by server with "HttpOnly" flag
  cookie.set("token", "", { expires: -1 });
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
