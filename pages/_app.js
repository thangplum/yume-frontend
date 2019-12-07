import App from "next/app";
import AppComponent from "../components/App";

class YumeApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <AppComponent>
        <Component {...pageProps} />
      </AppComponent>
    );
  }
}

export default YumeApp;
