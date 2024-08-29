import { Switch, Button } from 'antd';
import React from 'react';
import styled from 'styled-components';

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
            <SettingWrapper>
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

                <TextContainer>
                    <ToggleWrapper>
                        <SwitchWithText
                            isTextCentered={isTextCentered}
                            setIsTextCentered={setIsTextCentered}
                        />
                    </ToggleWrapper>
                </TextContainer>

                <ModalContainer>
                    <PromptModal
                        prompt={prompt}
                        setPrompt={setPrompt}
                        imagePrompt={imagePrompt}
                        setImagePrompt={setImagePrompt}
                        isTextCentered={isTextCentered}
                    />
                </ModalContainer>
            </SettingWrapper>
    );
};

export default ExamSetting2;

const SettingWrapper = styled.div`
    display: flex;
    flex-direction: wrap;
    gap: 15px;
    padding: 20px;
    justify-content: center;
    align-items: center;
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

const TextContainer = styled.div`
    // margin-top: 20px;
`;

const ModalContainer = styled.div`
    // margin: 20px;
`;

const ToggleWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
`;
