import { Switch, Button } from 'antd';
import { useEffect } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import ExamSheetImg from '../assets/ExamSheetOption.png';
import ExamNumberInput from '../components/ExamNumberInput';
import PromptModal from './PromptModal';
import SwitchWithText from './SwitchWithText';

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
                localStorage.setItem('multipleChoice', numericValue);
            } else if (numericValue < 1) {
                setMultipleChoice(1);
                localStorage.setItem('multipleChoice', 1);
            } else if (numericValue > 10) {
                setMultipleChoice(10);
                localStorage.setItem('multipleChoice', 10);
            } else {
                setMultipleChoice('');
                localStorage.removeItem('multipleChoice');
            }
        }
    };

    const handleShortAnswerChange = (e) => {
        const value = e.target.value;

        if (value === '' || /^[0-9\b]+$/.test(value)) {
            const numericValue = parseInt(value, 10);

            if (numericValue >= 1 && numericValue <= 10) {
                setShortAnswer(numericValue);
                localStorage.setItem('shortAnswer', numericValue);
            } else if (numericValue < 1) {
                setShortAnswer(1);
                localStorage.setItem('shortAnswer', 1);
            } else if (numericValue > 10) {
                setShortAnswer(10);
                localStorage.setItem('shortAnswer', 10);
            } else {
                setShortAnswer('');
                localStorage.removeItem('shortAnswer');
            }
        }
    };

    useEffect(() => {
        const savedMultipleChoice = localStorage.getItem('multipleChoice');
        if (savedMultipleChoice !== null) {
            setMultipleChoice(parseInt(savedMultipleChoice, 10));
        }

        const savedShortAnswer = localStorage.getItem('shortAnswer');
        if (savedShortAnswer !== null) {
            setShortAnswer(parseInt(savedShortAnswer, 10));
        }
    }, [setMultipleChoice, setShortAnswer]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel='Exam Setting Options'
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
                    padding: '20px',
                    maxWidth: '80%', // 모바일에서 화면 너비의 90%로 제한
                },
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                },
            }}
        >
            <InfoWrapper>
                <InfoImg src={ExamSheetImg} alt='ExamSheetImg' />
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
                    <TextSetting>학습자료가 어떤 형식인가요?</TextSetting>
                    <ToggleWrapper>
                        <SwitchWithText
                            isTextCentered={isTextCentered}
                            setIsTextCentered={setIsTextCentered}
                        />
                    </ToggleWrapper>
                </div>

                <div>
                    <TextSettingV2>
                        원하는 스타일이 있다면, 버튼을 눌러 설정해보세요.
                    </TextSettingV2>
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
    margin-top: 10px;
    align-items: center; 
    margin-top: 5px;
    align-items: center;
    justify-content: center;
    text-align: center;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const InfoImg = styled.img`
    width: 80px;
    margin-right: 10px;

    @media (max-width: 768px) {
        margin-right: 0;
        margin-bottom: 10px;
    }
`;

const SettingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    justify-content: center;
    align-items: center;

    @media (max-width: 768px) {
        gap: 10px;
    }
`;

const TextSetting = styled.p`
    margin-top: 10px;

    @media (max-width: 768px) {
        font-size: 14px;
    }
`;

const TextSettingV2 = styled.p`
    margin-bottom: 20px;

    @media (max-width: 768px) {
        font-size: 14px;
        margin-bottom: 15px;
    }
`;

const SwitchWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 5px;
    }
`;

const SwitchInput = styled.input`
    border-radius: 5px;
    padding: 10px 15px;
    text-align: center;
    border: 2px solid;

    @media (max-width: 768px) {
        width: 50px;
        height: 30px;
    }
`;

const ToggleWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;

    @media (max-width: 768px) {
        gap: 10px;
    }
`;

const ApplyButton = styled.button`
    width: 400px;
    margin-top: 28px;
    padding: 10px 20px;
    border-radius: 20px;
    border: 1px;
    background-color: #7db249;
    color: white;
    font-family: 'Pretendard-Regular';
    font-size: 16px;

    &:hover,
    &:active {
        background-color: #afd485;
        color: white;
    }

    @media (max-width: 768px) {
        width: 100%;
        font-size: 14px;
    }
`;
