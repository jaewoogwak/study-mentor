import { Switch, Button } from 'antd';
import React from 'react';
import Modal from 'react-modal';

import styled from 'styled-components';

import ExamSheetImg from '../assets/ExamSheetOption.png'
import ExamNumberInput from '../components/ExamNumberInput';
import PromptModal from './PromptModal';
import SwitchWithText from './SwitchWithText2';

const ExamSetting2 = ({
    prompt,
    setPrompt,
    imagePrompt,
    setImagePrompt,
    multipleChoice,
    setMultipleChoice,
    shortAnswer,
    setShortAnswer,
    isTextCentered,
    setIsTextCentered,
    isLectureOnly,
    setIsLectureOnly,
    isOpen, 
    onClose,
}) => {

    const handleMultipleChoiceChange = (e) => {
        const value = e.target.value;

        if (value === '' || /^[0-9\b]+$/.test(value)) {
            const numericValue = parseInt(value, 10);

            if (numericValue >= 1 && numericValue <= 10) {
                setMultipleChoice(numericValue);
            } else if (numericValue < 1) {
                setMultipleChoice(1);
            } else if (numericValue > 10) {
                setMultipleChoice(10);
            } else {
                setMultipleChoice('');
            }
        }
    };

    const handleShortAnswerChange = (e) => {
        const value = e.target.value;

        if (value === '' || /^[0-9\b]+$/.test(value)) {
            const numericValue = parseInt(value, 10);

            if (numericValue >= 1 && numericValue <= 10) {
                setShortAnswer(numericValue);
            } else if (numericValue < 1) {
                setShortAnswer(1);
            } else if (numericValue > 10) {
                setShortAnswer(10);
            } else {
                setShortAnswer('');
            }
        }
    };

    return (
        <Modal
                isOpen={isOpen}
                onClose={onClose}
                contentLabel="Exam Setting Options"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '500px', 
                        height: '520px',
                        textAlign: 'center',
                        border: '2px solid',
                        borderRadius: '10px',
                        fontFamily: 'Pretendard-Regular',
                    }
                }}                
            >   
                <InfoWrapper>
                    <InfoImg src={ExamSheetImg} alt="ExamSheetImg" />
                    <h2>Exam Setting Options</h2>
                </InfoWrapper>
                <SettingWrapper>
                    <TextSetting>몇 개의 문제를 생성하고 싶으신가요?</TextSetting>
                    <SwitchWrapper>
                        객관식
                        <SwitchInput
                            type='number'
                            min={1}
                            max={10}
                            value={multipleChoice}
                            onChange={handleMultipleChoiceChange}
                        />

                        주관식
                        <SwitchInput
                            type='number'
                            min={1}
                            max={10}
                            value={shortAnswer}
                            onChange={handleShortAnswerChange}
                        />
                    </SwitchWrapper>

                    <div>
                        <TextSetting>PDF 혹은 이미지가 어떤 형식인가요?</TextSetting>
                        <ToggleWrapper>
                            <SwitchWithText
                                isTextCentered={isTextCentered}
                                setIsTextCentered={setIsTextCentered}
                            />
                        </ToggleWrapper>
                    </div>

                    <div>
                        <TextSettingV2>원하는 스타일이 있다면, 버튼을 눌러 설정해보세요.</TextSettingV2>
                        <PromptModal
                            prompt={prompt}
                            setPrompt={setPrompt}
                            imagePrompt={imagePrompt}
                            setImagePrompt={setImagePrompt}
                            isTextCentered={isTextCentered}
                        />
                    </div>

                    <ApplyButton onClick={onClose}>적용하기</ApplyButton>

                </SettingWrapper>

        </Modal>
    );
};

export default ExamSetting2;

const InfoWrapper = styled.div`
    display: flex;  
    flex-direction: row;
    margin-top: 5px;
    align-items: center; 
    justify-content: center;
`;

const InfoImg = styled.img`
    width: 80px;
    margin-right: 10px;
`

const SettingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    justify-content: center;
    align-items: center;
`;

const TextSetting = styled.p`
    margin-top: 10px;
`;

const TextSettingV2 = styled.p`
    margin-bottom: 20px;
`;

const SwitchWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
`;

const SwitchInput = styled.input`
    border-radius: 5px;
    padding: 10px 15px;
    text-align: center;
    border: 2px solid;

    @media (max-width: 768px) {
        width: 50px; /* 모바일에서 입력 필드 너비 조정 */
        height: 30px; /* 모바일에서 높이 조정 */
    }
`;

const ToggleWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
`;

const ApplyButton = styled.button`
    width: 400px;
    margin-top: 30px;
    padding: 10px 20px;
    border-radius: 20px;
    border: 1px;
    background-color: #7DB249;
    color: white;
    font-family: 'Pretendard-Regular';
    font-size: 16px;

    &:hover,
    &:active {
        background-color: #AFD485; 
        color: white;
    }
`