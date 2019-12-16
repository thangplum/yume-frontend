import { Router } from "next/router";
import NProgress from "nprogress";
import Meta from "./Meta";
import dynamic from "next/dynamic";
import YumeLogo from "../icons/logo.svg";

// Note: Loading Header dynamically and disable ssr, so it only renders on client-side
const DynamicHeaderWithNoSSR = dynamic(() => import("../components/Header"), {
  ssr: false,
  loading: () => (
    <div className="w-full bg-white py-5 px-12">
      <img src={YumeLogo} className="w-10 h-10" />
    </div>
  )
});

// Handle route events to display a progress bar on route change
Router.events.on("routeChangeStart", () => {
  console.log("route started");
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => {
  console.log("route completed");

  NProgress.done();
});
Router.events.on("routeChangeError", () => {
  console.log("route error");
  NProgress.done();
});

export default ({ children }) => (
  <main className="min-h-screen bg-gray-100">
    <Meta />
    <DynamicHeaderWithNoSSR />
    {children}
    <style jsx global>{`
      * {
        font-family: "Lato", sans-serif;
      }
    `}</style>
  </main>
);
