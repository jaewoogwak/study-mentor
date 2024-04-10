import React, { useEffect } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
const { Dragger } = Upload;
import { Document, Page, pdfjs } from 'react-pdf';

import styled from 'styled-components';
import { set } from 'firebase/database';
import { getStorage, ref } from 'firebase/storage';
import {
    getDownloadURL,
    uploadBytes,
    uploadBytesResumable,
    deleteObject,
} from 'firebase/storage';
import PDFViewer from './PDFViewer';
import PDFDownload from './PDFDownload';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import ProgressViewer from './ProgressViewer';

const PDFUpload = () => {
    const [fileState, setFileState] = React.useState(null);
    const [fileType, setFileType] = React.useState(null);
    const [data, setData] = React.useState(null);
    const [pdfFile, setPdfFile] = React.useState(null);
    const { user, login, logout } = useAuth();
    const [processState, setProcessState] =
        React.useState('파일을 업로드 하고 있어요');

    useEffect(() => {
        console.log('useEffect');
        const downloadFile = async () => {
            try {
                const storage = getStorage();

                // 유저 이름으로 파일 이름을 만들어서 저장

                if (user) {
                    const fileNames = user.email.split('@')[0];
                    const storageRef = ref(
                        storage,
                        'pdfs/' + fileNames + '.pdf'
                    );
                    console.log('storageRef', storageRef);

                    if (storageRef) {
                        const url = await getDownloadURL(storageRef);
                        console.log('url', url);
                        const response = await fetch(url);
                        const blob = await response.blob();
                        console.log('blob', blob);
                        setPdfFile(blob);
                        setFileState('done');
                    }
                }
            } catch (error) {
                console.error('error', error);
            }
        };

        downloadFile();
    }, [fileState, data, fileType, user, processState]);

    const styles = {
        width: '700px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    };

    const props = {
        name: 'file',
        multiple: true,
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        onChange(info) {
            const { status } = info.file;
            console.log("onChange's info", status);
            setFileState('uploading');
            if (status !== 'uploading') {
                console.log('🔃', info.file, info.fileList);
            }
            if (status === 'done') {
                console.log('👍', info.file.response);
                message.success(
                    `${info.file.name} file uploaded successfully.`
                );
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
                setFileState('error');
            }
        },
        async beforeUpload(file) {
            console.log("beforeUpload's file", file, file.type);
            const formData = new FormData();

            formData.append('file', file);

            const type =
                file.type === 'application/pdf'
                    ? '/upload/pdf'
                    : '/upload/image';

            try {
                setFileState('uploading');

                // 1. /upload/pdf or /upload/image로 파일 업로드 [POST]
                const response = await axios({
                    url: `${import.meta.env.VITE_APP_API_URL}${type}`,
                    method: 'POST',
                    responseType: 'text',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },

                    data: formData,
                });
                console.log('Res', response);

                if (response.status !== 200) {
                    message.error('Failed to upload file.');
                    setFileState('error');
                    return false;
                }

                if (response.status === 200) {
                    // setProcessState(response.data);
                }

                console.log('###2');
                const dataResponse = await axios({
                    url: `${import.meta.env.VITE_APP_API_URL}${type}`,
                    method: 'GET',
                });

                console.log('dataResponse', dataResponse);

                // setProcessState('파일 다운로드 중..');

                // 3. /get 경로에서 데이터 받기 [POST]
                // 이벤트스트림으로 데이터 받기

                const data = await axios({
                    url: `${import.meta.env.VITE_APP_API_URL}/upload/get`,
                    method: 'POST',
                    responseType: 'blob',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log('pdf data', data);
                setFileState('done');
                // setProcessState('파일 다운로드 완료');
                setFileType('pdf');
                setPdfFile(data.data);
                uploadFileToFirebase(data.data);

                console.log('#### end');
            } catch (error) {
                console.error('Error:', error);
                message.error('Failed to upload PDF file.');
                setFileState('error');
            }

            // return false; // Prevent default upload behavior
        },
    };

    const uploadFileToFirebase = async (blob) => {
        try {
            const storage = getStorage();

            const fileNames = user.email.split('@')[0];
            const storageRef = ref(storage, 'pdfs/' + fileNames + '.pdf');

            const uploadTask = uploadBytesResumable(storageRef, blob);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    console.error('error', error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            console.log('File available at', downloadURL);
                        }
                    );
                }
            );
        } catch (error) {
            console.error('error', error);
        }
    };

    return fileState === 'uploading' ? (
        <StatusWrapper>
            {fileType === 'pdf' ? (
                <div> {processState}</div>
            ) : (
                <div>{[processState]}</div>
            )}
        </StatusWrapper>
    ) : fileState === 'done' ? (
        <PDFViewerWrapper>
            <DownloadBtn
                onClick={() => {
                    const downloadUrl = window.URL.createObjectURL(pdfFile);
                    console.log('downloadUrl', downloadUrl, pdfFile);
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.setAttribute('download', 'study-mentor.pdf');
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                }}
            >
                문제 저장하기
            </DownloadBtn>
            <GeneratePDFBtn
                onClick={() => {
                    // firebase에 저장된 파일 삭제
                    const storage = getStorage();
                    const fileNames = user.email.split('@')[0];
                    const storageRef = ref(
                        storage,
                        'pdfs/' + fileNames + '.pdf'
                    );
                    deleteObject(storageRef)
                        .then(() => {
                            console.log('File deleted successfully');
                            setFileState(null);
                            setPdfFile(null);
                            setFileType(null);
                            setData(null);
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                }}
            >
                문제 새로 생성하기
            </GeneratePDFBtn>
            <StatusWrapper>
                <PDFViewer path={pdfFile} scale={1.5} />
            </StatusWrapper>
        </PDFViewerWrapper>
    ) : fileState === 'error' ? (
        <StatusWrapper>
            파일 업로드에 실패했어요. 다시 시도해 주세요.
        </StatusWrapper>
    ) : (
        <Dragger
            height={144}
            {...props}
            style={styles}
            // action='http://
        >
            <p className='ant-upload-drag-icon'>
                <InboxOutlined />
            </p>
            <p className='ant-upload-text'>
                클릭하거나 이미지 또는 PDF 파일을 이곳으로 드래그하여
                업로드하세요.
            </p>
            <p className='ant-upload-hint'>
                파일은 한 번에 최대 10개까지 업로드할 수 있습니다.
            </p>
        </Dragger>
    );
};

export default PDFUpload;

const PDFViewerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    /* height: 100%; */
`;

const StatusWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 24px;
`;

const DownloadBtn = styled.button`
    width: 100%;
    height: 100%;
    font-size: 24px;
    color: #ab41ff;
    text-decoration: none;
    cursor: pointer;
    border: none;
    background-color: white;
    margin-top: 20px;
    &:hover {
        color: #ff6b6b;
    }
`;

const GeneratePDFBtn = styled.button`
    width: 100%;
    height: 100%;
    font-size: 24px;
    color: #ab41ff;
    text-decoration: none;
    cursor: pointer;
    border: none;
    background-color: white;
    margin-top: 20px;
    &:hover {
        color: #ff6b6b;
    }
`;
