import { useEffect, useState } from 'react';

function useImageUpload(intialPreviewImage) {
    const [imagePreview, setImagePreview] = useState(
        intialPreviewImage || null,
    );
    const [imageFile, setImageFile] = useState(null);

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const img = event.target.files[0];
            setImageFile(img);
        }
    };

    useEffect(() => {
        if (imageFile) {
            setImagePreview(URL.createObjectURL(imageFile));
        }
    }, [imageFile]);

    return [imageFile, handleImageChange, imagePreview];
}

export default useImageUpload;
