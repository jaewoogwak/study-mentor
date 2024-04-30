import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';
import correctImage from '../assets/correct.png';
import incorrectImage from '../assets/incorrect.png';
import logo from '../assets/logo.png';

import axios from 'axios';
import generatePDF from 'react-to-pdf';

const CreateExam = ({ data }) => {
    const [questions, setQuestions] = useState([]);
    const [radioAnswers, setRadioAnswers] = useState({});
    const [textAnswers, setTextAnswers] = useState({});
    const [results, setResults] = useState({});
    const [showExplanations, setShowExplanations] = useState(false);
    const [showExplanationButton, setShowExplanationButton] = useState(false);
    const [showQuestionButton, setshowQuestionButton] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitHovering, setSubmitHovering] = useState(false);
    const targetRef = useRef();

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(); // 입력에 대한 관리

    useEffect(() => {
        console.log('#### EXAM DATA', data, data?.length);
        if (data?.length > 0) {
            const filteredQuestions = data.map((item, index) => ({
                id: index,
                question: item.question,
                choices: item.choices,
                correct_answer: item.correct_answer,
                explanation: item.explanation,
                type: item.case,
            }));

            setQuestions(filteredQuestions);

            const initialRadioAnswers = {};
            const initialTextAnswers = {};

            filteredQuestions.forEach((question) => {
                if (question.type === 0) {
                    initialRadioAnswers[question.id] = null;
                } else if (question.type === 1) {
                    initialTextAnswers[question.id] = '';
                }
            });

            setRadioAnswers(initialRadioAnswers);
            setTextAnswers(initialTextAnswers);
        }
    }, [data]);

    const handleRadioChange = (id, value) => {
        setRadioAnswers((prev) => ({
            ...prev,
            [id]: value,
        }));
        if (warnings[id]) {
            setWarnings((prev) => ({ ...prev, [id]: false }));
        }
    };

    const handleTextChange = (id, value) => {
        setTextAnswers((prev) => ({
            ...prev,
            [id]: value,
        }));
        if (warnings[id]) {
            setWarnings((prev) => ({ ...prev, [id]: false }));
        }
    };

    const onSubmit = (data) => {
        setIsSubmitted(true);

        let score = 0;
        const newResults = {}; // 점수 출력
        const feedbackResults = [];
        questions.forEach((question, index) => {
            const answer = data[`question_${index}`];
            const isCorrect = answer === question.correct_answer;
            newResults[question.id] = isCorrect ? 'correct' : 'incorrect';
            const questionInfo = {
                index: index,
                question: question.question,
                userAnswer: answer,
                isCorrect: isCorrect,
            };
            feedbackResults.push(questionInfo);
            if (isCorrect) {
                score += 5;
            }
        });
        setResults(newResults);
        alert(`점수는 ${score}/100점입니다.`);
        setShowExplanationButton(true);
        setshowQuestionButton(true);
        console.log('FeedBackResults:', JSON.stringify(feedbackResults));

        // axios를 사용해 server로 data 전달

        const type = '/api/feedback'; // 경로 정의 알 수 없음 (임의로 추가)

        axios({
            url: `${import.meta.env.VITE_APP_API_URL}${type}`,
            method: 'POST',
            responseType: 'json',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(feedbackResults),
        })
            .then((response) => {
                console.log('Server response:', response.data);
                // localStorage.setItem(
                //     'feedbackData',
                //     JSON.stringify(response.data)
                // );
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred while submitting feedback.');
            });
    };

    // 해설 및 정답 보기 함수
    const toggleExplanations = () => {
        setShowExplanations((prev) => !prev);
    };

    const handleGoToChatBot = () => {
        navigate('/chatbot'); // navigate 함수를 사용하여 페이지 이동
    };

    return (
        <div>
            {data?.length > 0 && (
                <DownloadBtn
                    onClick={() =>
                        generatePDF(targetRef, { filename: 'study-mentor.pdf' })
                    }
                >
                    문제 저장하기
                </DownloadBtn>
            )}

            {data?.length == 0 && <div>Loading...</div>}
            {data?.length > 0 && (
                <MakeTest ref={targetRef}>
                    <ExamTitle>
                        <LogoImg src={logo} alt='logo' />
                        <Title>Study Mentor Exam</Title>
                    </ExamTitle>
                    <Info>
                        학번 : <InfoLine /> 이름 : <InfoLine />
                    </Info>
                    <Line />
                    <StyledTest onSubmit={handleSubmit(onSubmit)}>
                        {questions.map((question, index) => (
                            <QuestionBlock key={question.id}>
                                <QuestionRow>
                                    <IndexText className={results[question.id]}>
                                        {index + 1}.{' '}
                                    </IndexText>
                                    <QuestionText>
                                        {question.question}
                                        {errors[`question_${index}`] && (
                                            <span style={{ color: 'green' }}>
                                                {' '}
                                                *입력되지 않았습니다.
                                            </span>
                                        )}
                                    </QuestionText>
                                    {/* 이미지 오버레이 */}
                                    {results[question.id] === 'correct' && (
                                        <ImageOverlay
                                            src={correctImage}
                                            alt='Correct'
                                        />
                                    )}
                                    {results[question.id] === 'incorrect' && (
                                        <ImageOverlay
                                            src={incorrectImage}
                                            alt='Incorrect'
                                        />
                                    )}
                                </QuestionRow>
                                {Array.isArray(question.choices) ? (
                                    <QuestionDetails>
                                        {question.choices.map((choice, idx) => (
                                            <RadioLabel key={idx}>
                                                <input
                                                    type='radio'
                                                    name={`question_${index}`}
                                                    value={choice}
                                                    disabled={isSubmitted}
                                                    {...register(
                                                        `question_${index}`,
                                                        {
                                                            required: true,
                                                        }
                                                    )}
                                                />
                                                {choice}
                                            </RadioLabel>
                                        ))}
                                    </QuestionDetails>
                                ) : (
                                    <TextInput
                                        type='text'
                                        {...register(`question_${index}`, {
                                            required: '정답을 입력하세요.',
                                        })}
                                        placeholder='정답을 입력하시오.'
                                        disabled={isSubmitted}
                                    />
                                )}
                                {showExplanations && (
                                    <ExplainHelp>
                                        <p style={{ color: 'red' }}>
                                            <strong>
                                                정답: {question.correct_answer}
                                            </strong>
                                        </p>
                                        <p>{question.explanation}</p>
                                    </ExplainHelp>
                                )}
                            </QuestionBlock>
                        ))}
                        <ButtonContainer>
                            {/* 제출하기 버튼 해결 못함!! */}
                            <div style={{ position: 'relative' }}>
                                <SubmitButton
                                    type='submit'
                                    disabled={isSubmitted} // 버튼을 비활성화 상태로 만드는 속성
                                    onMouseEnter={() => setSubmitHovering(true)}
                                    onMouseLeave={() =>
                                        setSubmitHovering(false)
                                    }
                                >
                                    제출하기
                                </SubmitButton>
                                {submitHovering && !isSubmitted && (
                                    <WarningMessage
                                        style={{ display: 'block' }}
                                    >
                                        ※ 제출은 한 번만 가능합니다.
                                    </WarningMessage>
                                )}
                            </div>
                            {showExplanationButton && (
                                <AnswerButton
                                    type='button'
                                    onClick={toggleExplanations}
                                >
                                    해설보기
                                </AnswerButton>
                            )}
                            {showQuestionButton && (
                                <QuestButton
                                    type='button'
                                    onClick={handleGoToChatBot}
                                >
                                    질문하기
                                </QuestButton>
                            )}
                        </ButtonContainer>
                    </StyledTest>
                </MakeTest>
            )}
        </div>
    );
};

