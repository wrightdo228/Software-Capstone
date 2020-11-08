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

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch('/api/authentication/login', {
            body: JSON.stringify({ email, password }),
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
        });

        if (response.ok) {
            console.log(response);
            console.log('Logged in');
        } else {
            console.log('Could not log in');
        }
    };

    return (
        <div>
            <RegisterForm onSubmit={handleSubmit}>
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
