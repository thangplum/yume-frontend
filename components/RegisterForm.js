import React, { useState } from "react";
import { useFormik } from "formik";
import { object as yupObject, string, boolean } from "yup";
import moment from "moment";
import Spinner from "./Spinner";
import Link from "next/link";
import ErrorMessage from "./ErrorMessage";
import { loginWithoutRedirect } from "../lib/auth";
import { useApolloClient } from "@apollo/react-hooks";

const InputItem = props => (
  <div className="mb-3">
    <label
      className="block text-yume-text-black text-sm font-bold mb-2"
      htmlFor={props.name}
    >
      {props.label}
    </label>

    <input
      className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yume-blue-dark"
      type={props.type}
      placeholder={props.placeholder}
      {...props.fieldProps}
    />

    <p className="flex justify-end text-sm text-yume-red">
      {props.error || ""}
    </p>
  </div>
);

function RegisterForm(props) {
  const client = useApolloClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const showError = errorMsg => {
    setError(errorMsg);
    // reset the error message after 3 seconds
    window.setTimeout(() => {
      setError(null);
    }, 3000);
    return { error, showError };
  };

  const validationSchema = yupObject({
    firstName: string()
      .matches(/^[a-zA-Z][a-zA-Z ]+$/, "Must only contain alphabets")
      .required("Required"),
    lastName: string()
      .matches(/^[a-zA-Z][a-zA-Z ]+$/, "Must only contain alphabets")
      .required("Required"),
    email: string()
      .email("Invalid email address")
      .required("Required"),
    username: string()
      .min(6, "Username must be atleast 6 chars")
      .required("Required"),
    password: string()
      .min(6, "Password must be atleast 6 characters")
      .required("Please enter your password"),
    acceptedTerms: boolean()
      .required()
      .oneOf([true], "You must accept the terms and conditions"),
    dob: string()
      .test("dob", "You must be atleast 18 years old", value => {
        return moment().diff(moment(value), "years") >= 18;
      })
      .required("Enter your date of birth")
  });

  const _handleSubmit = async values => {
    const API_URL = `http://localhost:4000/api/v1`;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          username: values.username,
          password: values.password,
          dob: values.dob
        })
      });
      if (response.status >= 400 && response.status < 600) {
        const resp = await response.json();
        throw new Error(resp.message);
      }
      const loginResp = await response.json();
      loginWithoutRedirect({ token: loginResp.access_token, client });
      props.setRegisterSuccess(true);
    } catch (e) {
      showError(e.message);
      setIsSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      dob: "",
      acceptedTerms: false
    },
    validationSchema,
    onSubmit: _handleSubmit
  });

  return (
    <div className="w-full max-w-sm">
      <p className="text-yume-red text-2xl tracking-wider font-semibold uppercase mb-6">
        Register
      </p>
      <div className="relative">
        {isSubmitting && <Spinner />}
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="w-full flex items-center justify-center mb-4">
            <p className="text-gray-600 text-sm ">
              Already have an account?
              <Link href="/login">
                <a className="underline cursor-pointer ml-2">Sign In</a>
              </Link>
            </p>
          </div>
          <p className="text-yume-red">
            {error && <ErrorMessage message={error} />}
          </p>
          <InputItem
            label="First Name"
            placeholder="First Name"
            type="text"
            fieldProps={formik.getFieldProps("firstName")}
            error={
              formik.errors.firstName &&
              formik.touched.firstName &&
              formik.errors.firstName
            }
          />
          <InputItem
            label="Last Name"
            placeholder="Last Name"
            type="text"
            fieldProps={formik.getFieldProps("lastName")}
            error={
              formik.errors.lastName &&
              formik.touched.lastName &&
              formik.errors.lastName
            }
          />
          <InputItem
            label="Email"
            placeholder="Email"
            type="text"
            fieldProps={formik.getFieldProps("email")}
            error={
              formik.errors.email && formik.touched.email && formik.errors.email
            }
          />
          <InputItem
            label="Username"
            placeholder="Username"
            type="text"
            fieldProps={formik.getFieldProps("username")}
            error={
              formik.errors.username &&
              formik.touched.username &&
              formik.errors.username
            }
          />
          <InputItem
            label="Password"
            placeholder="********"
            type="password"
            fieldProps={formik.getFieldProps("password")}
            error={
              formik.errors.password &&
              formik.touched.password &&
              formik.errors.password
            }
          />
          <div className="mb-2">
            <label
              className="block text-yume-text-black text-sm font-bold mb-2"
              htmlFor="bday"
            >
              Date of Birth
            </label>
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yume-blue-dark"
              type="date"
              name="dob"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.dob}
            />

            <p className="flex justify-end text-sm text-yume-red">
              {formik.errors.dob && formik.touched.dob && formik.errors.dob}
            </p>
          </div>

          <div className="mb-7">
            <label className="checkbox flex items-center">
              <input
                type="checkbox"
                name="acceptedTerms"
                className="mr-4"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.acceptedTerms}
              />
              I accept the{" "}
              <Link href="/terms">
                <span className="underline ml-1 cursor-pointer text-gray-600">
                  terms and conditions
                </span>
              </Link>
            </label>
            <p className="flex justify-end text-sm text-yume-red">
              {formik.errors.acceptedTerms &&
                formik.touched.acceptedTerms &&
                formik.errors.acceptedTerms}
            </p>
          </div>
          <div className="flex items-center justify-center mt-4">
            <button
              className="bg-yume-red hover:bg-yume-red-darker text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Register
            </button>
          </div>
        </form>
      </div>
      <p className="text-center text-gray-500 text-xs">
        &copy;2019 Yume LLC. All rights reserved.
      </p>
    </div>
  );
}

export default RegisterForm;
