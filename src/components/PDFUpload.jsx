import React, { useEffect } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
const { Dragger } = Upload;
import { Document, Page, pdfjs } from 'react-pdf';

import styled from 'styled-components';
import { set } from 'firebase/database';
import PDFViewer from './PDFViewer';
import PDFDownload from './PDFDownload';

const PDFUpload = () => {
    const [fileState, setFileState] = React.useState(null);
    const [fileType, setFileType] = React.useState(null);
    const [data, setData] = React.useState(null);
    const [pdfFile, setPdfFile] = React.useState(null);

    useEffect(() => {
        console.log('fileState', fileState);
    }, [fileState, data, fileType]);

    const styles = {
        width: '100%',
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
            }
        },
        beforeUpload(file) {
            console.log("beforeUpload's file", file, file.type);
            const formData = new FormData();

            formData.append('file', file);

            if (file.type == 'application/pdf') {
                console.log('url', import.meta.env.VITE_APP_API_URL);
                fetch(`${import.meta.env.VITE_APP_API_URL}/upload/pdf`, {
                    method: 'POST',
                    body: formData,
                })
                    .then((response) => response.blob())
                    .then((blob) => {
                        setFileState('done');
                        setFileType('pdf');
                        setPdfFile(blob);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        message.error('Failed to upload PDF file.');
                    });
            } else if (file.type != 'application/image') {
                console.log('url', import.meta.env.VITE_APP_API_URL);

                fetch(`${import.meta.env.VITE_APP_API_URL}/upload/image`, {
                    method: 'POST',
                    body: formData,
                })
                    .then((response) => response.blob())
                    .then((blob) => {
                        setFileState('done');
                        setFileType('image');
                        setPdfFile(blob);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        message.error('Failed to upload image file.');
                    });
            } else {
                message.error('지원하지 않는 파일 형식입니다.');
                return false;
            }

            // return false; // Prevent default upload behavior
        },
    };

    return fileState === 'uploading' ? (
        <StatusWrapper>
            {fileType === 'pdf'
                ? 'PDF 분석 중이에요. 잠시만 기다려 주세요'
                : '이미지 분석 중이에요. 잠시만 기다려 주세요'}
        </StatusWrapper>
    ) : fileState === 'done' ? (
        <PDFViewerWrapper>
            <DownloadBtn
                onClick={() => {
                    const downloadUrl = window.URL.createObjectURL(
                        new Blob([pdfFile])
                    );

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
            <StatusWrapper>
                <PDFViewer path={URL.createObjectURL(pdfFile)} scale={1.5} />
            </StatusWrapper>
        </PDFViewerWrapper>
    ) : (
        <Dragger
            height={144}
            {...props}
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
    // </Wrapper>
};

export default PDFUpload;

const PDFViewerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`;

const StatusWrapper = styled.div`
    margin-top: 40px;
    width: 100%;
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
