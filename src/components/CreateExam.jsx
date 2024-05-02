import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

import styled from 'styled-components';
import correctImage from '../assets/correct.png';
import incorrectImage from '../assets/incorrect.png';
import ScoreModal from '../components/ScoreModal'
import logo from '../assets/logo.png';

import axios from 'axios';
import generatePDF from 'react-to-pdf';
import PDFDownloadButton from './PDFDownloadButton';
import PDFGenerateButton from './PDFGenerateButton';

const CreateExam = ({ data, setData }) => {
    const [questions, setQuestions] = useState([]);
    const [radioAnswers, setRadioAnswers] = useState(
        JSON.parse(localStorage.getItem('radioAnswers')) || {}
    );
    const [textAnswers, setTextAnswers] = useState(
        JSON.parse(localStorage.getItem('textAnswers')) || {}
    );

    const [results, setResults] = useState(
        JSON.parse(localStorage.getItem('results')) || {}
    );
    const [score, setScore] = useState(0);

    const [warnings, setWarnings] = useState({});

    const [showExplanations, setShowExplanations] = useState(
        JSON.parse(localStorage.getItem('showExplanations')) || false
    );
    const [showExplanationButton, setShowExplanationButton] = useState(
        JSON.parse(localStorage.getItem('showExplanationButton')) || false
    );
    const [showQuestionButton, setshowQuestionButton] = useState(
        JSON.parse(localStorage.getItem('showQuestionButton')) || false
    );
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    
    const [isSubmitted, setIsSubmitted] = useState(
        JSON.parse(localStorage.getItem('isSubmitted')) || false
    );
    const [showScoreModal, setShowScoreModal] = useState(false);

    const [submitHovering, setSubmitHovering] = useState(false);

    const targetRef = useRef();

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // 1. Exam Data 가져오기
    useEffect(() => {
        console.log('#### EXAM DATA', data, data?.length);

        if (data?.length > 0) {
            const filteredQuestions = data.map((item, index) => ({
                id: index,
                type: item.case,
                choices: item.choices,
                correct_answer: item.correct_answer,
                explanation: item.explanation,
                question: item.question,
                intent: item.intent,
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

    // 2. Loacal Storage 저장
    useEffect(() => {
        localStorage.setItem('radioAnswers', JSON.stringify(radioAnswers));
        localStorage.setItem('textAnswers', JSON.stringify(textAnswers));
        localStorage.setItem('results', JSON.stringify(results));
        localStorage.setItem('isSubmitted', JSON.stringify(isSubmitted));
        localStorage.setItem(
            'showExplanations',
            JSON.stringify(showExplanations)
        );
        localStorage.setItem(
            'showExplanationButton',
            JSON.stringify(showExplanationButton)
        );
        localStorage.setItem(
            'showQuestionButton',
            JSON.stringify(showQuestionButton)
        );
    }, [
        radioAnswers,
        textAnswers,
        results,
        isSubmitted,
        showExplanations,
        showExplanationButton,
        showQuestionButton,
    ]);

    // 3. radioAnswers와 textAnswers 초기 상태 설정
    useEffect(() => {
        const storedRadioAnswers = JSON.parse(
            localStorage.getItem('radioAnswers')
        );
        const storedTextAnswers = JSON.parse(
            localStorage.getItem('textAnswers')
        );

        if (storedRadioAnswers) {
            setRadioAnswers(storedRadioAnswers);
        }

        if (storedTextAnswers) {
            setTextAnswers(storedTextAnswers);
        }
    }, []);

    const onSubmit = (data) => {
        setIsSubmitted(true);

        const newResults = {};

        const testResults = [];

        questions.forEach((question, index) => {
            
            const answer = data[`question_${index}`];
            let correct_answers;
            let user_answers;

            if (question.type === 0) {
                correct_answers = question.correct_answer;
                user_answers = answer.split('')[0];
                const isCorrect = user_answers === correct_answers;
                newResults[question.id] = isCorrect ? 'correct' : 'incorrect';
            } else if (question.type === 1) {
                correct_answers = question.correct_answer;
                user_answers = data[`question_${index}`]; 
            }
            
            const questionInfo = {
                index: index,
                question: question.question,
                choices: question.choices,
                correctAnswer:correct_answers,
                userAnswer: user_answers,
                isCorrect: question.type === 0 ? (newResults[question.id] === 'correct' ? "True" : "False") : undefined,
                explanation: question.explanation,
                intent: question.intent,
            };

            if (question.type === 0) {
                setRadioAnswers((prevRadioAnswers) => ({
                    ...prevRadioAnswers,
                    [question.id]: user_answers,
                }));
            } else if (question.type === 1) {
                setTextAnswers((prevTextAnswers) => ({
                    ...prevTextAnswers,
                    [question.id]: user_answers,
                }));
            }

            testResults.push(questionInfo);
        });

        setResults(newResults);

        setShowExplanationButton(true);
        setshowQuestionButton(true);

        setScore(score); 
        setShowScoreModal(true);

        console.log('testResults:', JSON.stringify(testResults));
        
        // end-point 수정 필요
        type = "TEST_example"; 

        axios({
            url: `${import.meta.env.VITE_APP_API_URL}${type}`,
            method: 'POST',
            responseType: 'json',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(testResults) 
        }).then(response => {
            console.log('Server response:', response.data);
        }).catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting feedback.');
        })

    };

    const ModalSubmit = () => {
        handleSubmit(onSubmit)();
    };

    const handleCloseModal = () => {
        setShowScoreModal(false);
    };

    const toggleExplanations = () => {
        setShowExplanations((prev) => !prev);
        setIsFeedbackOpen(prevState => !prevState);
    };

    const handleGoToChatBot = () => {
        window.open('/chatbot', '_blank'); // 새로운 창
    };    

    const clearAllLocalStorage = () => {
        setRadioAnswers({});
        setTextAnswers({});
        setResults({});
        setIsSubmitted(false);
        setShowExplanations(false);
        setShowExplanationButton(false);
        setshowQuestionButton(false);

        window.location.reload(); // 새로고침
    };

    Modal.setAppElement('#root');

    return (
        <Wrapper>
            {data?.length > 0 && (
                <ButtonWrapper>
                    <PDFGenerateButton
                        text={'문제 새로 생성하기'}
                        onClickHandle={() => {
                            setData(null);
                            localStorage.removeItem('examData');
                            // refresh
                            window.location.reload();
                        }}
                    ></PDFGenerateButton>
                    <PDFDownloadButton
                        text={'문제 다운로드 하기'}
                        onClickHandle={() =>
                            generatePDF(targetRef, {
                                filename: 'study-mentor.pdf',
                            })
                        }
                    ></PDFDownloadButton>
                </ButtonWrapper>
            )}

            {data?.length == 0 && <div>Loading...</div>}
            {data?.length > 0 && (
                <MakeTest ref={targetRef}>
                    <ExamTitle>
                        <LogoImg src={logo} alt='logo' />
                        <Title>Study Mentor Exam</Title>
                    </ExamTitle>
                    <Info>학번 : <InfoLine /> 이름 : <InfoLine /></Info>
                    <Line />
                    <StyledTest onSubmit={handleSubmit(onSubmit)}>
                        <TestContainer>
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
                                                <RadioLabel
                                                    key={idx} 
                                                    style={{
                                                        fontWeight:
                                                            (isSubmitted &&
                                                                results[
                                                                    question.id
                                                                ] === 'incorrect' &&
                                                                showExplanations &&
                                                                choice.split('')[0] ===
                                                                    question.correct_answer) ||
                                                            (isSubmitted &&
                                                                results[
                                                                    question.id
                                                                ] === 'correct' &&
                                                                choice.split('')[0] ===
                                                                    question.correct_answer)
                                                                ? 'bold'
                                                                : 'normal',
                                                        color: isSubmitted
                                                            ? results[
                                                                  question.id
                                                              ] === 'incorrect' &&
                                                              showExplanations &&
                                                              choice.split('')[0] ===
                                                                  question.correct_answer
                                                                ? 'red'
                                                                : results[
                                                                      question.id
                                                                  ] === 'correct' &&
                                                                  choice.split('')[0] ===
                                                                      question.correct_answer
                                                                ? 'blue'
                                                                : 'black'
                                                            : 'black',
                                                    }}    
                                                >                             
                                                    <input
                                                        type="radio"
                                                        name={`question_${index}`}
                                                        value={choice}
                                                        disabled={isSubmitted}
                                                        onChange={(e) => {
                                                            if (!isSubmitted) {
                                                                handleRadioChange(question.id, e.target.value);
                                                            }
                                                        }}
                                                        checked={isSubmitted ? (radioAnswers[question.id] ===  choice.split('')[0]) : null}   
                                                        {...register(`question_${index}`, {
                                                            required: true,
                                                        })}
                                                    />
                                                    {choice}
                                                </RadioLabel>                                        
                                            ))}
                                        </QuestionDetails>
                                    ) : (
                                        <TextInput
                                            type='text'
                                            onChange={(e) => {
                                                if (!isSubmitted) {
                                                    handleTextChange(question.id, e.target.value);
                                                }
                                            }}
                                            {...register(`question_${index}`, {
                                                required: '정답을 입력하세요.',
                                            })}
                                            placeholder={isSubmitted ? textAnswers[question.id] : '정답을 입력하시오.'}
                                            disabled={isSubmitted}
                                        />
                                    )}
                                    {showExplanations && (
                                        <>
                                            <ExplainHelp>
                                                <p style={{ color: 'red', fontSize: '18px' }}><strong>정답: {question.correct_answer}</strong></p>
                                                <p style={{ marginTop: '10px', fontSize: '16px' }}><strong>해설: {question.explanation}</strong></p>
                                            </ExplainHelp>
                                            {results[question.id] === 'incorrect' && (
                                                <GoChatBot> 
                                                    <ChatBotButton onClick={handleGoToChatBot}>질문하러 가기</ChatBotButton>
                                                </GoChatBot>
                                            )}
                                        </>
                                    )}
                                </QuestionBlock>
                            ))}
                        </TestContainer>
                        <ButtonContainer>
                            <div style={{ position: 'relative' }}>
                            <SubmitButton
                                type="submit"
                                disabled={isSubmitted} 
                                onMouseEnter={() => setSubmitHovering(true)}
                                onMouseLeave={() => setSubmitHovering(false)}
                                onClick={ModalSubmit}
                            >
                                제출하기
                            </SubmitButton>
                            {submitHovering && !isSubmitted && (
                                <WarningMessage style={{ display: 'block' }}> ⚠️ 제출은 한 번만 가능합니다! <br /> 다시 한 번 검토해주세요.</WarningMessage>
                            )}
                            {showScoreModal && 
                                <ScoreModal isOpen={showScoreModal} 
                                onRequestClose={handleCloseModal} 
                                scoreData={{ score: score }} 
                                />
                            }
                            </div>
                            {showExplanationButton && (
                                <AnswerButton
                                    type='button'
                                    onClick={toggleExplanations}
                                >
                                    {isFeedbackOpen ? '피드백 받기' : '피드백 닫기'}
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
            {data?.length > 0 && (
                <ClearBox onClick={clearAllLocalStorage}>
                    <ClearText>다시 풀기(새로고침)</ClearText>
                </ClearBox>
            )}
        </Wrapper>
    );
};

