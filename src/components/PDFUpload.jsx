import React, { useEffect } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
const { Dragger } = Upload;
import {
    getStorage,
    ref,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import ProgressBar from '../components/progressBar';
import styled from 'styled-components';
import PDFViewer from './PDFViewer';

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
    const { user } = useAuth();
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
        async onChange(info) {
            const { status } = info.file;

            // setFileState('uploading');

            // // ip check
            // function isAllowedIP(ip) {
            //     const allowedIPs = ['211.57.219.176/24']; // 학교 네트워크 IP 범위
            //     return allowedIPs.some((allowedRange) =>
            //         ip.startsWith(allowedRange.split('/')[0])
            //     );
            // }
            // const response = await axios.get('https://jsonip.com/');
            // console.log('IP:', response.data.ip);
            // if (!isAllowedIP(response.data.ip)) {
            //     message.error('학교 네트워크에서만 접근 가능합니다.');
            //     console.error('학교 네트워크에서만 접근 가능합니다.');
            //     setFileState('error'); // 상태를 error로 설정
            //     return false; // 업로드 중단
            // }

            if (info.file.size > 50000000) {
                message.error('파일 크기는 50MB 이하여야 합니다.');
                setFileState('error');
            }
            if (status === 'done') {
                message.success(
                    `${info.file.name} file uploaded successfully.`
                );
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
                setFileState('error');
            }

            setFileState('uploading');
        },
        async beforeUpload(file) {
            const formData = new FormData();
            console.log('file size', file.size);
            if (file.size > 50000000) {
                message.error('파일 크기는 50MB 이하여야 합니다.');
                setFileState('error');
                return false;
            }
            const examSetting = {
                multipleChoice: multipleChoice || 2,
                shortAnswer: shortAnswer || 2,
                essay: essay,
                examNumber: examNumber,
                custom_prompt: prompt,
                custom_image_prompt: imagePrompt,
                isTextCentered: isTextCentered,
                isLectureOnly: isLectureOnly,
            };
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

    return fileState === 'uploading' && fileState !== 'error' ? (
        <StatusWrapper>
            <ProgressBar />
            {fileType === 'pdf' ? (
                <div>{processState}</div>
            ) : (
                <div>{processState}</div>
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
        padding: 0 10px;
    }

    @media (max-width: 768px) {
        .ant-upload {
            height: 200px !important;
        }
    }
`;
