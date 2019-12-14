import React from "react";
import { withRouter } from "next/router";
import { ErrorPage, LoadingPage, ForumPost } from "../components";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import ErrorDisplay from "next/error";
import YumeSearchIcon from "../icons/undraw_searching.svg";

const SEARCH_POST_QUERY = gql`
  query SEARCH_POST_QUERY($query: String!, $page: Int, $limit: Int) {
    searchPost(query: $query, page: $page, limit: $limit) {
      pages
      nodes {
        id
        slug
        caption
        comment
        created
        numLikes
        replies(limit: 5) {
          id
          comment
        }
      }
    }
  }
`;

const MainSection = ({ children }) => (
  <div className="max-w-3xl mb-12">{children}</div>
);
const TitleSection = ({ children }) => <div className="">{children}</div>;
const Buttons = ({ children }) => (
  <div className="w-full flex justify-end mb-4 items-center">{children}</div>
);

function Search({ router }) {
  const { query: postQuery, page: page_str } = router.query;
  const page = parseInt(page_str || 1);

  const { data, loading, error } = useQuery(SEARCH_POST_QUERY, {
    variables: {
      query: postQuery,
      page,
      limit: 5
    }
  });

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage />;

  const { nodes: posts, pages } = data.searchPost;

  if (!posts.length) {
    return (
      <div className="container mx-auto flex flex-col items-center p-6">
        <img src={YumeSearchIcon} style={{ width: "600px" }} />
        <p className="mt-12 font-bold text-2xl antialiased">
          Oops. No search results found.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col items-center">
      <MainSection>
        <TitleSection>
          <p className="mt-4 mr-2 uppercase text-xl font-medium tracking-wide">
            <span className="text-yume-red">Search:</span> {postQuery}
          </p>
          <Buttons>
            <LeftPageButton
              router={router}
              title="Previous"
              page={page - 1}
              postQuery={postQuery}
              isHidden={page === 1}
            />
            <p className="mr-4 text-gray-600">
              {page} of {pages}
            </p>
            <RightPageButton
              router={router}
              title="Next"
              page={page + 1}
              postQuery={postQuery}
              isHidden={page === pages}
            />
          </Buttons>
        </TitleSection>

        {posts.map(post => (
          <div key={post.id} className="mb-4">
            <ForumPost {...post} />
          </div>
        ))}
        <div className={`mt-2 ${pages === 1 ? "hidden" : " "}`}>
          <Buttons>
            <LeftPageButton
              router={router}
              title="Previous"
              page={page - 1}
              postQuery={postQuery}
              isHidden={page === 1}
            />
            <p className="mr-4 text-gray-600">
              {page} of {pages}
            </p>
            <RightPageButton
              router={router}
              title="Next"
              page={page + 1}
              postQuery={postQuery}
              isHidden={page === pages}
            />
          </Buttons>
        </div>
      </MainSection>
    </div>
  );
}

const FuncPageButton = ({ router, page, postQuery, children, isHidden }) => (
  <button
    className={
      "w-24 fill-current hover:text-white hover:bg-yume-red rounded-lg flex items-center justify-around p-2 text-yume-red-darker mr-4 outline-none focus:outline-none" +
      (isHidden ? " hidden" : "")
    }
    onClick={() => {
      // Needs full query on "as" for displaying on url bar, "query" for query data
      // and pathname has to match the filename
      // Note: Throws errors if not provided all three params

      const pathname = "/search";
      const query = { page, query: postQuery };
      let asPath = `/search`;
      if (postQuery) {
        asPath += `?query=${postQuery}`;
      }
      asPath += (postQuery ? `&` : "?") + `page=${page}`;

      router.push({ pathname, query }, asPath);
    }}
  >
    {children}
  </button>
);

const LeftPageButton = props => (
  <FuncPageButton {...props}>
    <svg
      x="0px"
      y="0px"
      viewBox="0 0 20 20"
      enableBackground="new 0 0 20 20"
      className=" w-4 h-4 flex items-center justify-center"
    >
      <path
        d="M12.452,4.516c0.446,0.436,0.481,1.043,0,1.576L8.705,10l3.747,3.908c0.481,0.533,0.446,1.141,0,1.574
        c-0.445,0.436-1.197,0.408-1.615,0c-0.418-0.406-4.502-4.695-4.502-4.695C6.112,10.57,6,10.285,6,10s0.112-0.57,0.335-0.789
        c0,0,4.084-4.287,4.502-4.695C11.255,4.107,12.007,4.08,12.452,4.516z"
      />
    </svg>
    {props.title}
  </FuncPageButton>
);

const RightPageButton = props => (
  <FuncPageButton {...props}>
    {props.title}
    <svg
      x="0px"
      y="0px"
      viewBox="0 0 20 20"
      enableBackground="new 0 0 20 20"
      className=" w-4 h-4 flex items-center justify-center"
    >
      <path
        d="M9.163,4.516c0.418,0.408,4.502,4.695,4.502,4.695C13.888,9.43,14,9.715,14,10s-0.112,0.57-0.335,0.787
        c0,0-4.084,4.289-4.502,4.695c-0.418,0.408-1.17,0.436-1.615,0c-0.446-0.434-0.481-1.041,0-1.574L11.295,10L7.548,6.092
        c-0.481-0.533-0.446-1.141,0-1.576C7.993,4.08,8.745,4.107,9.163,4.516z"
      />
    </svg>
  </FuncPageButton>
);

export default withRouter(Search);
