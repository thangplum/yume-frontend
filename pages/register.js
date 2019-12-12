import { useState } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import RegisterForm from "../components/RegisterForm";
import ValidRegis from "../components/ValidRegistration";

function Registration() {
  //   const client = useApolloClient();
  const [registerSuccess, setRegisterSuccess] = useState(false);

  return (
    <div className="flex mt-12 pb-16 justify-around items-center">
      {registerSuccess && <ValidRegis />}
      {!registerSuccess && (
        <RegisterForm setRegisterSuccess={setRegisterSuccess} />
      )}
    </div>
  );
}

export default Registration;
