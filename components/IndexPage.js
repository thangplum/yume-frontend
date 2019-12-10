import React, { useState } from "react";
import Link from "next/link";
import YumeHumaans from "../icons/yume_home_humans_1.svg";
import HumanLabCoat from "../icons/yume_human_blue_lab_coat.svg";
import HumanYellowTwo from "../icons/yume_human_yellow_two.svg";
import YumeHomeDemo from "../icons/yume_home_demo.svg";
import ForumDisplayImage from "../icons/forum_display.svg";

const Buttons = ({ selected, select }) => (
  <div>
    <div className="antialiased bg-gray-200 p-8">
      <div className="flex justify-center">
        <nav id="nav" className="w-56 relative">
          <span
            className="absolute h-10 w-full bg-white rounded-lg shadow ease-out transition-transform transition-medium"
            style={{ transform: `translateY(calc(100% * ${selected})` }}
          ></span>
          <ul className="relative">
            <li>
              <button
                type="button"
                onClick={() => select(0)}
                aria-selected={selected === 0}
                className="py-2 px-3 w-full flex items-center focus:outline-none focus-visible:underline"
              >
                <svg
                  className={
                    selected === 0 ? "text-indigo-400" : "text-gray-500"
                  }
                  className="h-6 w-6 transition-all ease-out transition-medium"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 7a1 1 0 011-1h8a1 1 0 011 1v8a1 1 0 11-2 0V8h-7a1 1 0 01-1-1z"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.707 7.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0L9 12.414l-5.293 5.293a1 1 0 01-1.414-1.414l6-6a1 1 0 011.414 0L13 13.586l6.293-6.293a1 1 0 011.414 0z"
                  />
                </svg>
                <span
                  className={
                    selected === 0 ? "text-indigo-600" : "text-gray-700"
                  }
                  className="ml-2 text-sm font-medium transition-all ease-out transition-medium"
                >
                  Forum
                </span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => select(1)}
                aria-selected={selected === 1}
                className="py-2 px-3 w-full flex items-center focus:outline-none focus-visible:underline"
              >
                <svg
                  className={
                    selected === 1 ? "text-indigo-400" : "text-gray-500"
                  }
                  className="h-6 w-6 transition-all ease-out transition-medium"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 101.414 1.414L4 12.414V21a1 1 0 001 1h5a1 1 0 001-1v-6h2v6a1 1 0 001 1h5a1 1 0 001-1v-8.586l.293.293a1 1 0 001.414-1.414l-9-9zM18 10.414l-6-6-6 6V20h3v-6a1 1 0 011-1h4a1 1 0 011 1v6h3v-9.586z"
                  />
                </svg>
                <span
                  className={
                    selected === 1 ? "text-indigo-600" : "text-gray-700"
                  }
                  className="ml-2 text-sm font-medium transition-all ease-out transition-medium"
                >
                  Profile
                </span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => select(2)}
                aria-selected={selected === 2}
                className="py-2 px-3 w-full flex items-center focus:outline-none focus-visible:underline"
              >
                <svg
                  className={
                    selected === 2 ? "text-indigo-400" : "text-gray-500"
                  }
                  className="h-6 w-6 transition-all ease-out transition-medium"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.617 1.076a1 1 0 011.09.217l5.657 5.657a9 9 0 11-13.113.41A1 1 0 017 8.022v2.292a2 2 0 104 0V2a1 1 0 01.617-.924zM13 4.414v5.9A4 4 0 015.212 11.6 7 7 0 1016.95 8.364L13 4.414z"
                  />
                </svg>
                <span
                  className={
                    selected === 2 ? "text-indigo-600" : "text-gray-700"
                  }
                  className="ml-2 text-sm font-medium transition-all ease-out transition-medium"
                >
                  Discussion
                </span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <style jsx>{`
      .ease-in {
        transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
      }
      .ease-out {
        transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
      }
      .ease-in-out {
        tranåition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      }

      .transition-fastest {
        transition-duration: 75ms;
      }
      .transition-faster {
        transition-duration: 100ms;
      }
      .transition-fast {
        transition-duration: 150ms;
      }
      .transition-medium {
        transition-duration: 200ms;
      }
      .transition-slow {
        transition-duration: 300ms;
      }
      .transition-slower {
        transition-duration: 500ms;
      }
      .transition-slowest {
        transition-duration: 700ms;
      }

      .transition-all {
        transition-property: all;
      }
      .transition-opacity {
        transition-property: opacity;
      }
      .transition-transform {
        transition-property: transform;
      }

      .focus-visible.focus-visible\:underline {
        text-decoration: underline;
      }
    `}</style>
  </div>
);
const ForumDisplay = ({ select, selected }) => (
  <div className="bg-gray-200 ">
    <div className="container mx-auto flex justify-around">
      <div className="flex flex-col pt-40">
        <Buttons select={select} selected={selected} />
      </div>
      <div className="flex flex-col items-end justify-end mt-12">
        <img
          width={700}
          className="img-shadow rounded-tl-lg rounded-tr-lg"
          src={selected === 0 ? ForumDisplayImage : ForumDisplayImage}
        />
      </div>
    </div>
    <style jsx>{`
      .img-shadow {
        box-shadow: -10px -10px 15px -3px rgba(0, 0, 0, 0.1);
      }
    `}</style>
  </div>
);
function IndexPage() {
  const [selected, select] = useState(0);
  return (
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
      <div
        className="hidden lg:block bg-gray-100"
        style={{ marginTop: "300px" }}
      >
        <TwoPieceHumans />
      </div>
      <div className="lg:hidden bg-gray-100 mt-12">
        <TwoPieceHumans />
      </div>

      {/* Big Demo Hero */}

      <ForumDisplay select={select} selected={selected} />

      <div className="bg-gray-100">
        <BigDemoHero />
      </div>

      {/* Footer */}
      <div className="bg-gray-200">
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
}

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
    {/* <img
      className="mt-16 rounded-lg"
      src={YumeHomeDemo}
      style={{ width: "600px" }}
    /> */}
  </div>
);
export default IndexPage;
