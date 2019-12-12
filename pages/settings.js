import React from "react";
import { withAuthSync } from "../lib/auth";
import getLoggedInUser from "../lib/getLoggedInUser";
import redirect from "../lib/redirect";
import { useQuery } from "@apollo/react-hooks";
import { CURRENT_USER_QUERY } from "../components/User";
import nextCookies from "next-cookies";
import { LoadingPage, ErrorPage } from "../components";
import dynamic from "next/dynamic";

// Note: Loading React forms dynamically and disable ssr, so it only renders on client-side
const DynamicSettingsFormNoSSR = dynamic(
  () => import("../components/SettingsForm"),
  {
    ssr: false
  }
);

function Settings() {
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);

  if (loading) return <LoadingPage />;
  if (error) {
    // Gracefully handle error if user logout
    redirect({}, "/login");
    return null;
  }

  const user = data ? data.whoami : null;
  return <DynamicSettingsFormNoSSR user={user} />;
}

Settings.getInitialProps = async ctx => {
  // const { user, error } = await getLoggedInUser(ctx.apolloClient);
  const token = nextCookies(ctx);
  if (!token) {
    redirect(ctx, "/login");
    return {};
  }
  return {};
};
export default withAuthSync(Settings);
