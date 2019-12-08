import React from "react";
import Link from "next/link";
import YumeHumaans from "../icons/yume_home_humans_1.svg";
import HumanLabCoat from "../icons/yume_human_blue_lab_coat.svg";
import HumanYellowTwo from "../icons/yume_human_yellow_two.svg";
import YumeHomeDemo from "../icons/yume_home_demo.svg";
import Header from "./Header";

const IndexPage = () => (
  <div className="bg-white">
    <div className="container mx-auto">
      {/* Content */}
      <div className="pt-12 sm:pt-24 ml-12 md:ml-32 relative">
        <img
          src={YumeHumaans}
          className="hidden lg:block absolute"
          style={{ width: "600px", top: "6rem", right: "30px" }}
        />
        <p className="text-5xl font-semibold antialiased">
          We help <br /> college students network
        </p>
        <p className="tracking-wide text-sm border-l-4 border-gray-700 pl-2 text-gray-700">
          With our diverse team we are building the best resource for college
          students to network <br /> with each other
        </p>
        <Link href="/forum">
          <button className="mt-8 bg-yume-red text-white font-semibold py-2 px-6 rounded-full focus:outline-none hover:bg-yume-blue">
            Join Now
          </button>
        </Link>
      </div>
    </div>

    {/* Article */}
    <div className="hidden lg:block bg-gray-100" style={{ marginTop: "300px" }}>
      <TwoPieceHumans />
    </div>
    <div className="lg:hidden bg-gray-100 mt-12">
      <TwoPieceHumans />
    </div>

    {/* Big Demo Hero */}
    <BigDemoHero />

    {/* Footer */}
    <div className="bg-gray-100 mt-12">
      <div className="container mx-auto py-4 flex flex-row justify-end mx-12">
        <div className="mr-6 font-semibold flex flex-row items-center">
          <a className="ml-8">Support</a>
          <a className="ml-8">Privacy</a>
          <a className="ml-8">Terms</a>
        </div>
      </div>
    </div>
  </div>
);

const TwoPieceHumans = () => (
  <div className="container mx-auto px-16 flex flex-col lg:flex-row justify-between">
    <div className="flex flex-row items-start max-w-lg my-16">
      <img src={HumanLabCoat} style={{ width: "100px" }} />
      <div className="ml-6 mt-6">
        <p className="text-2xl text-yume-red font-bold">19,900,000</p>
        <p className="font-semibold mt-2">College Students</p>
        <p className="font-thin text-gray-700 mt-2">
          We are bringing in 19.9 million college students together in our
          network
        </p>
      </div>
    </div>
    <div className="flex flex-row items-start max-w-lg my-16">
      <img src={HumanYellowTwo} style={{ width: "100px" }} />
      <div className="ml-6 mt-6">
        <p className="text-2xl text-yume-red font-bold">1K+ Questions</p>
        <p className="font-semibold mt-2">Topics</p>
        <p className="font-thin text-gray-700 mt-2">
          Yume is a collection of thousands of resource of universities in the
          US
        </p>
      </div>
    </div>
  </div>
);

const BigDemoHero = () => (
  <div className="container mx-auto flex flex-col items-center p-6">
    <div className="flex flex-col items-center mt-16 justify-center tracking-wider">
      <p className="font-bold text-3xl max-w-xl">
        Browse through your customized feed, forums and user profiles
      </p>
      <button className="mt-8 bg-yume-red text-white font-semibold py-2 px-6 rounded-full focus:outline-none hover:bg-yume-blue">
        Goto Forums
      </button>
    </div>
    <img
      className="mt-16 rounded-lg"
      src={YumeHomeDemo}
      style={{ width: "600px" }}
    />
  </div>
);
export default IndexPage;