export default CreateExam;

const Wrapper = styled.div`
    margin-top: 10px;
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
`;

const MakeTest = styled.div`
    padding: 20px;
    margin: 50px auto 20px auto;
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

const TestContainer = styled.div`
    padding-bottom: 20px;
    border-bottom: 3px dotted #9E9E9E;
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
    font-size: 17px;
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
    margin-top: 20px;
`;

const SubmitButton = styled.button`
    width: 120px;
    height: 50px;
    border-radius: 10px;
    border: 3px solid #787878;
    background: #EEEEEE;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-right: 10px;
    font-family: "Pretendard-Regular";

    &:hover {
        background: #c2c2c2;
    }

    &:active {
        background: #9e9e9e;
    }
`;

const WarningMessage = styled.div`
    display: none;          
    position: absolute;    
    bottom: 100%;         
    left: 50%;              
    transform: translateX(-50%); 
    background: #FFDED5;  
    padding: 10px 20px;        
    margin-bottom: 10px;       
    border: 2px #FD8A69 solid;  
    border-radius: 10px;        
    font-size: 17px;
    font-weight: bold;          
    white-space: nowrap;      
    box-shadow: 0 3px 10px rgba(0,0,0,0.1); 
    z-index: 10;              
`;

const AnswerButton = styled.button`
    width: 120px;
    height: 50px;
    border-radius: 10px;
    border: 3px solid #FFC67E;
    background: #FEEBB6;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    font-family: "Pretendard-Regular";

    &:hover {
        background: #FFC67E;
    }

    &:active {
        background: #FFC67E;
    }
