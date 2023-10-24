
import './Reath.css'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import AuthServices from '../../Services/AuthServices';
import ToastifyServices from '../../Services/ToastifyServices';
import { setShowForm } from '../../features/inputValue/Inputvalue';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import API_ENDPOINT from '../../EndPoint';
import { setDummyImage, setDummyImageoriginal, setFlag, setImageUrl, setImageUrlForBase64, setselectedImagefullData } from '../../features/dummyImage';
import { Box } from '@mui/material';
import { SetShirtMask } from '../../features/modalResultImage';
import LinearWithValueLabel from '../LinearWithValueLabel';
const Reath = () => {
    const selectedfileref = useRef('');
    const selectedFileRef = (name) => {
        selectedfileref.current = name
    }
    // for xlsx 

    const [xlsxFile_url, setxlsxFile_url] = useState('')
    const [fileSize, setFileSize] = useState(0);
    const [fileName, setFileName] = useState("");





    const [progressBarShowFile, setprogressBarShowFile] = useState(false);

    const [progressBarShowImage, setprogressBarShowImage] = useState(false);

    const [progressBarShowPdf, setprogressBarShowPdf] = useState(false);



    const [image, setImage] = useState('');
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const timerRef = useRef();
    const [progress, setProgress] = useState(0);


    // for images 

    const [image_url, setImageURL] = useState("")


    //  for pdf 
    const [pdfFile_url, setPdfFile_url] = useState('')

    useEffect(() => {
        setProgress(0);
        const intervalDuration = 200;

        timerRef.current = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100 || oldProgress === 80
                    &&
                    !xlsxFile_url
                ) {
                    clearInterval(timerRef.current);
                    return oldProgress;
                }

                const newProgress = oldProgress + 1;
                return newProgress;
            });
        }, intervalDuration);

        return () => {
            clearInterval(timerRef.current);
        };

    }, [fileName]);

    useEffect(() => {
        if (xlsxFile_url) {
            setProgress(100);
            clearInterval(timerRef.current);
            // setTimeout(() => {
            //     SetRealImageFlag(true);
            // }, 500);



        }
        else {
            setProgress(0);
        }
    }, [xlsxFile_url]);



    const onDrop = useCallback(acceptedFiles => {

        const file = acceptedFiles[0];
        if (file) {

            if (selectedfileref.current == 'xslx') {

                setprogressBarShowFile(true)
                setxlsxFile_url('')
                setProgress(0);
                setFileName(file.name);
                setImage(URL.createObjectURL(file));
                setFileSize(file.size);
                handelSelectedFileXlsx(file);
                console.log('this is file')
            } else if (selectedfileref.current == 'image') {
                setprogressBarShowImage(true)
                handelSelectedFileImage(file)
                console.log('this is iamge')
            } else if (selectedfileref.current == 'pdf') {
                handleSelectedFilePDF(file)
            }

            // handelSelectedFileXlsx(file);
        }
    }, []);

    const formatFileSize = (size) => {
        if (size < 1024) return size + ' Bytes';
        else if (size >= 1024 && size < 1048576) return (size / 1024).toFixed(2) + ' KB';
        else if (size >= 1048576) return (size / 1048576).toFixed(2) + ' MB';
        return size + ' Bytes';
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const handelSelectedFileXlsx = async (file) => {
        try {
            const formData = new FormData();
            const validFileTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const validExtensions = ['xlsx'];

            if (!validFileTypes.includes(file.type) || !validExtensions.includes(fileExtension)) {
                ToastifyServices.showError("Please select a valid .xlsx file.")
                return;
            }

            formData.append("file", file);
            formData.append("upload_preset", "uts5ahls");
            formData.append("cloud_name", "dypgiir37");

            const response = await fetch("https://api.cloudinary.com/v1_1/dypgiir37/raw/upload", {
                body: formData,
                method: "post",
            });


            console.log("this is response", response)
            const data = await response.json();
            if (response.status !== 200) {
                console.error('Error uploading file:', data.error.message);
            }

            if (data.url) {
                console.log('This is my xlsxFile_url:', data.url)
                setxlsxFile_url(data.url)
            } else {
                console.log('Upload error')
            }
        } catch (err) {
            console.log(err);
        }
    };


    const handelSelectedFileImage = async (file) => {
        try {
            const formData = new FormData();
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

            if (!validImageTypes.includes(file.type) || !validExtensions.includes(fileExtension)) {
                ToastifyServices.showError("Please select a valid image format (jpg, jpeg, png, or gif).")
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
                console.log('this is my image url', data.url)
                setImageURL(data.url);

            }
            else {
                console.log('this is error')
            }
        } catch (err) {
            console.log(err);
        }
    };


    const handleSelectedFilePDF = async (file) => {
        try {
            const formData = new FormData();

            // PDF ke liye MIME type aur extension check karein
            const validFileTypes = ['application/pdf'];
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const validExtensions = ['pdf'];

            if (!validFileTypes.includes(file.type) || !validExtensions.includes(fileExtension)) {
                ToastifyServices.showError("Please select a valid .pdf file.")
                return;
            }

            formData.append("file", file);
            formData.append("upload_preset", "uts5ahls");
            formData.append("cloud_name", "dypgiir37");

            const response = await fetch("https://api.cloudinary.com/v1_1/dypgiir37/raw/upload", {
                body: formData,
                method: "post",
            });

            console.log("this is response", response)
            const data = await response.json();
            if (response.status !== 200) {
                console.error('Error uploading file:', data.error.message);
            }

            if (data.url) {
                console.log('This is my pdfFile_url:', data.url)
                setPdfFile_url(data.url)  // Yahan aapko ek alag state variable use karni hogi jaise ki setPdfFile_url
            } else {
                console.log('Upload error')
            }
        } catch (err) {
            console.log(err);
        }
    };


    const EmptyxlsxFile = () => {
        setxlsxFile_url('')
        setprogressBarShowFile(false)
        setFileName('')
    }


    return (
        <div className='ReathContainer'>
            <p className="steps">
                Step 1 of 3
            </p>
            <p className="uploadDocuments">
                Upload property documents
            </p>
            <div className="itemsdivContainer">

                {/* for xslx  */}
                <div className="itemDiv">
                    <p className="heading1">
                        1. Financial Data
                    </p>
                    <p className="description">
                        Upload Excel files here that contain property financials, comp data, charts and any other tables you want displayed in the OM.
                    </p>
                    <div onClick={() => { selectedFileRef("xslx") }}>


                        <div {...getRootProps()} className="uploadDiv">
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="36" height="36" rx="18" fill="#0061FF" fill-opacity="0.1" />
                                <path d="M11 21.25V23.125C11 23.6223 11.1975 24.0992 11.5492 24.4508C11.9008 24.8025 12.3777 25 12.875 25H24.125C24.6223 25 25.0992 24.8025 25.4508 24.4508C25.8025 24.0992 26 23.6223 26 23.125V21.25M14.75 13.75L18.5 10M18.5 10L22.25 13.75M18.5 10V21.25" stroke="url(#paint0_linear_907_54)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                <defs>
                                    <linearGradient id="paint0_linear_907_54" x1="11" y1="17.5" x2="26" y2="17.5" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#0061FF" />
                                        <stop offset="1" stop-color="#60EFFF" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            <p className="draganddrop">
                                Drag & drop file to upload
                            </p>

                        </div>
                    </div>
                    {progressBarShowFile && <span className="uploadingfileProgress">
                        <p className="fileNameDiv">
                            <span>


                                <svg style={{ marginRight: ' 12px' }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.8067 6.2125C17.8132 6.15853 17.8132 6.10397 17.8067 6.05C17.809 6.03132 17.809 6.01244 17.8067 5.99375C17.7768 5.92559 17.7368 5.86237 17.6879 5.80625L13.3129 1.43125C13.2568 1.38236 13.1936 1.34232 13.1254 1.3125H13.0692L12.8567 1.25H6.56299C6.06572 1.25 5.58877 1.44753 5.23714 1.79915C4.88551 2.15078 4.68799 2.62773 4.68799 3.125V15.625C4.68799 15.7908 4.75381 15.9497 4.87106 16.0669C4.98824 16.1842 5.14722 16.25 5.31299 16.25H15.938C16.4353 16.25 16.9122 16.0525 17.2638 15.7009C17.6155 15.3492 17.813 14.8723 17.813 14.375V6.25C17.813 6.25 17.8067 6.25 17.8067 6.2125H17.8067ZM15.6817 5.625H14.0629C13.8972 5.625 13.7382 5.55918 13.621 5.44193C13.5037 5.32475 13.4379 5.16577 13.4379 5V3.38125L15.6817 5.625ZM15.9379 15H5.9379V3.125C5.9379 2.95925 6.00373 2.80027 6.12097 2.68307C6.23816 2.56581 6.39714 2.5 6.5629 2.5H12.1879V5C12.1879 5.49727 12.3854 5.97422 12.7371 6.32585C13.0887 6.67748 13.5656 6.875 14.0629 6.875H16.5629V14.375C16.5629 14.5408 16.4971 14.6997 16.3798 14.8169C16.2627 14.9342 16.1037 15 15.9379 15Z" fill="#6EA3FA" />
                                    <path d="M8.43752 10H12.8125C13.0358 10 13.2421 9.88086 13.3538 9.6875C13.4655 9.49413 13.4655 9.25587 13.3538 9.0625C13.2422 8.86913 13.0358 8.75 12.8125 8.75H8.43752C8.21422 8.75 8.00791 8.86914 7.89624 9.0625C7.78459 9.25587 7.78459 9.49413 7.89624 9.6875C8.00789 9.88087 8.21421 10 8.43752 10Z" fill="#6EA3FA" />
                                    <path d="M14.0625 11.25H8.43752C8.21422 11.25 8.00791 11.3691 7.89624 11.5625C7.78459 11.7559 7.78459 11.9941 7.89624 12.1875C8.00789 12.3809 8.21421 12.5 8.43752 12.5H14.0625C14.2858 12.5 14.4921 12.3809 14.6038 12.1875C14.7155 11.9941 14.7155 11.7559 14.6038 11.5625C14.4922 11.3691 14.2858 11.25 14.0625 11.25Z" fill="#6EA3FA" />
                                    <path d="M14.0625 17.5H4.0625C3.89675 17.5 3.73777 17.4342 3.62057 17.317C3.50331 17.1998 3.4375 17.0408 3.4375 16.875V4.37502C3.4375 4.15172 3.31836 3.94541 3.125 3.83374C2.93163 3.72209 2.69337 3.72209 2.5 3.83374C2.30663 3.94539 2.1875 4.15171 2.1875 4.37502V16.875C2.1875 17.3723 2.38503 17.8492 2.73665 18.2009C3.08828 18.5525 3.56523 18.75 4.0625 18.75H14.0625C14.2858 18.75 14.4921 18.6309 14.6038 18.4375C14.7154 18.2442 14.7154 18.0059 14.6038 17.8125C14.4921 17.6192 14.2858 17.5 14.0625 17.5Z" fill="#6EA3FA" />

                                </svg>

                                {fileName}
                            </span>
                            <span className="sizeDiv">

                                {formatFileSize(fileSize)}
                            </span>
                        </p>

                        <p className="fileNameDiv1">



                            <LinearWithValueLabel value={progress} />


                            <span onClick={EmptyxlsxFile} className="sizeDiv">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 15L15 5M5 5L15 15" stroke="#B4B5BB" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                            </span>
                        </p>
                    </span>}
                </div>



                {/* for images  */}

                <div className="itemDiv">
                    <p className="heading1">
                        2. Add property images
                    </p>
                    <p className="description">
                        Upload high quality images for interior and exterior spaces.
                    </p>
                    <div onClick={() => { selectedFileRef("image") }}>
                        <div {...getRootProps()} className="uploadDiv">
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="36" height="36" rx="18" fill="#0061FF" fill-opacity="0.1" />
                                <path d="M11 21.25V23.125C11 23.6223 11.1975 24.0992 11.5492 24.4508C11.9008 24.8025 12.3777 25 12.875 25H24.125C24.6223 25 25.0992 24.8025 25.4508 24.4508C25.8025 24.0992 26 23.6223 26 23.125V21.25M14.75 13.75L18.5 10M18.5 10L22.25 13.75M18.5 10V21.25" stroke="url(#paint0_linear_907_54)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                <defs>
                                    <linearGradient id="paint0_linear_907_54" x1="11" y1="17.5" x2="26" y2="17.5" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#0061FF" />
                                        <stop offset="1" stop-color="#60EFFF" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            <p className="draganddrop">
                                Drag & drop file to upload
                            </p>

                        </div>
                    </div>
                    {progressBarShowImage && <span className="uploadingfileProgress">
                        <p className="fileNameDiv">
                            <span>


                                <svg style={{ marginRight: ' 12px' }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.875 1.25H3.125C2.62773 1.25 2.15078 1.44753 1.79915 1.79915C1.44752 2.15078 1.25 2.62773 1.25 3.125V16.875C1.25 17.3723 1.44753 17.8492 1.79915 18.2009C2.15078 18.5525 2.62773 18.75 3.125 18.75H16.875C17.3723 18.75 17.8492 18.5525 18.2009 18.2009C18.5525 17.8492 18.75 17.3723 18.75 16.875V3.125C18.75 2.62773 18.5525 2.15078 18.2009 1.79915C17.8492 1.44752 17.3723 1.25 16.875 1.25ZM3.125 2.5H16.875C17.0408 2.5 17.1997 2.56582 17.3169 2.68307C17.4342 2.80025 17.5 2.95923 17.5 3.125V10.225L15.425 8.29367C15.3085 8.18104 15.1527 8.11802 14.9906 8.11802C14.8285 8.11802 14.6728 8.18104 14.5563 8.29367L9.3376 13.5187L6.0251 10.7562C5.91188 10.6594 5.7678 10.6061 5.61885 10.6061C5.4699 10.6061 5.32582 10.6594 5.2126 10.7562L2.5001 13.1875V3.125C2.5001 2.95925 2.56592 2.80027 2.68317 2.68307C2.80035 2.56581 2.95933 2.5 3.1251 2.5H3.125ZM2.5 16.875V14.8625L5.625 12.075L8.4375 14.4187L5.36883 17.5H3.12517C2.95941 17.5 2.80043 17.4342 2.68323 17.3169C2.56598 17.1997 2.50017 17.0408 2.50017 16.875H2.5ZM16.875 17.5H7.13133L15 9.61867L17.5 11.9373V16.8748C17.5 17.0406 17.4342 17.1996 17.3169 17.3168C17.1997 17.434 17.0408 17.4998 16.875 17.4998V17.5Z" fill="#6EA3FA" />
                                    <path d="M6.87507 9.37513C7.53808 9.37513 8.17403 9.11172 8.6429 8.6429C9.11177 8.17408 9.37513 7.53815 9.37513 6.87507C9.37513 6.21198 9.11172 5.5761 8.6429 5.10723C8.17408 4.63837 7.53815 4.375 6.87507 4.375C6.21198 4.375 5.5761 4.63842 5.10723 5.10723C4.63837 5.57605 4.375 6.21198 4.375 6.87507C4.375 7.53815 4.63842 8.17403 5.10723 8.6429C5.57605 9.11177 6.21198 9.37513 6.87507 9.37513ZM6.87507 5.62513C7.20658 5.62513 7.52455 5.75684 7.75892 5.99128C7.99335 6.22565 8.12507 6.54363 8.12507 6.87513C8.12507 7.20663 7.99336 7.52462 7.75892 7.75898C7.52455 7.99342 7.20657 8.12513 6.87507 8.12513C6.54357 8.12513 6.22558 7.99343 5.99122 7.75898C5.75678 7.52462 5.62507 7.20663 5.62507 6.87513C5.62507 6.54363 5.75677 6.22565 5.99122 5.99128C6.22558 5.75685 6.54357 5.62513 6.87507 5.62513Z" fill="#6EA3FA" />
                                </svg>


                                {fileName}
                            </span>
                            <span className="sizeDiv">

                                {formatFileSize(fileSize)}
                            </span>
                        </p>

                        <p className="fileNameDiv1">



                            <LinearWithValueLabel value={progress} />


                            <span onClick={EmptyxlsxFile} className="sizeDiv">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 15L15 5M5 5L15 15" stroke="#B4B5BB" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                            </span>
                        </p>
                    </span>}
                </div>








            </div>

        </div>
    )
}

export default Reath