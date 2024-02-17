import React, { useEffect } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
const { Dragger } = Upload;
import styled from 'styled-components';

const ImageUpload = () => {
    const [fileState, setFileState] = React.useState(null);
    const [data, setData] = React.useState(null);

    useEffect(() => {
        console.log('fileState', fileState);
    }, [fileState, data]);

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
            console.log("beforeUpload's file", file);
            const formData = new FormData();
            // const address = 'http://172.30.1.50:5000/';
            const address = 'http://127.0.0.1:5000/upload/image';
            formData.append('file', file);

            // Perform your API call with the FormData

            // 업로드에 성공하면 true, 실패하면 false를 반환합니다.
            fetch(address, {
                method: 'POST',
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('data', data);
                    setFileState('done');
                    setData(data.extracted_text);
                })
                .catch((error) => console.error('Error:', error));

            return false; // Prevent default upload behavior
        },
    };

    return fileState === 'uploading' ? (
        <StatusWrapper>
            이미지 분석 중이에요. 잠시만 기다려 주세요
        </StatusWrapper>
    ) : fileState === 'done' ? (
        <StatusWrapper>
            이미지 분석 완료!
            <OCRResult>{data}</OCRResult>
        </StatusWrapper>
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
                클릭하거나 파일을 이곳으로 드래그하여 업로드하세요.
            </p>
            <p className='ant-upload-hint'>
                파일은 한 번에 최대 10개까지 업로드할 수 있습니다.
            </p>
        </Dragger>
    );
    // </Wrapper>
};

export default ImageUpload;

const StatusWrapper = styled.div`
    margin-top: 40px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 24px;
`;

const OCRResult = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 16px;
`;