`;

const QuestButton = styled.button`
    width: 120px;
    height: 50px;
    border-radius: 10px;
    border: 3px solid #FFAB93;  
    background: #FFE1D9; 
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-left: 10px;
    font-family: "Pretendard-Regular";

    &:hover {
        background: #FFAB93;  
    }

    &:active {
        background: #FFAB93;  
    }
`;

const ExplainHelp = styled.p`
    font-size: 15px;
    text-align: left;
    padding: 15px;
    margin: 15px 0;
    border: 4px #FD9F28 dotted;
    background-color: #FFF3E3;
    border-radius: 5px;
    width: 96%;
`;


const ClearBox = styled.div`
    text-align: right;
    margin-bottom: 50px;
    margin-right: 30px;
`;

const ClearText = styled.button`
    font-size: 18px;
    &:hover {
        color: #9E9E9E; 
    }
    border: none;
    padding: 10px;
    background: white;
    color: black;
    font-weight: bold;
    font-family: "Pretendard-Regular";
`;

const GoChatBot = styled.div`
    display: flex;        
    justify-content: flex-end; 
    width: 100%;        
`;

const ChatBotButton = styled.button`
    padding: 8px 16px;  
    color: black;
    border: none;      
    cursor: pointer;    
    &:hover {
        background-color: #C2C2C2;  
    }
    font-family: "Pretendard-Regular";
    font-size: 15px;
    font-weight: bold;
`;
