import React, { useCallback, useEffect, useRef, useState } from 'react'
import './TryModal.css'
import { useDropzone } from 'react-dropzone';

const [image, setImage] = useState('');
const [image_url, setImageURL] = useState("")

const onDrop = useCallback(acceptedFiles => {

    dispatch(setShowForm(false))
    const file = acceptedFiles[0];
    if (file) {
        setImage(URL.createObjectURL(file));
        handelSelectedFile(file)
    }
}, []);

const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

const handelSelectedFile = async (file) => {
    setImageURL('')
    try {
        Setimageresult('');
        const formData = new FormData();
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

        if (!validImageTypes.includes(file.type) || !validExtensions.includes(fileExtension)) {
            ToastifyServices.showError("Please select a valid image format (jpg, jpeg, png, or gif).")
            setImageURL('')
            setImage('')
            return;
        }
        formData.append("file", file);
        formData.append("upload_preset", "uts5ahls");
        formData.append("cloud_name", "dypgiir37");
        const response = await fetch("https://api.cloudinary.com/v1_1/dypgiir37/image/upload", {
            body: formData,
            method: "post",
        });
        const data = await response.json();
        if (data.url) {
            console.log('this is result from aws image upload', data)
            setImageURL(data.url);
        }
        else {
            console.log('this is error')
        }
    } catch (err) {
        console.log(err);
    }
};





<div className="uploadPicImage" {...getRootProps()}>
    {image && !image_url && (<CircularProgress />)}
    {image_url && <img src={image_url} alt="User" />}
    <input {...getInputProps()} type="file" />
    {!image && !image_url && (
        <div>
            {isDragActive ? 'Drop the files here ...' : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <img style={{ width: '80px', height: '80px', textAlign: 'center', margin: '8px' }} src="photoicon.png" alt="" />
                    <p className='dragAndDrop'>Drag & Drop</p>
                    <p className='dragAndDrop2'>You can also browse for files</p>
                </div>
            )}
        </div>
    )}
</div>

