import styled from 'styled-components';
import PropTypes from 'prop-types';
import UserAvatar from '../general/UserAvatar';
import useImageUpload from '../../customHooks/useImageUpload';

const UploadAvatar = ({ avatarUrl }) => {
    const [imageFile, handleImageChange, previewImage] = useImageUpload(
        avatarUrl,
    );

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

    return (
        <div>
            <UserAvatar avatarUrl={previewImage} />
            <input type="file" name="avatar" onChange={handleImageChange} />
            <button type="button" onClick={upload}>
                Upload
            </button>
        </div>
    );
};

UploadAvatar.propTypes = {
    avatarUrl: PropTypes.string,
};

export default UploadAvatar;
