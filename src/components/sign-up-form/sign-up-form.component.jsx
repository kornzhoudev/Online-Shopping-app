import { useState } from "react";
import FormInput from "../form-input/form-input.component";
import Button from "../button/button.component";
import {
    createAuthUserWithEmailAndPassword,
    createUserDocumentFromAuth
} from "../../utils/firebase/firebase.utils";

import { SignUpContainer } from './sign-up-form.styles';

const defaultFormFields = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
};

const SignUpForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { displayName, email, password, confirmPassword } = formFields;

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        try {
            const { user } = await createAuthUserWithEmailAndPassword(email, password);

            await createUserDocumentFromAuth(user, { displayName });
            resetFormFields();
        } catch (error) {
            if(error.code === 'auth/email-already-in-use'){
                alert('Email is already in use');
            } else {
                console.log('user creation encountered an error', error);
            }
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormFields({ ...formFields, [name]: value });
    }

    const formList = [
        {
            type: 'text',
            name: 'displayName',
            label: 'Display Name',
            value: displayName,
        },
        {
            type: 'email',
            name: 'email',
            label: 'Email',
            value: email,
        },
        {
            type: 'password',
            name: 'password',
            label: 'Password',
            value: password,

        },
        {
            type: 'password',
            name: 'confirmPassword',
            label: 'Confirm Password',
            value: confirmPassword,
        }
    ];

    return (
        <SignUpContainer>
            <h2>Don't have an account?</h2>
            <span>Sign with your email and password</span>
            <form onSubmit={handleSubmit}>
                {formList.map(({ type, name, label, value }) => (
                    <FormInput
                        key={name}
                        label={label}
                        inputOptions={{
                            type: type, 
                            name:name,
                            value: value,
                            required: true,
                            onChange:handleChange
                        }}
                    />
                ))}
                <Button type="submit">Sign Up</Button>
            </form>
        </SignUpContainer>
    );
}

export default SignUpForm;