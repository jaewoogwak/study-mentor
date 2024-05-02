import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import PromptInput from './PromptInput';
const PromptModal = ({
    prompt,
    setPrompt,
    imagePrompt,
    setImagePrompt,
    isTextCentered,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
        console.log(prompt);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <Button type='primary' onClick={showModal}>
                시험문제 스타일 설정 하기
            </Button>
            <Modal
                title='시험문제 스타일 설정하기'
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={800}
            >
                <PromptInput
                    prompt={prompt}
                    setPrompt={setPrompt}
                    imagePrompt={imagePrompt}
                    setImagePrompt={setImagePrompt}
                    isTextCentered={isTextCentered}
                />
            </Modal>
        </>
    );
};
export default PromptModal;
