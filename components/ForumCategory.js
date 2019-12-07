import React from "react";
import Link from "next/link";
import { ForumCategories } from "../stories/2- Forum.stories";

function ForumCategory({ name, number, id, slug }) {
  return (
    <div className="max-w-sm w-full p-3 flex flex-col bg-white border rounded shadow-md">
      <Link href="/forum/[slug]" as={"/forum/" + slug}>
        <a className="w-full py-10 text-center font-bold text-4xl cursor-pointer hover:text-yume-red">
          {name}
        </a>
      </Link>
      <div className="w-full border border-b-0 border-gray-400"></div>
      <div className="py-4 text-center text-gray-600">
        {number} subcategories
      </div>
    </div>
  );
}

ForumCategory.defaultProps = {
  name: "Category",
  id: 0,
  number: 0,
  slug: ""
};

export default ForumCategory;
