import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import logo from '../assets/logo.png';

import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const CheckList = () => {
    const [documents, setDocuments] = useState([]);
    const [allAnswersVisible, setAllAnswersVisible] = useState(false);
    const [answers, setAnswers] = useState({});
    const [expandedDocId, setExpandedDocId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [entries, setEntries] = useState([]);
    const entriesPerPage = 15;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                fetchDocuments(user.uid);
            } else {
                setUser(null);
                setLoading(false); 
            }
        });

        return () => unsubscribe(); 
    }, []);

    const fetchDocuments = async (userId) => {
        try {
            const examColRef = collection(db, 'users', userId, 'exams');
            const examSnapshot = await getDocs(examColRef);
    
            if (examSnapshot.empty) {
                console.log('No documents found.');
                setLoading(false);
                return;
            }
            
            const ExamDocs = examSnapshot.docs.map(doc => {
                const data = doc.data();
                console.log(data)
                const date = data.timestamp.toDate();
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                });

                return {
                    id: doc.id,
                    examData: data.examData || {},
                    feedbackData: data.feedbackData || {},
                    timestamp: {
                        original: date,
                        formatted: formattedDate,
                    },
                };
            });
    
            console.log('ExamDocs with FeedbackData:', ExamDocs);
            setDocuments(ExamDocs);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching documents:', error);
            setLoading(false); 
        }
    };

    const handleToggleDocument = (id) => {
        setExpandedDocId(expandedDocId === id ? null : id);
    };

    const handleShowAllAnswers = (docId) => {
        setAllAnswersVisible(!allAnswersVisible);
    };

    const handleDeleteDocument = async (docId) => {
        try {
            if (user) {
                await deleteDoc(doc(db, 'users', user.uid, 'exams', docId));
                await deleteDoc(doc(db, 'users', user.uid, 'feedbacks', docId));
                setDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== docId));
            }
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    const handleRadioChange = (questionIndex, choiceIndex) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [`q${questionIndex}`]: choiceIndex
        }));
    };

    const handleTextChange = (questionIndex, event) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [`q${questionIndex}`]: event.target.value
        }));
    };

    const totalPages = Math.ceil(entries.length / entriesPerPage);

    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    const currentEntries = entries.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return <h2>Loading...</h2>; 
    }

    if (!user) {
        return <h2>로그인 필요</h2>; 
    }

    return (
        <Wrapper>
            {documents.length > 0 ? (
                documents.map(doc => (
                    <div key={doc.id}>
                        <DocContainer>
                            <DocButton onClick={() => handleToggleDocument(doc.id)} style={{ cursor: 'pointer' }}>
                                <p style={{ fontSize: "20px" }}>Exam (Date: {doc.timestamp?.formatted || 'No Date'})</p>
                            </DocButton>
                        </DocContainer>
                        {expandedDocId === doc.id && (
                            <DocumentContainer>
                                <InfoContainer>
                                    <ExamTitle>
                                        <LogoImg src={logo} alt='logo' />
                                        <Title>ReExamination</Title>
                                    </ExamTitle>
                                    <Info>
                                        학번 : <InfoLine /> 이름 : <InfoLine />
                                    </Info>
                                </InfoContainer>
                                <Line />
                                {doc.examData && Object.keys(doc.examData).length > 0 ? (
                                    <>
                                        {Object.entries(doc.examData).map(([index, item]) => {
                                            const isCorrect = doc.feedbackData?.[index]?.isCorrect;
                                            const questionColor = isCorrect === 1 ? '#2973FF' : isCorrect === 0 ? '#FF1801' : '#2973FF';
    
                                            return (
                                                <QuestionContainer key={index}>
                                                    <QuestionTitle style={{ color: questionColor }}>
                                                        <IndexText>Question {parseInt(index) + 1}.</IndexText>
                                                        <QuestionText>{item.question}</QuestionText>
                                                    </QuestionTitle>
                                                    {item.type === 0 ? (
                                                        <ChoicesList>
                                                            {Array.isArray(item.choices) ? (
                                                                item.choices.map((choice, i) => (
                                                                    <ChoiceItem key={i}>
                                                                        <input
                                                                            type="radio"
                                                                            id={`q${index}_c${i}`}
                                                                            name={`q${index}`}
                                                                            onChange={() => handleRadioChange(index, i)}
                                                                        />
                                                                        <label htmlFor={`q${index}_c${i}`}>{choice}</label>
                                                                    </ChoiceItem>
                                                                ))
                                                            ) : (
                                                                <p>{item.choices}</p>
                                                            )}
                                                        </ChoicesList>
                                                    ) : (
                                                        <TextInputContainer>
                                                            <input
                                                                type="text"
                                                                value={answers[`q${index}`] || ''}
                                                                onChange={(e) => handleTextChange(index, e)}
                                                            />
                                                        </TextInputContainer>
                                                    )}
                                                    {allAnswersVisible && (
                                                        <AnswerDetails>
                                                            <DetailsText><strong>답:</strong> {item.correct_answer}</DetailsText>
                                                            <DetailsText><strong>설명:</strong> {item.explanation}</DetailsText>
                                                            <DetailsText><strong>출제 의도:</strong> {item.intent}</DetailsText>
                                                        </AnswerDetails>
                                                    )}
                                                </QuestionContainer>
                                            );
                                        })}
                                        <ShowAllButton onClick={() => handleShowAllAnswers(doc.id)}>
                                            {allAnswersVisible ? '답안 숨기기' : '답안 보기'}
                                        </ShowAllButton>
                                    </>
                                ) : (
                                    <p>No items found</p>
                                )}
                                <DashedLine />
                                <DeleteButton onClick={() => handleDeleteDocument(doc.id)}>
                                    삭제하기(영구)
                                </DeleteButton>
                            </DocumentContainer>
                        )}
                    </div>
                ))
            ) : (
                <WarningMessages>데이터가 없습니다. <br /> 시험문제를 먼저 생성해보세요. </WarningMessages>
            )}

            {/* 페이지 네비게이션 */}
            <Pagination>
                {Array.from({ length: totalPages }, (_, index) => (
                    <PageButton
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        style={{ backgroundColor: currentPage === index + 1 ? '#ddd' : 'white' }}
                        >
                            {index + 1}
                        </PageButton>
                ))}
            </Pagination>
        </Wrapper>
    );
};