export default CreateExam;

const MakeTest = styled.div`
    padding: 20px;
    margin: 20px auto;
    max-width: 1000px;
    border: 3px solid;
`;

const ExamTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Title = styled.div`
    color: #000;
    text-align: center;
    font-family: Inter;
    font-size: 45px;
    font-style: normal;
    font-weight: bold;
    line-height: normal;
`;

const LogoImg = styled.img`
    height: 70px;
    width: auto;
    margin-right: 20px;
`;

const Info = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin: 25px 0 20px 10px;
    font-size: 20px;
`;

const InfoLine = styled.div`
    display: inline-block;
    border-bottom: 2px solid black;
    width: 150px;
    height: 20px;
`;

const Line = styled.div`
    height: 2px;
    background: #000;
    width: 100%;
    max-width: 1000px;
    margin: 10px auto 40px;
`;

const StyledTest = styled.form`
    margin-left: 20px;
    padding: 20px;
    box-sizing: border-box;
`;

const QuestionBlock = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 30px;
`;

const QuestionRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    position: relative;
`;

const IndexText = styled.a`
    font-weight: bold;
    font-size: 20px;
    font-family: Inter;
    margin-right: 8px;
    &.incorrect {
        color: red;
    }
`;

const ImageOverlay = styled.img`
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    left: 10px;
    width: 50px;
    height: 50px;
`;

const QuestionText = styled.a`
    flex: 1;
    text-align: left;
    font-weight: bold;
    font-size: 18px;
`;

const QuestionDetails = styled.div`
    display: flex;
    flex-direction: column;
`;

const RadioLabel = styled.label`
    margin-bottom: 5px;
    text-align: left;
    font-size: 16px;
    cursor: pointer;

    input[type='radio'] {
        margin-right: 10px;
        transform: scale(1.2);
    }
`;

const TextInput = styled.input`
    width: 50%;
    padding: 12px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;
`;

const SubmitButton = styled.button`
    width: 100px;
    height: 40px;
    border-radius: 10px;
    border: 3px solid rgba(105, 179, 253, 0.5);
    background: rgba(174, 216, 255, 0.5);
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-right: 10px;

    &:hover {
        background: rgba(145, 204, 255, 0.75);
    }

    &:active {
        background: rgba(133, 193, 255, 0.75);
    }
`;

// 호버 메시지 컴포넌트
const WarningMessage = styled.div`
    display: none;
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #ddecca;
    padding: 10px 20px;
    margin-bottom: 10px;
    border: 3px solid #afd485;
    border-radius: 10px;
    font-size: 15px;
    font-weight: bold;
    white-space: nowrap;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 10;
`;

const AnswerButton = styled.button`
    width: 100px;
    height: 40px;
    border-radius: 10px;
    border: 3px solid rgba(47, 165, 153, 0.5);
    background: rgba(184, 230, 225, 0.5);
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;

    &:hover {
        background: rgba(184, 230, 225, 0.75);
    }

    &:active {
        background: rgba(47, 165, 153, 0.75);
    }
`;

const QuestButton = styled.button`
    width: 100px;
    height: 40px;
    border-radius: 10px;
    border: 3px solid rgba(253, 138, 105, 0.5);
    background: rgba(254, 204, 190, 0.5);
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-left: 10px;

    &:hover {
        background: rgba(255, 192, 203, 0.75);
    }

    &:active {
        background: rgba(255, 182, 193, 0.75);
    }
`;

const ExplainHelp = styled.p`
    font-size: 15px;
    text-align: left;
    padding: 10px;
    margin: 15px 0;
    border: 2px solid red;
    background-color: white;
    border-radius: 5px;
`;

const DownloadBtn = styled.button`
    width: 300px;
    height: 20px;
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
