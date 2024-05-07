import { Switch } from 'antd';
import React from 'react';
import styled from 'styled-components';
import ExamNumberInput from '../components/ExamNumberInput';
import PromptModal from './PromptModal';
import SwitchWithText from './SwitchWithText';

const ExamSetting = ({
    prompt,
    setPrompt,
    imagePrompt,
    setImagePrompt,
    multipleChoice,
    setMultipleChoice,
    shortAnswer,
    setShortAnswer,
    essay,
    setEssay,
    examNumber,
    setExamNumber,
    checked,
    setChecked,
    isTextCentered,
    setIsTextCentered,
}) => {
    return (
        <UploadInfoContainer>
            <h1>시험 문제 생성 설정</h1>
            <SettingWrapper>
                <SwitchWrapper>
                    객관식
                    <ExamNumberInput
                        min={1}
                        max={20}
                        defaultValue={2}
                        onChange={(value) => {
                            setMultipleChoice(value);
                        }}
                    />
                </SwitchWrapper>

                <SwitchWrapper>
                    주관식
                    <ExamNumberInput
                        min={1}
                        max={20}
                        defaultValue={2}
                        onChange={(value) => {
                            setShortAnswer(value);
                        }}
                    />
                </SwitchWrapper>
                <SwitchWrapper>
                    서술형
                    <ExamNumberInput
                        min={1}
                        max={20}
                        defaultValue={2}
                        onChange={(value) => {
                            setEssay(value);
                        }}
                    />
                </SwitchWrapper>

                <SwitchWithText
                    isTextCentered={isTextCentered}
                    setIsTextCentered={setIsTextCentered}
                />
                <PromptModal
                    prompt={prompt}
                    setPrompt={setPrompt}
                    imagePrompt={imagePrompt}
                    setImagePrompt={setImagePrompt}
                    isTextCentered={isTextCentered}
                />
            </SettingWrapper>
        </UploadInfoContainer>
    );
};

export default ExamSetting;

const UploadInfoContainer = styled.div`
    width: 698px;
    height: 300px;
    border-radius: 20px;
    /* border: 0.5px solid gray; */
    padding: 20px;
`;

const SettingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;
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
