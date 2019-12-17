import React from "react";
import { useFormik } from "formik";
import { object as yupObject, string } from "yup";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { CURRENT_USER_QUERY } from "../components/User";
import Spinner from "./Spinner";
import { useState } from "react";

const UPDATE_USER_MUTATION = gql`
  mutation UPDATE_USER_MUTATION(
    $firstName: String!
    $lastName: String!
    $major: String!
    $college: String!
    $location: String!
  ) {
    updateUser(
      firstName: $firstName
      lastName: $lastName
      major: $major
      college: $college
      location: $location
    ) {
      id
    }
  }
`;

const SettingsItem = props => (
  <div className="mb-6">
    <div className="md:flex md:items-center">
      <div className="md:w-1/3">
        <label
          className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
          htmlFor="inline-full-name"
        >
          {props.label}
        </label>
      </div>
      <div className="md:w-2/3">
        <input
          className={
            "bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 " +
            (props.errors ? "border-yume-red-darker" : "")
          }
          id="inline-full-name"
          {...props}
        />
      </div>
    </div>
    <div className="flex justify-end text-sm text-yume-red">
      {props.errors || ""}
    </div>
  </div>
);

function SettingsForm({ user }) {
  const [updateUser] = useMutation(UPDATE_USER_MUTATION);
  const [isLoading, setIsLoading] = useState(false);

  const { firstName, lastName, username, major, college, location } = user;
  const formik = useFormik({
    initialValues: { username, firstName, lastName, major, college, location },
    onSubmit: async (values, { setSubmitting }) => {
      setIsLoading(true);
      try {
        const data = await updateUser({
          variables: {
            firstName: values.firstName,
            lastName: values.lastName,
            major: values.major,
            college: values.college,
            location: values.location
          },
          refetchQueries: [
            {
              query: CURRENT_USER_QUERY
            }
          ]
        });
        setTimeout(() => {
          setSubmitting(false);
          setIsLoading(false);
        }, 2000);
      } catch (err) {
        setIsLoading(false);

        console.error(err);
      }
    },
    validationSchema: yupObject({
      firstName: string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      lastName: string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      major: string(),
      college: string(),
      location: string()
      // username: string()
      //   .min(6, "Must be atleast 6 characters")
      //   .max(15, "Must be 15 characters or less")
      //   .required("Required")
    })
  });
  return (
    <>
      {isLoading && <Spinner />}
      <div>
        {/* {user.firstName} {user.lastName} */}
        <div className=" container mx-auto flex flex-col justify-center items-center mt-16">
          <p className="block text-gray-700 font-bold text-xl mb-6">Settings</p>

          <form className="w-full max-w-sm" onSubmit={formik.handleSubmit}>
            <SettingsItem
              label="First Name"
              type="text"
              name="firstName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstName}
              errors={
                formik.errors.firstName &&
                formik.touched.firstName &&
                formik.errors.firstName
              }
            />
            <SettingsItem
              label="Last Name"
              type="text"
              name="lastName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastName}
              errors={
                formik.errors.lastName &&
                formik.touched.lastName &&
                formik.errors.lastName
              }
            />
            <SettingsItem
              label="Major"
              type="text"
              name="major"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.major}
              errors={
                formik.errors.major &&
                formik.touched.major &&
                formik.errors.major
              }
            />
            <SettingsItem
              label="College"
              type="text"
              name="college"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.college}
              errors={
                formik.errors.college &&
                formik.touched.college &&
                formik.errors.college
              }
            />
            <SettingsItem
              label="Location"
              type="text"
              name="location"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.location}
              errors={
                formik.errors.location &&
                formik.touched.location &&
                formik.errors.location
              }
            />

            <div className="md:flex md:items-center">
              <div className="md:w-1/3"></div>
              <div className="md:w-2/3 text-white font-bold ">
                <button
                  type="submit"
                  disabled={!formik.isValid || formik.isSubmitting}
                  className=" bg-yume-red hover:bg-yume-red-darker  focus:outline-none py-2 px-4 rounded outline-none"
                >
                  Update Settings
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SettingsForm;
