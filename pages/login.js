import { useMutation, useApolloClient } from "@apollo/react-hooks";
import gql from "graphql-tag";
import cookie from "cookie";
import redirect from "../lib/redirect";

import { withApollo } from "../lib/apollo";
import LoginForm from "../components/LoginForm";
import { useState } from "react";

function Login() {
  const client = useApolloClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const showError = errorMsg => {
    setError(errorMsg);
    // reset the error message after 3 seconds
    window.setTimeout(() => {
      setError(null);
    }, 3000);
    return { error, showError };
  };

  const afterLogin = token => {
    // Store the token in cookie
    document.cookie = cookie.serialize("token", token, {
      sameSite: true,
      path: "/",
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });

    // Force a reload of all the current queries now that the user is
    // logged in
    client.cache.reset().then(() => {
      redirect({}, "/");
    });
  };

  const handleLogin = async (email, password) => {
    const API_URL = `http://localhost:4000/api/v1`;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify({
          email,
          password
        })
      });

      if (response.status >= 400 && response.status < 600) {
        throw new Error("Invalid email and password");
      }
      const login = await response.json();
      afterLogin(login.access_token);
    } catch (e) {
      showError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <LoginForm
        handleLogin={handleLogin}
        error={error}
        loading={loading}
        showError={showError}
      />
    </div>
  );
}

export default withApollo(Login);
