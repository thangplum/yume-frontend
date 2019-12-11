import React from "react";
import ErrorSvg from "../icons/undraw_bug_fixing.svg";

function ErrorPage() {
  return (
    <div className="container mx-auto ">
      <div className="flex flex-col items-center p-6">
        <img src={ErrorSvg} style={{ width: "600px" }} />
        <p className="mt-12 font-bold text-2xl antialiased">
          Oops. Something went wrong.
        </p>
        <p className="mt-6 font-semibold text-gray-700 text-xl">
          No worries. Our team of skilled developers are on it.
        </p>
      </div>
    </div>
  );
}

export default ErrorPage;
