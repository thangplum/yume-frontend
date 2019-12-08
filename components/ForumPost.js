import React from "react";
import Link from "next/link";

const PostContainer = ({ children }) => (
  <div className="rounded-lg bg-white shadow-lg p-4">{children}</div>
);

const PostCaption = ({ children }) => (
  <div className="px-4 py-4 text-2xl font-semibold leading-tight cursor-pointer">
    {children}
  </div>
);

const PostComment = ({ children }) => (
  <div className="w-full px-4 py-2 mb-2 text-lg leading-snug text-gray-800 ">
    {children}
  </div>
);

const PostStats = ({ children }) => (
  <div className="w-full mt-2 px-4 py-2 flex flex-row justify-between">
    {children}
  </div>
);

function ForumPost({ caption, comment, id: postId, replies, likes, slug }) {
  return (
    <PostContainer>
      <Link href="/post/[slug]" as={"/post/" + slug}>
        <a className="focus:outline-none">
          <PostCaption>{caption}</PostCaption>
          <PostComment>{comment}</PostComment>
        </a>
      </Link>
      <div className="mx-4 border border-b-0 border-gray-400 "></div>
      <PostStats>
        <div className="text-lg font-medium text-gray-800">
          {replies.length} Answers
        </div>
        <div className="text-base font-light text-gray-600">{likes} Likes</div>
      </PostStats>
    </PostContainer>
  );
}

ForumPost.defaultProps = {
  caption: "",
  comment: "",
  id: "",
  replies: [],
  likes: 0,
  slug: ""
};

export default ForumPost;
