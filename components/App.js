import { Router } from "next/router";
import NProgress from "nprogress";
import Meta from "./Meta";
import { Header } from ".";

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
    <Header />
    {children}
    <style jsx global>{`
      * {
        font-family: "Lato", sans-serif;
      }
    `}</style>
  </main>
);
