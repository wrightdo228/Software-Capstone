import { useState } from 'react';
import styled from 'styled-components';
import Router from 'next/router';

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

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [{ isError, message }, setErrorState] = useState({
        isError: false,
        message: '',
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch('/api/authentication/login', {
            body: JSON.stringify({ email, password }),
            method: 'POST',
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
        });

        if (response.ok) {
            Router.push('/');
        } else if (response.status === 401) {
            setErrorState({
                isError: true,
                message: 'Unable to find a user with those credentials',
            });
        } else {
            setErrorState({
                isError: true,
                message: 'Error logging in',
            });
        }
    };

    return (
        <div>
            <RegisterForm onSubmit={handleSubmit}>
                {isError && <p>{message}</p>}

                <label htmlFor="email">
                    Email
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        id="email"
                        type="email"
                        required
                    />
                </label>
                <label htmlFor="password">
                    Password
                    <input
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="text"
                        required
                    />
                </label>
                <button type="submit">Login</button>
            </RegisterForm>
        </div>
    );
};

export default Login;
