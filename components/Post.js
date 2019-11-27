import React from "react";

function Like({ isLike }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={
        "w-6 h-6 feather feather-heart text-yume-red " +
        (isLike ? "fill-current" : "")
      }
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );
}

Like.defaultProps = {
  isLike: false
};

function Post({ caption, comment, likes, numReplies }) {
  return (
    <div className="max-w-3xl rounded-lg bg-white shadow-lg p-4">
      <div className="w-full px-4">
        <div className="flex flex-row items-center">
          {/* <img
            className="w-10 h-10 rounded-full object-cover"
            src="data:image/jpeg;base64,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"
          ></img> */}
          <div className="flex flex-row">
            <p className="font-semibold text-gray-700 leading-tight">
              Barbara Sellers
            </p>
            <p className="font-light text-gray-600 leading-tight ml-2">
              @bsellers
            </p>
          </div>
        </div>
      </div>
      <div className="px-4 py-2 text-3xl font-semibold leading-tight">
        {caption}
      </div>
      <div className="w-full px-4 py-2 mb-2 text-xl leading-snug text-gray-800 ">
        {comment}
      </div>
      <div className="mx-4 border border-b-0 border-gray-400 "></div>
      <div className="w-full mt-2 px-4 py-2 flex flex-row justify-between items-center">
        <div className="text-xl font-medium text-gray-800">
          {numReplies} Answers
        </div>
        <div className="text-lg font-light text-gray-600 flex flex-row items-center">
          <button className="focus:outline-none">
            <Like />
          </button>
          <p className="ml-2">{likes}</p>
        </div>
      </div>
    </div>
  );
}

Post.defaultProps = {
  caption: "",
  comment: "",
  likes: 0,
  numReplies: 0
};

export default Post;
