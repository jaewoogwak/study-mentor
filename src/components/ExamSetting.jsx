import { Switch, Button } from 'antd';
import React from 'react';
import styled from 'styled-components';
import ExamNumberInput from '../components/ExamNumberInput';
import PromptModal from './PromptModal';
import SwitchWithText from './SwitchWithText';
import ExamGenToggle from './ExamGenToggle';

const ExamSetting = ({
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
        <UploadInfoContainer>
            <OverlayBox>How To Make?</OverlayBox>
            <h1 style={{ marginTop: '10px' }}>시험 문제 생성 설정</h1>
            <p style={{ marginTop: '20px' }}>
                1. 생성할 시험 문제 개수와 유형을 선택하세요. (혼합 선택 가능)
            </p>
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
                </SwitchWrapper>

                <SwitchWrapper>
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
                    <p style={{ marginBottom: '20px' }}>
                        2. 학습 자료를 어떠한 방식으로 분석할지 선택해주세요.
                    </p>
                    <ToggleWrapper>
                        <SwitchWithText
                            isTextCentered={isTextCentered}
                            setIsTextCentered={setIsTextCentered}
                        />
                        <ExamGenToggle
                            isLectureOnly={isLectureOnly}
                            setIsLectureOnly={setIsLectureOnly}
                        />
                    </ToggleWrapper>
                </TextContainer>

                <ModalContainer>
                    <p style={{ marginBottom: '20px' }}>
                        3. 원하는 조건이 있다면, 프롬프트를 추가로 작성해보세요.
                    </p>
                    <PromptModal
                        prompt={prompt}
                        setPrompt={setPrompt}
                        imagePrompt={imagePrompt}
                        setImagePrompt={setImagePrompt}
                        isTextCentered={isTextCentered}
                    />
                </ModalContainer>
            </SettingWrapper>
        </UploadInfoContainer>
    );
};

export default ExamSetting;

const OverlayBox = styled.div`
    position: absolute;
    top: -15px;
    left: 20px;
    width: 150px;
    height: 15px;
    font-weight: bold;
    background-color: white;
    border: 2px solid;
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const UploadInfoContainer = styled.div`
    position: relative;
    width: 698px;
    height: 440px;
    border-radius: 10px;
    border: 2px solid grey;
    padding: 30px 30px 50px 30px;

    @media (max-width: 768px) {
        width: 90%; /* 모바일에서는 전체 너비의 90%를 차지 */
        padding: 20px; /* 모바일에서 패딩 조정 */
        height: auto; /* 높이는 자동으로 조정 */
    }
`;

const SettingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
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
    border-radius: 10px;
    padding: 5px;
    text-align: center;
    border: 2px solid;

    @media (max-width: 768px) {
        width: 50px; /* 모바일에서 입력 필드 너비 조정 */
        height: 30px; /* 모바일에서 높이 조정 */
    }
`;

const TextContainer = styled.div`
    margin-top: 20px;
`;

const ModalContainer = styled.div`
    margin: 20px;
`;

const ToggleWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
`;

const CustomPromptRecommandWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 14px;
    align-items: center;

    text-align: center;
    font-family: 'GmarketSansMedium';
`;

const CustomPromptRecommand = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    background: #b6dcee;
    color: #000;
    padding: 10px 5px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 10px;
    text-align: center;
    width: 310px;
    margin-bottom: 20px;
`;
