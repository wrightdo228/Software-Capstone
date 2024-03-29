import { useState } from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import Link from 'next/link';

const LoginForm = styled.form`
    max-width: 700px;
    border-radius: 10px;
    padding: 32px 117px;
    border: 1px solid #c4c4c4;
    margin: 75px auto 0 auto;
    background-color: #fff;

    > label {
        font-size: 14px;
        margin-bottom: 36px;
        display: block;
    }

    > label:last-of-type {
        margin-bottom: 23px;
    }

    > p:first-of-type {
        margin-top: 16px;
        margin-bottom: 11px;
    }

    p {
        font-size: 12px;
    }

    .link-text {
        color: #0092e4;
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
            <LoginForm onSubmit={handleSubmit}>
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
                        type="password"
                        required
                    />
                </label>
                <button type="submit">Login</button>
                {/* <p>
                    Forgot your password?{' '}
                    <Link href="/change-password">
                        <a className="link-text">Click here</a>
                    </Link>
                </p> */}
                <p>
                    Don’t have an account?{' '}
                    <Link href="/register">
                        <a className="link-text">Register</a>
                    </Link>
                </p>
            </LoginForm>
        </div>
    );
};

export default Login;