export default CheckList;


const DashedLine = styled.div`
    margin: 30px 0px;
    border-top: 2px dashed #C2C2C2; 
    width: 100%;
`;

const Line = styled.div`
    margin: 20px 0px;
    border-top: 2px solid black; 
    width: 100%;
`;

const Wrapper = styled.div`
    flex-direction: column;
    padding: 20px;
`;

const DocContainer = styled.div`
    margin-bottom: 30px;
    margin-top: 20px;
`;

const DocButton = styled.button`
    width: 800px;
    height: 60px;
    border-radius: 10px;
    border: none;
    font-size: 17px; 
    font-family: "GmarketSansMedium";
    background-color: #FFEAE4;
    cursor: pointer; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
    transition: box-shadow 0.3s ease;

    &:hover {
        box-shadow: 0 7px 13px rgba(0, 0, 0, 0.3); 
    }
`;

const InfoContainer = styled.div`
    display: flex;           
    flex-direction: column;     
    align-items: center;   
    justify-content: center; 
    gap: 10px;            
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

const DocumentContainer = styled.div`  
    padding: 40px;
    width: 800px;
    border: 2px solid #595959;
    border-radius: 20px;
    margin-bottom: 50px;
`;

const QuestionContainer = styled.div`
    margin-top: 40px;
    margin-bottom: 0px;
`;

const QuestionTitle = styled.div`
    margin-bottom: 10px;
    text-align: left;
`;

const IndexText = styled.p`
    font-size: 22px;
    margin-bottom: 10px;
    font-weight: 600;
`;

const QuestionText = styled.p`
    font-size: 20px;
    margin-bottom: 10px;
`;

const ChoicesList = styled.div`
    margin: 20px 0px;
`;

const ChoiceItem = styled.div`
    margin-bottom: 5px;
    display: flex;
    align-items: center;

    input[type="radio"] {
        width: 15px; 
        height: 15px; 
        margin-right: 10px; 
    }

    label {
        margin-left: 10px;
        font-size: 17px;
    }
`;


const TextInputContainer = styled.div`
    margin: 20px 0px;
    font-size: 17px;
    text-align: left;
    input {
        width: 90%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
`;

const DetailsContainer = styled.div`
    margin-bottom: 50x;
`;

const ShowAllButton  = styled.button`
    width: 100%;
    font-family: 'Pretendard-Regular';
    margin-top: 60px;
    padding: 15px 25px;
    border: none;
    border-radius: 10px;
    background-color: #AFD485;
    cursor: pointer;
    font-size: 16px;
    display: block;      
    margin-left: auto;

    &:hover {
        background-color: #568A35;
        color: white;
    }
`;

const AnswerDetails = styled.div`
    text-align: left;
    padding: 20px;
    margin-top: 20px;
    border: 2px dashed #ddd;
    border-radius: 4px;
    background-color: #f9f9f9;
`;

const DetailsText = styled.p`
    margin-bottom: 3px;
    font-size: 17px;
`;

const DeleteButton = styled.button`
    font-family: 'Pretendard-Regular';
    padding: 10px 22px;
    border: none;
    border-radius: 4px;
    background-color: #EEEEE;
    cursor: pointer;
    font-size: 16px;
     margin-left: auto; 
    display: block;     

    &:hover {
        background-color: #C2C2C2;

    }
`;

const WarningMessages = styled.p`
    font-size: 23px;
`;

const Pagination = styled.div`
    margin: 30px;
    text-align: center;
`;

const PageButton = styled.button`
    padding: 5px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    margin-right: 10px;
    border-radius: 4px;
`;