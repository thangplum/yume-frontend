import React from "react";

// make parent "relative"
export default () => (
  <div className="w-full h-full absolute block top-0 left-0 bg-white opacity-75 z-50 flex items-center justify-center">
    <span className="text-yume-red opacity-75 block">
      <i className="fas fa-circle-notch fa-spin fa-3x"></i>
    </span>
  </div>
);
