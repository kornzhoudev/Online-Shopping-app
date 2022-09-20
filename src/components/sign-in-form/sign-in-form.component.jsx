import { useState } from "react";
import FormInput from "../form-input/form-input.component";
import Button, { BUTTON_TYPES_CLASSES } from "../button/button.component";
import {
    signInWithGooglePopup,
    signInAuthUserWithEmailAndPassword
} from "../../utils/firebase/firebase.utils";

import { SignInContainer, ButtonsContainer } from './sign-in-form.styles';

const defaultFormFields = {
    email: '',
    password: '',
};

const SignUpForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { email, password } = formFields;

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };

    const signInWithGoogle = async () => {
        await signInWithGooglePopup();

        
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await signInAuthUserWithEmailAndPassword(email, password);
            resetFormFields();
        } catch (error) {
            switch (error.code) {
                case 'auth/wrong-password':
                    alert('Incorrect password for email');
                    break;
                case 'auth/user-not-found':
                    alert('User not found');
                    break;
                default:
                    console.log(error);;
            }
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormFields({ ...formFields, [name]: value });
    }

    const formList = [
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

        }
    ];

    return (
        <SignInContainer>
            <h2>Already have an account?</h2>
            <span>Sign in with your email and password</span>
            <form onSubmit={handleSubmit}>
                {formList.map(({ type, name, label, value }) => (
                    <FormInput
                        key={name}
                        label={label}
                        inputOptions={{
                            type: type,
                            name: name,
                            value: value,
                            required: true,
                            onChange: handleChange
                        }}
                    />
                ))}
                <ButtonsContainer>
                    <Button type="submit">Sign In</Button>
                    <Button
                        type='button'
                        buttonType={BUTTON_TYPES_CLASSES.google}
                        onClick={signInWithGoogle}
                    >
                        Google Sign In
                    </Button>
                </ButtonsContainer>
            </form>
        </SignInContainer>
    );
}

export default SignUpForm;