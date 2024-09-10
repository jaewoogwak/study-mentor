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
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

import PDFViewer from './PDFViewer';
import PDFDownload from './PDFDownload';
import { useAuth } from '../contexts/AuthContext';

import axios from 'axios';
import ProgressBar from '../components/progressBar';

const PDFUpload = ({
    examData,
    setExamData,
    multipleChoice,
    shortAnswer,
    essay,
    examNumber,
    prompt,
    isTextCentered,
    imagePrompt,
    isLectureOnly,
    deductCredit,
}) => {
    const [fileState, setFileState] = React.useState(null);
    const [fileType, setFileType] = React.useState(null);
    const [pdfFile, setPdfFile] = React.useState(null);
    const { user, login, logout } = useAuth();
    const [processState, setProcessState] = React.useState(null);

    useEffect(() => {

        const downloadFile = async () => {
            try {
                const storage = getStorage();

                if (user) {
                    const fileNames = user.email.split('@')[0];
                    const storageRef = ref(
                        storage,
                        'pdfs/' + fileNames + '.pdf'
                    );

                    if (storageRef) {
                        const url = await getDownloadURL(storageRef);
                        const response = await fetch(url);
                        const blob = await response.blob();
                        setPdfFile(blob);
                        setFileState('done');
                    }
                }
            } catch (error) {
                console.error('error', error);
            }
        };

        downloadFile();
    }, [fileState, examData, fileType, user, processState]);

    // const saveExamToFirebase = async (data) => {
    //     try {
    
    //         if (!user) {
    //             console.error('User is not authenticated');
    //             return;
    //         }
    
    //         const userId = user.uid;
    //         const isArray = Array.isArray(data);
    //         const savedata = isArray ? { items: data } : data;
    
    //         if (savedata && Object.keys(savedata).length > 0) {
    //             const docId = `exam_${new Date().getTime()}`;
    //             const userDocRef = doc(db, 'users', userId, 'exams', docId);
    
    //             const docContent = {
    //                 ...savedata,
    //                 timestamp: new Date(),  
    //             };
    
    //             await setDoc(userDocRef, docContent);
    //             console.log('Document written for user ID:', userId, 'Document ID:', docId);
    //         } else {
    //             console.error('No data to save');
    //         }
    //     } catch (e) {
    //         console.error('Error adding document:', e.message);
    //     }
    // };    
      
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

            setFileState('uploading');
            if (info.file.size > 50000000) {
                message.error('파일 크기는 50MB 이하여야 합니다.');
                setFileState('error');
            }

            if (status !== 'uploading') {
                // console.log('🔃', info.file, info.fileList);
            }
            if (status === 'done') {
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

            console.log('file size', file.size);
            if (file.size > 50000000) {
                message.error('파일 크기는 50MB 이하여야 합니다.');
                setFileState('error');
                return false;
            }

            const examSetting = {
                multipleChoice: multipleChoice,
                shortAnswer: shortAnswer,
                essay: essay,
                examNumber: examNumber,
                custom_prompt: prompt,
                custom_image_prompt: imagePrompt,
                isTextCentered: isTextCentered,
                isLectureOnly: isLectureOnly,
            };

            if (!examSetting.multipleChoice) {
                examSetting.multipleChoice = 2;
            }
            if (!examSetting.shortAnswer) {
                examSetting.shortAnswer = 2;
            }

            formData.append('file', file);
            formData.append('examSetting', JSON.stringify(examSetting));

            const type =
                file.type === 'application/pdf'
                    ? '/upload/pdf'
                    : '/upload/image';

            const token = await user.getIdToken();

            axios({
                url: `${import.meta.env.VITE_API_URL}${type}`,
                method: 'POST',
                responseType: 'json',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
                data: formData,
            })
                .then((response) => {
                    setFileState('done');
                    setFileType('pdf');

                    setExamData(response.data);
                    // saveExamToFirebase(response.data);

                    localStorage.setItem(
                        'examData',
                        JSON.stringify(response.data)
                    );

                    deductCredit();
                })
                .catch((error) => {
                    console.error('Error:', error);
                    message.error('Failed to upload PDF file.');
                    setFileState('error');
                });
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
                            // console.log('File available at', downloadURL);
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
            <ProgressBar />
            {fileType === 'pdf' ? (
                <div> {processState}</div>
            ) : (
                <div>{[processState]}</div>
            )}
        </StatusWrapper>
    ) : fileState === 'done' ? (
        <PDFViewerWrapper>
            <GeneratePDFBtn
                onClick={() => {
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
                            setExamData(null);
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });

                    localStorage.removeItem('examData');
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
            ⛔ 파일 업로드에 실패했어요. <br />
            새로고침 후 다시 시도해 주세요.
        </StatusWrapper>
    ) : (
        <DraggerWrapper>
            <Dragger
                {...props}
                style={{
                    fontFamily: 'Pretendard-Regular',
                    padding: '0px 100px',
                    backgroundColor: '#F5F6FF',
                    height: '144px',
                }}
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
        </DraggerWrapper>
    );
};

export default PDFUpload;

const PDFViewerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

const StatusWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 24px;
    margin-top: 30px;
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

const DraggerWrapper = styled.div`
    width: 700px;
    display: flex;
    justify-content: center;

    @media (max-width: 768px) {
        width: 90%;
        padding: 0 10px; /* 모바일에서 좌우 패딩 추가 */
    }

    @media (max-width: 768px) {
        .ant-upload {
            height: 200px !important; /* 모바일에서 높이 조정 */
        }
    }
`;
