import React from "react";
import Link from "next/link";

function ForumPost({ caption, comment, id: postId, replies, likes }) {
  return (
    <div className="max-w-3xl rounded-lg bg-white shadow-lg p-4">
      <Link href="/post/[id]" as={"/post/" + postId}>
        <a className="focus:outline-none">
          <div className="px-4 py-4 text-3xl font-semibold leading-tight cursor-pointer">
            {caption}
          </div>
          <div className="w-full px-4 py-2 mb-2 text-xl leading-snug text-gray-800 ">
            {comment}
          </div>
        </a>
      </Link>
      <div className="mx-4 border border-b-0 border-gray-400 "></div>
      <div className="w-full mt-2 px-4 py-2 flex flex-row justify-between">
        <div className="text-xl font-medium text-gray-800">
          {replies.length} Answers
        </div>
        <div className="text-lg font-light text-gray-600">{likes} Likes</div>
      </div>
    </div>
  );
}

ForumPost.defaultProps = {
  caption: "",
  comment: "",
  id: "",
  replies: [],
  likes: 0
};

export default ForumPost;
