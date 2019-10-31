import App from "../components/App";
import InfoBox from "../components/InfoBox";
import Header from "../components/Header";
import Submit from "../components/Submit";
import PostList from "../components/PostList";
import { withApollo } from "../lib/apollo";
import "../style.css";

const IndexPage = props => (
  <App>
    <Header />
    <InfoBox>
      ℹ️ This example <div className="text-purple-600">shows how </div>to fetch
      all initial apollo queries on the server. If you <a href="/">reload</a>{" "}
      this page you won't see a loader since Apollo fetched all needed data on
      the server. This prevents{" "}
      <a
        href="https://nextjs.org/blog/next-9#automatic-static-optimization"
        target="_blank"
      >
        automatic static optimization
      </a>{" "}
      in favour of full Server-Side-Rendering.
    </InfoBox>
    <Submit />
    <PostList />
  </App>
);

export default withApollo(IndexPage);
