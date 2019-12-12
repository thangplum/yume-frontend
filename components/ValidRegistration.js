import React from "react";
import Link from "next/link";

const ValidRegistration = () => (
  <div className="max-w-lg bg-gray-200  text-gray-700 flex flex-col justify-center text-center font-medium text-base rounded">
    <i className="fas fa-check-circle fa-5x mt-8 mb-6" />
    <div className="sm:flex px-6 py-3">
      <p>
        Registration Succesful! Please check your email inbox for verification
        email.
      </p>
    </div>
    <div className="text-lg mb-6 underline ">
      <Link href="/forum">
        <p className="cursor-pointer focus:text-gray-900">Go to the forums</p>
      </Link>
    </div>
  </div>
);

export default ValidRegistration;
