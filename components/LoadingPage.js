import React from "react";
import LoadingSvg from "../icons/undraw_loading.svg";
import Header from "../components/Header";

function LoadingPage() {
  return (
    <div className="container mx-auto ">
      <Header />
      <div className="flex flex-col items-center mt-32 p-6">
        <img src={LoadingSvg} style={{ width: "600px" }} />
        <p className="mt-12 font-bold text-2xl text-gray-800 antialiased">
          Loading your awesome content ...
        </p>
      </div>
    </div>
  );
}

export default LoadingPage;
