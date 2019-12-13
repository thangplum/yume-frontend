import React from "react";
import Link from "next/link";

function ForumCategory({
  name,
  number,
  slug,
  categoryIconForSlug,
  categoryTextForSlug
}) {
  return (
    <div className="max-w-4xl w-full p-3 py-4 flex flex bg-white border rounded shadow-md">
      <img className="w-40" src={categoryIconForSlug[slug] || ""} />
      <div className="flex flex-col ml-6 items-start justify-around">
        <Link href="/forum/[slug]" as={"/forum/" + slug}>
          <a className="text-center font-bold text-2xl cursor-pointer hover:text-yume-red">
            {name}
          </a>
        </Link>
        <p className="text-sm text-gray-700">
          {categoryTextForSlug[slug] || ""}
        </p>
      </div>
      <div className="w-0 border border-l-0 mx-4 border-gray-400"></div>
      <div className="py-4 text-center text-gray-600 flex items-center">
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
