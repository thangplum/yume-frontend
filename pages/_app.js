import App from "next/app";
import AppComponent from "../components/App";
import { ApolloProvider } from "@apollo/react-hooks";
import withApollo from "../lib/withApollo";
import "nprogress/nprogress.css";
import "../style.css";
import "animate.css/animate.min.css";

class YumeApp extends App {
  static getInitialProps = async ({ Component, ctx }) => {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    pageProps.query = ctx.query;
    return { pageProps };
  };

  render() {
    const { Component, pageProps, apollo } = this.props;
    return (
      <ApolloProvider client={apollo}>
        <AppComponent>
          <Component {...pageProps} />
        </AppComponent>
      </ApolloProvider>
    );
  }
}

export default withApollo(YumeApp);
