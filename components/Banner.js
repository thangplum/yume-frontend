import React from "react";

function Banner({ title, subtitle }) {
  if (!subtitle) {
    return (
      <div className="w-full bg-yume-red flex flex-col items-center text-white p-4">
        <div className="px-6 py-8  text-5xl">{title}</div>
      </div>
    );
  }
  return (
    <div className="w-full bg-yume-red flex flex-col text-white p-4">
      <div className="px-6 py-8  text-5xl">{title}</div>
      <div className="px-6 py-4 text-2xl">{subtitle}</div>
    </div>
  );
}

Banner.defaultProps = {
  title: "",
  subtitle: null
};

export default Banner;
