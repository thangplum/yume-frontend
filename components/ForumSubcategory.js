import React from "react";

function ForumSubcategory({ title, list }) {
  return (
    <div className="bg-white max-w-sm rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-6 bg-yume-red text-white text-2xl font-semibold">
        {title} Subcategories
      </div>
      <div className="p-4 text-xl font-medium flex flex-col">
        {list.map(item => (
          <a className="px-4 my-4 text-yume-blue-dark hover:text-yume-red cursor-pointer">
            {item.name}
          </a>
        ))}
        {!list.length && (
          <p className="font-thin text-gray-600 text-lg">
            No sub categories to show
          </p>
        )}
      </div>
    </div>
  );
}

ForumSubcategory.defaultProps = {
  title: "",
  list: []
};

export default ForumSubcategory;
