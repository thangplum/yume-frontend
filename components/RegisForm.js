import '../style.css';
import React, { useState } from "react";
import * as validator from "validator";
import ErrorMessage from "../components/ErrorMessage";
import ValidRegis from "../components/ValidRegistration";

const validateForm = (firstname, lastname, email, password, bday, showError) => {
    if (!firstname || !lastname || !email || !password || !bday || !validator.isEmail(email) || !validator.isAlpha(firstname) || !validator.isAlpha(lastname)) {
        if (!firstname) {
            showError("firstname", "Enter a valid first name.");
        }
        if (!lastname) {
            showError("lastname", "Enter a valid last name.");
        }
        if (!email) {
            showError("email", "Enter a valid email.");
        }
        if (!password) {
            showError("password", "Enter a valid password.");
        }
        if (!bday) {
            showError("bday", "Enter a valid date of birth.");
        }
        if (firstname && !validator.isAlpha(firstname)) {
            showError("firstname", "Invalid first name.");
        }
        if (lastname && !validator.isAlpha(lastname)) {
            showError("lastname", "Invalid last name.");
        }
        if (email && !validator.isEmail(email)) {
            showError("email", "Invalid email.");
        }
        return false;
    }
    return true;
  };

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

function RegisForm(props){
    const {value: fname, bind: fnameBind} = useInput("");
    const {value: lname, bind: lnameBind} = useInput("");
    const {value: email, bind: emailBind} = useInput("");
    const {value: password, bind: passwordBind} = useInput("");
    const {value: bday, bind: bdayBind} = useInput("");
    const [isVisible, setVisible] = useState(null);

    const handleSubmit = event => {
        event.preventDefault();
        if (!validateForm(fname, lname, email, password, bday, props.showError)) {
            return;
        }
        setVisible(true);
        //props.handleRegister(fname, lname, email, password, bday);
    };

    return (
        <div className="w-full max-w-sm">
            <div className="relative">
                {isVisible ? 
                    <ValidRegis />
                    :
                    <form
                    onSubmit={handleSubmit}
                    className="bg-yume-light shadow-md rounded px-8 pt-6 pb-8 mb-4"
                >
                    <br />
                    <div className="mb-5">
                        <label
                            className="block text-yume-text-black text-sm font-bold mb-2"
                            htmlFor="firstname"
                        >
                            First Name
                        </label>
                        
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-yume-text leading-tight focus:outline-none focus:shadow-outline"
                            id="firstname"
                            type="text"
                            value={fname || ""}
                            placeholder="First Name"
                            {...fnameBind}
                        />
                        {props.error.firstname && (
                            <p className="help is-danger">{props.error.firstname}</p>
                        )}
                    </div>
                    <div className="mb-5">
                        <label
                            className="block text-yume-text-black text-sm font-bold mb-2"
                            htmlFor="lastname"
                        >
                        Last Name
                        </label>
                        <input
                            className="shadow appearance-none border  rounded w-full py-2 px-3 text-yume-text mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="lastname"
                            type="text"
                            placeholder="Last Name"
                            {...lnameBind}
                        />
                        {props.error.lastname && (
                            <p className="help is-danger">{props.error.lastname}</p>
                        )}
                    </div>
                    <div className="mb-5">
                        <label
                            className="block text-yume-text-black text-sm font-bold mb-2"
                            htmlFor="email"
                        >
                        Email
                        </label>
                        <input
                            className="shadow appearance-none border  rounded w-full py-2 px-3 text-yume-text mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="text"
                            placeholder="Email"
                            {...emailBind}
                        />
                        {props.error.email && (
                            <p className="help is-danger">{props.error.email}</p>
                        )}
                    </div>
                    <div className="mb-5">
                        <label
                            className="block text-yume-text-black text-sm font-bold mb-2"
                            htmlFor="password"
                        >
                        Password
                        </label>
                        <input
                            className="shadow appearance-none border  rounded w-full py-2 px-3 text-yume-text mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="Password"
                            {...passwordBind}
                        />
                        {props.error.password && (
                            <p className="help is-danger">{props.error.password}</p>
                        )}
                    </div>
                    <div className="mb-7">
                        <label
                            className="block text-yume-text-black text-sm font-bold mb-2"
                            htmlFor="bday"
                        >
                        Date of Birth
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-yume-text mb-6 leading-tight focus:outline-none focus:shadow-outline"
                            id="bday"
                            type="date"
                            {...bdayBind}
                        />
                        {props.error.bday && (
                            <p className="help is-danger">{props.error.bday}</p>
                        )}
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                        className="bg-yume-red hover:bg-yume-red-darker text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                        >
                        Register
                        </button>
                    </div>
                </form>
                }
                
            </div>
        </div>
    );
}

export default RegisForm;