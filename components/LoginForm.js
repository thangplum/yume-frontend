import React, { useState } from "react";
import * as validator from "validator";
import ErrorMessage from "../components/ErrorMessage";
import Spinner from "../components/Spinner";
import Link from "next/link";

const useInput = initialValue => {
  const [value, setValue] = useState(initialValue);
  return {
    value,
    setValue,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: event => {
        setValue(event.target.value);
      }
    }
  };
};

const validateForm = (email, password, showError) => {
  if (!email || !password) {
    showError("Enter a valid username/password.");
    return false;
  }
  if (!validator.isEmail(email)) {
    showError("Invalid email address.");
    return false;
  }
  return true;
};

function LoginForm(props) {
  const { value: emailValue, bind: emailBind } = useInput("");
  const { value: passwordValue, bind: passwordBind } = useInput("");

  const handleSubmit = evt => {
    evt.preventDefault();
    if (!validateForm(emailValue, passwordValue, props.showError)) {
      return;
    }
    props.handleLogin(emailValue, passwordValue);
  };
  return (
    <div className="w-full max-w-sm">
      <p className="text-yume-red text-2xl tracking-wider font-semibold uppercase mb-6">
        Login
      </p>
      <div className="relative">
        {props.loading && <Spinner />}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-4 mb-4"
        >
          <p className="text-yume-red">
            {props.error && <ErrorMessage message={props.error} />}
          </p>
          <br />
          <div className="mb-4">
            <label
              className="block text-yume-text-black text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yume-blue-dark"
              id="email"
              type="text"
              placeholder="Email"
              {...emailBind}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-yume-text-black text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yume-blue-dark"
              id="password"
              type="password"
              placeholder="******************"
              {...passwordBind}
            />
            <p className="hidden text-yume-red text-xs italic">
              Please choose a password.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-yume-red hover:bg-yume-red-darker text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-yume-red hover:text-yume-red-darker"
              href="#"
            >
              Forgot Password?
            </a>
          </div>
          <div className="w-full flex items-center justify-center">
            <p className="text-gray-600 text-sm mt-6">
              Not a member yet?
              <Link href="/register">
                <a className="underline cursor-pointer ml-2">Join Now</a>
              </Link>
            </p>
          </div>
        </form>
      </div>
      <p className="text-center text-gray-500 text-xs">
        &copy;2019 Yume LLC. All rights reserved.
      </p>
    </div>
  );
}

export default LoginForm;
