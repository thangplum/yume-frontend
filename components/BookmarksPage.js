import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import ForumPost from "./ForumPost";

const GET_BOOKMARKS_QUERY = gql`
  query GET_BOOKMARKS_QUERY {
    whoami {
      id
      bookmarks {
        id
        slug
        caption
        comment
        created
        rating
        upvotes
        downvotes
        replies {
          id
        }
      }
    }
  }
`;

function BookmarksPage() {
  const { loading, error, data } = useQuery(GET_BOOKMARKS_QUERY);

  if (loading) return <LoadingPage />;

  if (error || (data && !data.whoami)) return <ErrorPage />;

  const { bookmarks } = data.whoami;
  return (
    <div className="container mx-auto flex flex-col items-center">
      <div className="max-w-3xl mb-12">
        <div>
          <p className="mt-4 mr-2 text-xl font-medium tracking-wide mb-6">
            <span className="text-yume-red">Your bookmarked questions</span>
          </p>
        </div>

        {bookmarks.map(post => (
          <div key={post.id} className="mb-6">
            <ForumPost {...post} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookmarksPage;
