import { useState } from 'react';
import styled from 'styled-components';

const RegisterForm = styled.form`
    max-width: 700px;
    border-radius: 10px;
    padding: 32px 117px;
    border: 1px solid #c4c4c4;
    margin: 0 auto;

    label {
        margin-bottom: 36px;
        display: block;
    }

    label:last-child {
        margin-bottom: 0;
    }
`;

const Register = () => {
    const [formState, setFormState] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch('/api/account', {
            body: JSON.stringify(formState),
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
        });

        if (response.ok) {
            console.log('Account created...');
        } else {
            console.log('Account creation failed...');
        }
    };

    const changeFormValue = (key, value) => {
        setFormState({ ...formState, [key]: value });
    };

    return (
        <div>
            <RegisterForm onSubmit={handleSubmit}>
                <label htmlFor="email">
                    Email
                    <input
                        value={formState.email}
                        onChange={(e) =>
                            changeFormValue('email', e.target.value)
                        }
                        id="email"
                        type="email"
                        required
                    />
                </label>
                <label htmlFor="username">
                    Username
                    <input
                        id="username"
                        value={formState.username}
                        onChange={(e) =>
                            changeFormValue('username', e.target.value)
                        }
                        type="text"
                        required
                    />
                </label>
                <label htmlFor="password">
                    Password
                    <input
                        id="password"
                        value={formState.password}
                        onChange={(e) =>
                            changeFormValue('password', e.target.value)
                        }
                        type="password"
                        required
                    />
                </label>
                <label htmlFor="confirm-password">
                    Confirm Password
                    <input
                        value={formState.confirmPassword}
                        onChange={(e) =>
                            changeFormValue('confirmPassword', e.target.value)
                        }
                        id="confirm-password"
                        type="password"
                        required
                    />
                </label>
                <button type="submit">Create Account</button>
            </RegisterForm>
        </div>
    );
};

export default Register;
