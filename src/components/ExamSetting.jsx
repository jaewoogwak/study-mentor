import { Switch } from 'antd';
import React, { useEffect } from 'react';
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
            <h1 style={{marginTop: "15px"}}>시험 문제 생성 설정</h1>
            <SettingWrapper>
                <SwitchWrapper>
                    객관식
                    <input
                        type='number'
                        min={1}
                        max={20}
                        value={multipleChoice}
                        onChange={(e) => {
                            setMultipleChoice(e.target.value);
                        }}
                    />
                </SwitchWrapper>

                <SwitchWrapper>
                    주관식
                    <input
                        min={1}
                        max={20}
                        // defaultValue={2}
                        value={shortAnswer}
                        onChange={(e) => {
                            setShortAnswer(e.target.value);
                        }}
                    />
                </SwitchWrapper>
                <SwitchWrapper>
                    서술형
                    <input
                        min={1}
                        max={20}
                        // defaultValue={2}
                        value={essay}
                        onChange={(e) => {
                            setEssay(e.target.value);
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
    border: 3px #EEEEEE solid; 
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
