import { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const RegisterForm = styled.form`
    max-width: 700px;
    border-radius: 10px;
    padding: 32px 117px;
    border: 1px solid #c4c4c4;
    margin: 75px auto 0 auto;
    background-color: #fff;

    label {
        margin-bottom: 36px;
        display: block;
    }

    label:last-of-type {
        margin-bottom: 0;
    }
`;

const Register = () => {
    const router = useRouter();
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
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
        });

        if (response.ok) {
            router.push('/');
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
