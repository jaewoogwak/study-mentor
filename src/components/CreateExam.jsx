import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from 'react-modal';

import styled from 'styled-components';
import correctImage from '../assets/correct.png';
import incorrectImage from '../assets/incorrect.png';
import ScoreModal from '../components/ScoreModal';
import logo from '../assets/logo.png';

import axios from 'axios';
import generatePDF from 'react-to-pdf';
import { v4 as uuidv4 } from 'uuid';
import PDFDownloadButton from './PDFDownloadButton';
import PDFGenerateButton from './PDFGenerateButton';
import { set } from 'firebase/database';
import { Spin } from 'antd';
import Spinner from './Spinner';

import { useChatStore } from '../contexts/store';
import {
    collection,
    setDoc,
    doc,
    getDocs,
    updateDoc,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

const CreateExam = ({ data, setData, credits }) => {
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

    const [feedbackMessages, setFeedbackMessages] = useState(
        JSON.parse(localStorage.getItem('feedbackMessages')) || {}
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
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(
        JSON.parse(localStorage.getItem('isFeedbackOpen')) || false
    );

    const [isSubmitted, setIsSubmitted] = useState(
        JSON.parse(localStorage.getItem('isSubmitted')) || false
    );
    const [showScoreModal, setShowScoreModal] = useState(false);

    const [submitHovering, setSubmitHovering] = useState(false);

    const [isGrading, setIsGrading] = useState(false);

    const [generatedExamId, setGeneratedExamId] = useState(() => {
        return localStorage.getItem('generatedExamId') || null;
    });

    const {
        messages,
        sendMessage,
        setIsTyping,
        setOutgoingMessage,
        setIncomingMessage,
        setQuestionData,
        questionData,
    } = useChatStore();

    const { user, login, logout } = useAuth();

    const targetRef = useRef();

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // 1. Exam Data 가져오기
    useEffect(() => {
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

            const loadedRadioAnswers =
                JSON.parse(localStorage.getItem('radioAnswers')) || {};
            const loadedTextAnswers =
                JSON.parse(localStorage.getItem('textAnswers')) || {};

            const initialRadioAnswers = {};
            const initialTextAnswers = {};

            filteredQuestions.forEach((question) => {
                if (question.type === 0) {
                    initialRadioAnswers[question.id] =
                        loadedRadioAnswers[question.id] || null;
                } else if (question.type === 1) {
                    initialTextAnswers[question.id] =
                        loadedTextAnswers[question.id] || '';
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
        localStorage.setItem('isFeedbackOpen', JSON.stringify(isFeedbackOpen));
        localStorage.setItem(
            'feedbackMessages',
            JSON.stringify(feedbackMessages)
        );
        localStorage.setItem('generatedExamId', generatedExamId);
    }, [
        radioAnswers,
        textAnswers,
        results,
        isSubmitted,
        showExplanations,
        showExplanationButton,
        showQuestionButton,
        isFeedbackOpen,
        feedbackMessages,
        generatedExamId,
    ]);

    const saveDataToFirebase = async (examData, feedbackData) => {
        try {
            if (!user) {
                console.error('User is not authenticated');
                return;
            }

            const userId = user.uid;
            let docId;

            if (!generatedExamId || generatedExamId === 'null') {
                const newExamId = uuidv4();
                docId = `exam_${newExamId}`;
                localStorage.setItem('generatedExamId', newExamId);
                setGeneratedExamId(newExamId);
            } else {
                docId = `exam_${generatedExamId}`;
            }

            console.log('Generated Document ID:', docId);

            const userDocRef = doc(db, 'users', userId, 'exams', docId);

            const docContent = {
                examData: {
                    ...examData,
                },
                feedbackData: {
                    ...feedbackData,
                },
                timestamp: new Date(),
            };

            await setDoc(userDocRef, docContent, { merge: true });
            console.log(
                'Exam and feedback saved for user ID:',
                userId,
                'Document ID:',
                docId
            );
        } catch (e) {
            console.error('Error adding document:', e.message);
        }
    };

    const onSubmit = async (data) => {
        setIsSubmitted(true);

        const testResults = [];

        questions.forEach((question, index) => {
            const answer = data[`question_${index}`];
            let user_answers;

            if (question.type === 0) {
                user_answers = parseInt(answer.split('')[0]);
            } else if (question.type === 1) {
                user_answers = data[`question_${index}`];
            }

            const questionInfo = {
                index: index,
                question: question.question,
                choices: question.choices,
                correctAnswer: question.correct_answer,
                userAnswer: user_answers,
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

        const feedbackResults = {
            FeedBackResults: testResults,
        };

        // 토큰 발급
        const token =
            (await user.getIdToken()) || localStorage.getItem('token');

        // 서버 통신
        axios({
            url: `${import.meta.env.VITE_API_URL}/feedback/`,
            method: 'POST',
            responseType: 'json',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            data: feedbackResults,
        })
            .then((response) => {
                setIsGrading(false);
                getScore(response.data);
                // filteredQuestions와 response.data를 함께 저장
                saveDataToFirebase(questions, response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred while submitting Exam.');
            });
    };

    // server에서 받은 정답과 비교해야 함
    const getScore = (AnswerJson) => {
        let correctCount = 0;
        const newResults = {};
        const newFeedbackMessages = {}; // feedback message 저장

        AnswerJson.forEach((answer) => {
            newResults[answer.index] =
                answer.isCorrect === 1 ? 'correct' : 'incorrect';
            if (answer.isCorrect === 1) {
                correctCount++;
            } else {
                newFeedbackMessages[answer.index] = answer.feedback;
            }
        });

        setShowScoreModal(true);
        setShowExplanationButton(true);
        setshowQuestionButton(true);

        setResults(newResults);
        setScore(correctCount);
        setFeedbackMessages(newFeedbackMessages);
    };

    const ModalSubmit = () => {
        setIsGrading(true);
        handleSubmit(onSubmit)();
    };

    const handleCloseModal = () => {
        setShowScoreModal(false);
    };

    const toggleExplanations = () => {
        setShowExplanations((prev) => !prev);
        setIsFeedbackOpen((prevState) => {
            const newState = !prevState;
            localStorage.setItem('IsFeedbackOpen', JSON.stringify(newState));
            return newState;
        });
    };

    // fb chats에서 현재 유저의 이메일과 일치하는 컬렉션 id를 찾는 함수
    const findChatId = async () => {
        console.log('USER info', user);
        const currentUser = user.email;
        const chats = [];
        const messageSnapshot = await getDocs(collection(db, 'chats'));
        messageSnapshot.forEach((doc) => {
            if (doc.data().email === currentUser) {
                chats.push(doc.id);
            }
        });
        return chats[0];
    };

    const handleGoToChatBot_withQuest = async (
        qid,
        ques,
        chc,
        user_answer,
        correct_answer
    ) => {
        const questionData = {
            question: ques,
            choices: chc,
            userAnswer: user_answer,
            correctAnswer: correct_answer,
        };

        const { question, choices, userAnswer, correctAnswer } = questionData;

        const formattedChoices = Array.isArray(choices) ? choices : ['빈칸'];

        const prompt = `문제 질문: ${question}
                선택지: ${formattedChoices.join(', ')}
                정답: ${correctAnswer}
                나의 답안: ${userAnswer}\n
                정답과 나의 답안을 비교하여 자세한 설명을 해줘.`;

        setOutgoingMessage(prompt);
        setQuestionData(prompt);

        navigate('/chatbot');
        setIsTyping(true);

        const res = await sendMessage(prompt);

        setIncomingMessage(res);

        // fb chats에서 현재 유저의 이메일과 일치하는 컬렉션 id를 찾기
        const id = await findChatId();

        // fb chats에서 현재 유저의 이메일과 일치하는 컬렉션에 메시지 추가하기
        const currentUserMessage = {
            message: prompt,
            sender: 'user',
            direction: 'outgoing',
        };

        const chatRef = doc(db, 'chats', id);

        updateDoc(chatRef, {
            messages: [
                ...messages,
                currentUserMessage,
                {
                    message: res,
                    sender: 'ChatGPT',
                },
            ],
        });
        // localStorage.setItem('examQuestion', JSON.stringify(questionData));

        setIsTyping(false);
    };

    const handleGoToChatBot = () => {
        navigate('/chatbot');
    };

    const handlePDFGenerateClick = () => {
        setGeneratedExamId(null);
        setData(null);
        localStorage.removeItem('examData');
        clearAllLocalStorage();
    };

    const clearAllLocalStorage = () => {
        setRadioAnswers({});
        setTextAnswers({});
        setResults({});
        setIsSubmitted(false);
        setShowExplanations(false);
        setShowExplanationButton(false);
        setshowQuestionButton(false);
        setIsFeedbackOpen(false);
        setFeedbackMessages(false);

        window.location.reload(); // 새로고침
    };

    Modal.setAppElement('#root');

    return (
        // 채점 중이면 화면을 검게 만들고 채점중이라는 메시지를 띄워야함. 또한 로딩 스핀도 추가해야함.
        <Wrapper>
            {isGrading && isSubmitted && (
                <div
                    style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 200,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '50px',
                            backgroundColor: 'white',
                            padding: '40px',
                            borderRadius: '10px',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                            border: '3px #787878 solid',
                        }}
                    >
                        <Spinner />
                        {/* 화면 크기에 맞는 폰트 크기 필요*/}
                        <div
                            style={{
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                            }}
                        >
                            채점 중입니다, 조금만 기다려주세요 ...
                        </div>
                    </div>
                </div>
            )}

            {data?.length > 0 && (
                <>
                    <DivisionLine />
                    <ButtonWrapper>
                        <PDFGenerateButton
                            text={'문제 새로 생성하기'}
                            onClickHandle={handlePDFGenerateClick}
                        ></PDFGenerateButton>
                        <PDFDownloadButton
                            text={'문제 다운로드 하기'}
                            onClickHandle={() =>
                                generatePDF(targetRef, {
                                    filename: 'study-mentor.pdf',
                                })
                            }
                        ></PDFDownloadButton>
                        {/* <CreditWrapper>사용 가능 횟수: {credits}</CreditWrapper> */}
                    </ButtonWrapper>
                </>
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
                        <TestContainer>
                            {questions.map((question, index) => (
                                <QuestionBlock key={question.id}>
                                    <QuestionRow>
                                        <IndexText
                                            className={results[question.id]}
                                        >
                                            {index + 1}.{' '}
                                        </IndexText>
                                        <QuestionText>
                                            {question.question}
                                            {errors[`question_${index}`] && (
                                                <span
                                                    style={{ color: 'green' }}
                                                >
                                                    {' '}
                                                    입력되지 않았습니다.
                                                </span>
                                            )}
                                        </QuestionText>
                                        {results[question.id] === 'correct' && (
                                            <ImageOverlay
                                                src={correctImage}
                                                alt='Correct'
                                            />
                                        )}
                                        {results[question.id] ===
                                            'incorrect' && (
                                            <ImageOverlay
                                                src={incorrectImage}
                                                alt='Incorrect'
                                            />
                                        )}
                                    </QuestionRow>
                                    {Array.isArray(question.choices) ? (
                                        <QuestionDetails>
                                            {question.choices.map(
                                                (choice, idx) => (
                                                    <RadioLabel
                                                        key={idx}
                                                        style={{
                                                            fontWeight:
                                                                (isSubmitted &&
                                                                    results[
                                                                        question
                                                                            .id
                                                                    ] ===
                                                                        'incorrect' &&
                                                                    showExplanations &&
                                                                    parseInt(
                                                                        choice.split(
                                                                            '.'
                                                                        )[0]
                                                                    ) ===
                                                                        question.correct_answer) ||
                                                                (isSubmitted &&
                                                                    results[
                                                                        question
                                                                            .id
                                                                    ] ===
                                                                        'correct' &&
                                                                    parseInt(
                                                                        choice.split(
                                                                            '.'
                                                                        )[0]
                                                                    ) ===
                                                                        question.correct_answer)
                                                                    ? 'bold'
                                                                    : 'normal',
                                                            color: isSubmitted
                                                                ? results[
                                                                      question
                                                                          .id
                                                                  ] ===
                                                                      'incorrect' &&
                                                                  showExplanations &&
                                                                  parseInt(
                                                                      choice.split(
                                                                          '.'
                                                                      )[0]
                                                                  ) ===
                                                                      question.correct_answer
                                                                    ? 'red'
                                                                    : results[
                                                                          question
                                                                              .id
                                                                      ] ===
                                                                          'correct' &&
                                                                      parseInt(
                                                                          choice.split(
                                                                              '.'
                                                                          )[0]
                                                                      ) ===
                                                                          question.correct_answer
                                                                    ? 'blue'
                                                                    : 'black'
                                                                : 'black',
                                                        }}
                                                    >
                                                        <input
                                                            type='radio'
                                                            name={`question_${index}`}
                                                            value={choice}
                                                            disabled={
                                                                isSubmitted
                                                            }
                                                            onChange={(e) => {
                                                                if (
                                                                    !isSubmitted
                                                                ) {
                                                                    handleRadioChange(
                                                                        question.id,
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }
                                                            }}
                                                            checked={
                                                                isSubmitted
                                                                    ? radioAnswers[
                                                                          question
                                                                              .id
                                                                      ] ===
                                                                      parseInt(
                                                                          choice.split(
                                                                              ''
                                                                          )[0]
                                                                      )
                                                                    : null
                                                            }
                                                            {...register(
                                                                `question_${index}`,
                                                                {
                                                                    required: true,
                                                                }
                                                            )}
                                                        />
                                                        {choice}
                                                    </RadioLabel>
                                                )
                                            )}
                                        </QuestionDetails>
                                    ) : (
                                        <TextInput
                                            type='text'
                                            onChange={(e) => {
                                                if (!isSubmitted) {
                                                    handleTextChange(
                                                        question.id,
                                                        e.target.value
                                                    );
                                                }
                                            }}
                                            {...register(`question_${index}`, {
                                                required: '정답을 입력하세요.',
                                            })}
                                            placeholder={
                                                isSubmitted
                                                    ? textAnswers[question.id]
                                                    : '정답을 입력하시오.'
                                            }
                                            disabled={isSubmitted}
                                        />
                                    )}
                                    {showExplanations && (
                                        <>
                                            <ExplainHelp>
                                                <p
                                                    style={{
                                                        color: 'red',
                                                        fontSize: '18px',
                                                    }}
                                                >
                                                    <strong>
                                                        정답 :{' '}
                                                        {
                                                            question.correct_answer
                                                        }
                                                    </strong>
                                                </p>
                                                <p
                                                    style={{
                                                        marginTop: '10px',
                                                        fontSize: '17px',
                                                    }}
                                                >
                                                    <strong>
                                                        해설 :{' '}
                                                        {question.explanation}
                                                    </strong>
                                                </p>
                                                {results[question.id] ===
                                                    'incorrect' &&
                                                    feedbackMessages[
                                                        question.id
                                                    ] && (
                                                        <p
                                                            style={{
                                                                color: 'navy',
                                                                fontSize:
                                                                    '17px',
                                                                marginTop:
                                                                    '10px',
                                                            }}
                                                        >
                                                            <strong>
                                                                피드백 :{' '}
                                                                {
                                                                    feedbackMessages[
                                                                        question
                                                                            .id
                                                                    ]
                                                                }
                                                            </strong>
                                                        </p>
                                                    )}
                                            </ExplainHelp>
                                            {results[question.id] ===
                                                'incorrect' && (
                                                <GoChatBot>
                                                    <ChatBotButton
                                                        type='button'
                                                        onClick={() => {
                                                            const userAnswer =
                                                                question.type ===
                                                                0
                                                                    ? radioAnswers[
                                                                          question
                                                                              .id
                                                                      ]
                                                                    : textAnswers[
                                                                          question
                                                                              .id
                                                                      ];
                                                            handleGoToChatBot_withQuest(
                                                                question.id,
                                                                question.question,
                                                                question.choices,
                                                                userAnswer,
                                                                question.correct_answer
                                                            );
                                                        }}
                                                    >
                                                        질문하러 가기
                                                    </ChatBotButton>
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
                                    type='submit'
                                    disabled={isSubmitted}
                                    onMouseEnter={() => setSubmitHovering(true)}
                                    onMouseLeave={() =>
                                        setSubmitHovering(false)
                                    }
                                    onClick={ModalSubmit}
                                >
                                    제출하기
                                </SubmitButton>
                                {submitHovering && !isSubmitted && (
                                    <WarningMessage
                                        style={{ display: 'block' }}
                                    >
                                        {' '}
                                        ⚠️ 제출은 한 번만 가능합니다! <br />{' '}
                                        다시 한 번 검토해주세요.
                                    </WarningMessage>
                                )}
                                {showScoreModal && (
                                    <ScoreModal
                                        isOpen={showScoreModal}
                                        onRequestClose={handleCloseModal}
                                        scoreData={{ score: score }}
                                        totalQuestion={questions.length}
                                    />
                                )}
                            </div>
                            {showExplanationButton && (
                                <AnswerButton
                                    type='button'
                                    onClick={toggleExplanations}
                                >
                                    {isFeedbackOpen
                                        ? '피드백 닫기'
                                        : '피드백 받기'}
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

const DivisionLine = styled.div`
    border-top: 2px dashed #444444;
    margin: 40px auto;
    width: 400px;
    height: 0px;

    &:after {
        content: '◆';
        position: relative;
        top: -9px;
        left: calc(50%, 7px);
    }
`;

const Wrapper = styled.div`
    margin-top: 10px;
    padding: 0 10px; /* 모바일에 맞게 패딩 추가 */
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    // margin-top: 5px;
    flex-wrap: wrap; /* 모바일에 맞게 버튼을 줄바꿈 가능하도록 설정 */
`;

const MakeTest = styled.div`
    padding: 20px;
    margin: 50px auto 20px auto;
    width: 100%;
    max-width: 800px;
    border: 3px solid;
    box-sizing: border-box; /* 모바일에 맞게 박스 크기를 조정 */
`;

const ExamTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap; /* 모바일에서 로고와 제목이 겹치지 않도록 설정 */
`;

const Title = styled.div`
    color: #000;
    text-align: center;
    font-size: 32px; /* 모바일에 맞게 폰트 크기 조정 */
    font-style: normal;
    font-weight: bold;
    line-height: normal;

    @media (min-width: 768px) {
        font-size: 45px; /* 데스크탑에서는 기존 크기 */
    }
`;

const LogoImg = styled.img`
    height: 50px; /* 모바일에 맞게 로고 크기 조정 */
    width: auto;
    margin-right: 10px;

    @media (min-width: 768px) {
        height: 70px; /* 데스크탑에서는 기존 크기 */
        margin-right: 20px;
    }
`;

const Info = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin: 25px 0 20px 10px;
    font-size: 18px; /* 모바일에 맞게 폰트 크기 조정 */

    @media (min-width: 768px) {
        font-size: 20px; /* 데스크탑에서는 기존 크기 */
    }
`;

const InfoLine = styled.div`
    display: inline-block;
    border-bottom: 2px solid black;
    width: 100px; /* 모바일에 맞게 너비 조정 */
    height: 20px;

    @media (min-width: 768px) {
        width: 150px; /* 데스크탑에서는 기존 크기 */
    }
`;

const Line = styled.div`
    height: 2px;
    background: #000;
    width: 100%;
    max-width: 1000px;
    margin: 10px auto 40px;
`;

const StyledTest = styled.form`
    margin-left: 0;
    padding: 20px;
    box-sizing: border-box;

    @media (min-width: 768px) {
        margin-left: 20px; /* 데스크탑에서는 기존 마진 */
    }
`;

const TestContainer = styled.div`
    padding-bottom: 20px;
    border-bottom: 3px dotted #9e9e9e;
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
    flex-wrap: wrap; /* 모바일에서 줄바꿈 가능하도록 설정 */
`;

const IndexText = styled.a`
    font-weight: bold;
    font-size: 18px; /* 모바일에 맞게 폰트 크기 조정 */
    margin-right: 8px;

    &.incorrect {
        color: red;
    }

    @media (min-width: 768px) {
        font-size: 20px; /* 데스크탑에서는 기존 크기 */
    }
`;

const ImageOverlay = styled.img`
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    left: 10px;
    width: 30px; /* 모바일에 맞게 이미지 크기 조정 */
    height: 30px;

    @media (min-width: 768px) {
        width: 50px; /* 데스크탑에서는 기존 크기 */
        height: 50px;
    }
`;

const QuestionText = styled.a`
    flex: 1;
    text-align: left;
    font-weight: bold;
    font-size: 16px; /* 모바일에 맞게 폰트 크기 조정 */

    @media (min-width: 768px) {
        font-size: 18px; /* 데스크탑에서는 기존 크기 */
    }
`;

const QuestionDetails = styled.div`
    display: flex;
    flex-direction: column;
`;

const RadioLabel = styled.label`
    margin-bottom: 5px;
    text-align: left;
    font-size: 16px; /* 모바일에 맞게 폰트 크기 조정 */
    cursor: pointer;

    input[type='radio'] {
        margin-right: 10px;
        transform: scale(1.2);
    }

    @media (min-width: 768px) {
        font-size: 17px; /* 데스크탑에서는 기존 크기 */
    }
`;

const TextInput = styled.input`
    width: 100%; /* 모바일에서 입력 필드가 화면에 맞게 조정되도록 설정 */
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
    flex-wrap: initial; /* 모바일에서 버튼이 줄바꿈 가능하도록 설정 */
`;

const SubmitButton = styled.button`
    width: 100%; /* 모바일에서 버튼이 화면 전체 너비를 차지하도록 설정 */
    max-width: 120px; /* 데스크탑에서는 최대 너비 설정 */
    height: 50px;
    border-radius: 10px;
    border: 3px solid #787878;
    background: #eeeeee;
    font-size: 16px; /* 모바일에 맞게 폰트 크기 조정 */
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
    font-family: 'Pretendard-Regular';
    margin-right: 30px;
    margin-left: 10px;

    &:hover {
        background: #c2c2c2;
    }

    &:active {
        background: #9e9e9e;
    }

    @media (min-width: 768px) {
        font-size: 18px; /* 데스크탑에서는 기존 크기 */
    }
`;

const WarningMessage = styled.div`
    display: none;
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #ffded5;
    padding: 10px 20px;
    margin-bottom: 10px;
    border: 2px #fd8a69 solid;
    border-radius: 10px;
    font-size: 14px; /* 모바일에 맞게 폰트 크기 조정 */
    font-weight: bold;
    white-space: nowrap;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    z-index: 10;

    @media (min-width: 768px) {
        font-size: 17px; /* 데스크탑에서는 기존 크기 */
    }
`;

const AnswerButton = styled.button`
    width: 100%; /* 모바일에서 버튼이 화면 전체 너비를 차지하도록 설정 */
    max-width: 120px; /* 데스크탑에서는 최대 너비 설정 */
    height: 50px;
    border-radius: 10px;
    border: 3px solid #ffc67e;
    background: #feebb6;
    font-size: 16px; /* 모바일에 맞게 폰트 크기 조정 */
    font-weight: bold;
    cursor: pointer;
    font-family: 'Pretendard-Regular';
    margin-left: 20px;

    &:hover {
        background: #ffc67e;
    }

    &:active {
        background: #ffc67e;
    }

    @media (min-width: 768px) {
        font-size: 18px; /* 데스크탑에서는 기존 크기 */
    }
`;

const QuestButton = styled.button`
    width: 100%; /* 모바일에서 버튼이 화면 전체 너비를 차지하도록 설정 */
    max-width: 120px; /* 데스크탑에서는 최대 너비 설정 */
    height: 50px;
    border-radius: 10px;
    border: 3px solid #ffab93;
    background: #ffe1d9;
    font-size: 16px; /* 모바일에 맞게 폰트 크기 조정 */
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-left: 10px;
    font-family: 'Pretendard-Regular';

    &:hover {
        background: #ffab93;
    }

    &:active {
        background: #ffab93;
    }

    @media (min-width: 768px) {
        font-size: 18px; /* 데스크탑에서는 기존 크기 */
    }
`;

const ExplainHelp = styled.p`
    font-size: 14px; /* 모바일에 맞게 폰트 크기 조정 */
    text-align: left;
    padding: 15px;
    margin: 15px 0;
    border: 4px #fd9f28 dotted;
    background-color: #fff3e3;
    border-radius: 5px;

    @media (min-width: 768px) {
        font-size: 15px; /* 데스크탑에서는 기존 크기 */
    }
`;

const ClearBox = styled.div`
    text-align: right;
    margin-right: 30px;
`;

const ClearText = styled.button`
    font-size: 18px;
    &:hover {
        color: #9e9e9e;
    }
    border: none;
    padding: 10px;
    background: white;
    color: black;
    font-weight: bold;
    font-family: 'Pretendard-Regular';
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
        background-color: #c2c2c2;
    }
    font-family: 'Pretendard-Regular';
    font-size: 15px;
    font-weight: bold;

    @media (min-width: 768px) {
        font-size: 16px;
    }
`;

const CreditWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #333;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    text-align: center;
`;
