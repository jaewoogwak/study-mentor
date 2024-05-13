import { Switch, Button } from 'antd';
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
            <OverlayBox>How To Make?</OverlayBox>
            <h1 style={{ marginTop: '10px' }}>시험 문제 생성 설정</h1>
            <p style={{ marginTop: '20px' }}>
                1. 생성할 시험 문제 개수와 유형을 선택하세요. (혼합 선택 가능){' '}
            </p>
            <SettingWrapper>
                <SwitchWrapper>
                    객관식
                    <SwitchInput
                        type='number'
                        min={1}
                        max={20}
                        value={multipleChoice}
                        onChange={(e) => {
                            setMultipleChoice(e.target.value);
                        }}
                        style={{
                            width: '60px',
                            height: '20px',
                            fontSize: '15px',
                        }}
                    />
                </SwitchWrapper>

                <SwitchWrapper>
                    주관식
                    <SwitchInput
                        type='number'
                        min={1}
                        max={20}
                        // defaultValue={2}
                        value={shortAnswer}
                        onChange={(e) => {
                            setShortAnswer(e.target.value);
                        }}
                        style={{
                            width: '60px',
                            height: '20px',
                            fontSize: '15px',
                        }}
                    />
                </SwitchWrapper>

                <TextContainer>
                    <p style={{ marginBottom: '20px' }}>
                        2. 학습 자료를 이미지나 텍스트 중심으로 분석할지 
                        선택해주세요.{' '}
                    </p>
                    <SwitchWithText
                        isTextCentered={isTextCentered}
                        setIsTextCentered={setIsTextCentered}
                    />
                </TextContainer>

                <ModalContainer>
                    <p style={{ marginBottom: '20px' }}>
                        3. 원하는 조건이 있다면, 프롬프트를 작성하세요.
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
    height: 430px;
    border-radius: 10px;
    border: 2px solid grey;
    padding: 30px 30px 15px 30px;
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
`;

const TextContainer = styled.div`
    margin-top: 20px;
`;

const ModalContainer = styled.div`
    margin: 20px;
`;
