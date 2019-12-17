import Head from "next/head";
import YumeLogo from "../icons/logo.svg";

export default () => (
  <Head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta charSet="utf-8" />
    {/* <!-- Suppress browser request for favicon.ico --> */}
    {/* <link
      rel="shortcut icon"
      type="image/x-icon"
      href="data:image/x-icon;,"
    ></link> */}
    <link rel="shortcut icon" type="image/png" href="/logo.png" />
    <title>Yume</title>
  </Head>
);
