import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { LoadingPage, ErrorPage, ForumPost } from "../components";
import { useRouter } from "next/router";
import Head from "next/head";
import createAvatar from "../lib/createAvatar";

const GET_USER_PROFILE = gql`
  query GET_USER_PROFILE($username: String!, $page: Int) {
    user(username: $username) {
      id
      username
      firstName
      lastName
      created
      college
      major
      location
      bookmarks {
        id
      }
      posts(page: $page, limit: 10) {
        pages
        nodes {
          id
          caption
          comment
          slug
          rating
          upvotes
          downvotes
        }
      }
    }
  }
`;

const Buttons = ({ children }) => (
  <div className="w-full flex justify-end mb-4 items-center">{children}</div>
);

function ProfilePage() {
  const router = useRouter();
  const { username, page: page_str } = router.query;
  const page = parseInt(page_str) || 1;

  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: {
      username,
      page
    }
  });

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage />;

  const { user } = data;
  const { nodes: posts, pages } = user.posts;

  return (
    <div className="container mx-auto flex pt-12">
      <div className="w-3/12  flex pl-20">
        <ul className="text-base">
          <li className="flex flex-col items-center mb-4">
            <div className="w-40 border bg-white rounded-lg mb-2">
              <div dangerouslySetInnerHTML={createAvatar(user.username)} />
            </div>
            <p className="text-yume-red text-2xl font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-base">@{user.username}</p>
          </li>
          {user.major && (
            <li className="mb-2 text-gray-600">
              <i className="fas fa-graduation-cap text-yume-red w-10" />
              {user.major}
            </li>
          )}
          {user.college && (
            <li className="mb-2 text-gray-600">
              {" "}
              <i className="fas fa-university text-yume-red  w-10" />
              {user.college}
            </li>
          )}
          {user.location && (
            <li className="mb-2 text-gray-600">
              {" "}
              <i className="fas fa-map-marker-alt text-yume-red  w-10" />
              {user.location}
            </li>
          )}
        </ul>
      </div>
      <div className="w-9/12 flex flex-col px-12 pb-16">
        <div className="w-full flex">
          <h2 className="w-full text-2xl text-yume-red mb-4">
            {user.firstName} {user.lastName}'s Posts
          </h2>
          {pages !== 0 && (
            <Buttons>
              <LeftPageButton
                router={router}
                title="Previous"
                page={page - 1}
                username={username}
                isHidden={page === 1}
              />
              <p className="mr-4 text-gray-600">
                {page} of {pages}
              </p>
              <RightPageButton
                router={router}
                title="Next"
                page={page + 1}
                username={username}
                isHidden={page === pages}
              />
            </Buttons>
          )}
        </div>
        <div>
          {posts.map(post => (
            <div key={post.id} className="mb-6">
              <ForumPost {...post} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const FuncPageButton = ({ router, page, username, children, isHidden }) => (
  <button
    className={
      "w-24 fill-current hover:text-white hover:bg-yume-red rounded-lg flex items-center justify-around p-2 text-yume-red-darker mr-4 outline-none focus:outline-none" +
      (isHidden ? " hidden" : "")
    }
    onClick={() => {
      // Needs full query on "as" for displaying on url bar, "query" for query data
      // and pathname has to match the filename
      // Note: Throws errors if not provided all three params

      const pathname = "/profile/[username]";
      const query = { page, username: username };
      let asPath = `/profile/${username}?page=${page}`;
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

export { GET_USER_PROFILE };
export default ProfilePage;
