import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { LoadingPage, ErrorPage, ForumPost } from "../components";
import { useRouter } from "next/router";
import Head from "next/head";
import createAvatar from "../lib/createAvatar";

const GET_USER_PROFILE = gql`
  query GET_USER_PROFILE($username: String!) {
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
      posts(page: 1) {
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

function ProfilePage() {
  const router = useRouter();
  const { username } = router.query;

  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: {
      username
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
        <h2 className="text-2xl text-yume-red mb-4">
          {user.firstName} {user.lastName}'s Posts
        </h2>
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

export { GET_USER_PROFILE };
export default ProfilePage;
