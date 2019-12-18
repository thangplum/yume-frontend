import React from "react";
import Link from "next/link";
import ReadMoreReact from 'read-more-react';

const PostContainer = ({ children }) => (
  <div className="rounded-lg bg-white shadow-lg p-2">{children}</div>
);

const PostCaption = ({ children }) => (
  <div className="p-3 text-xl font-semibold leading-tight cursor-pointer">
    {children}
  </div>
);

const PostComment = ({ children }) => (
  <div className="w-full px-3 mb-2 text-md leading-snug text-gray-800 ">
    <ReadMoreReact text={children} max={150} />
  </div>
);

const PostStats = ({ children }) => (
  <div className="w-full mt-2 px-3 py-2 flex flex-row justify-between">
    {children}
  </div>
);

function ForumPost({ caption, comment, id: postId, replies, rating, slug }) {
  return (
    <PostContainer>
      <Link href="/post/[slug]" as={"/post/" + slug}>
        <a className="focus:outline-none">
          <PostCaption>{caption}</PostCaption>
          <PostComment>{comment}</PostComment>
        </a>
      </Link>
      <div className="mx-3 border border-b-0 border-gray-400 "></div>
      <PostStats>
        <div className="text-md font-medium text-gray-800">
          {replies.length} Answers
        </div>
        <div className="text-sm font-light text-gray-600">{rating} Points</div>
      </PostStats>
    </PostContainer>
  );
}

ForumPost.defaultProps = {
  caption: "",
  comment: "",
  id: "",
  replies: [],
  rating: 0,
  slug: ""
};

export default ForumPost;
