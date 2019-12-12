import { withApollo } from "../lib/apollo";
import {useState} from "react";
import { useApolloClient } from "@apollo/react-hooks";
import RegisForm from '../components/RegisForm';

function Registration() {
    const client = useApolloClient();
    const [error, setError] = useState({});

    const showError = (error, errorMsg) => {
        if (error == "firstname") {
            setError(prevError => {
                return {...prevError, firstname: errorMsg}
            });
        }
        if (error == "lastname") {
            setError(prevError => {
                return {...prevError, lastname: errorMsg}
            });
        }
        if (error == "email") {
            setError(prevError => {
                return {...prevError, email: errorMsg}
            });
        }
        if (error == "password") {
            setError(prevError => {
                return {...prevError, password: errorMsg}
            });
        }
        if (error == "bday") {
            setError(prevError => {
                return {...prevError, bday: errorMsg}
            });
        }
        
        //setError(errorMsg);
        // reset the error message after 3 seconds
        window.setTimeout(() => {
        setError({});
        }, 3000);
        return { error, showError };
    };

    //const toggleContent = ();

    return (
        <div className="flex h-screen justify-center items-center">
            <RegisForm
                
                error={error}
                
                showError={showError}
            />
        </div>
    );
}

export default withApollo(Registration);