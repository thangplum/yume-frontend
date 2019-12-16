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
          numLikes
          likes
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
      <div className="w-3/12 flex pl-20 text-xl">
        <ul>
          <li className="w-40 border bg-white rounded-lg mb-6">
            <div dangerouslySetInnerHTML={createAvatar(user.username)} />
          </li>
          <li className="text-yume-red text-2xl">
            {user.firstName} {user.lastName}
          </li>
          <li>@{user.username}</li>
        </ul>
      </div>
      <div className="w-9/12 flex flex-col px-12 pb-16">
        <h2 className="text-2xl text-yume-red mb-4">
          {user.firstName} {user.lastName}'s Posts
        </h2>
        <div>
          {posts.map(post => (
            <div className="mb-6">
              <ForumPost {...post} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
