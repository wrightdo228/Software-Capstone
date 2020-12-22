import styled from 'styled-components';
import Router from 'next/router';
import { useState, useEffect } from 'react';

const Profile = () => {
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const logout = async () => {
        const response = await fetch('/api/authentication/logout', {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
        });

        if (response.ok) {
            Router.push('/login');
        } else {
            console.log('error loggin out..');
        }
    };

    const upload = async () => {
        if (imageFile) {
            const formData = new FormData();

            formData.append('image', imageFile);

            const response = await fetch('/api/user/upload-avatar', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (response.ok) {
                console.log('success..');
            } else {
                console.log('fail..');
            }
        } else {
            console.log('no file provided..');
        }
    };

    useEffect(() => {
        if (imageFile) {
            setImage(URL.createObjectURL(imageFile));
        }
    }, [imageFile]);

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const img = event.target.files[0];
            setImageFile(img);
        }
    };

    return (
        <div>
            <button type="button" onClick={logout}>
                logout
            </button>
            <img src={image} alt="test" />
            <input type="file" name="avatar" onChange={handleImageChange} />
            <button type="button" onClick={upload}>
                Upload
            </button>
        </div>
    );
};

export default Profile;
