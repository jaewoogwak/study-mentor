import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CheckListLogo from '../assets/checklistlogo.png'

import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const CheckList = () => {
    const [documents, setDocuments] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [answers, setAnswers] = useState({});
    const [expandedDocId, setExpandedDocId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                fetchDocuments(user.uid);
            } else {
                setUser(null);
                setLoading(false); // Stop loading if no user is authenticated
            }
        });

        return () => unsubscribe(); // Clean up the listener
    }, []);

    const fetchDocuments = async (userId) => {
        try {
            const colRef = collection(db, 'users', userId, 'exams');
            const querySnapshot = await getDocs(colRef);

            const docs = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setDocuments(docs);
            setLoading(false); // Stop loading when documents are fetched
        } catch (error) {
            console.error('Error fetching documents:', error);
            setLoading(false); // Stop loading if there is an error
        }
    };

    const handleShowAnswer = (question) => {
        setSelectedQuestion(prev => (prev === question ? null : question));
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

    const handleDeleteDocument = async (docId) => {
        try {
            if (user) {
                await deleteDoc(doc(db, 'users', user.uid, 'exams', docId));
                setDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== docId));
            }
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    const handleToggleDocument = (id) => {
        setExpandedDocId(expandedDocId === id ? null : id);
    };

    if (loading) {
        return <p>Loading...</p>; // Show loading state
    }

    if (!user) {
        return <p>로그인 필요</p>; // Handle case where user is not authenticated
    }


    return (
        <Wrapper>
            {documents.length > 0 ? (
                documents.map(doc => (
                    <div key={doc.id}>
                        <DocContainer>
                            <DocButton onClick={() => handleToggleDocument(doc.id)} style={{ cursor: 'pointer' }}>
                                Document ID: {doc.id}
                            </DocButton>
                        </DocContainer>
                        {expandedDocId === doc.id && (
                            <DocumentContainer>
                                <InfoContainer>
                                    <LogoImg src={CheckListLogo} alt="Checklist Logo" />
                                    <h1>재시험 (Doc ID: {doc.id})</h1>
                                </InfoContainer>
                                <Line />
                                {doc.items && doc.items.length > 0 ? (
                                    doc.items.map((item, index) => (
                                        <QuestionContainer key={index}>
                                            <QuestionTitle>
                                                <IndexText>Question {index + 1}.</IndexText>
                                                <QuestionText>{item.question}</QuestionText>
                                            </QuestionTitle>
                                            {item.case === 0 ? (
                                                <ChoicesList>
                                                    {Array.isArray(item.choices) && item.choices.map((choice, i) => (
                                                        <ChoiceItem key={i}>
                                                            <input
                                                                type="radio"
                                                                id={`q${index}_c${i}`}
                                                                name={`q${index}`}
                                                                onChange={() => handleRadioChange(index, i)}
                                                            />
                                                            <label htmlFor={`q${index}_c${i}`}>{choice}</label>
                                                        </ChoiceItem>
                                                    ))}
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
                                            <DetailsContainer>
                                                <ShowAnswerButton onClick={() => handleShowAnswer(item)}>
                                                    {selectedQuestion === item ? '답안 숨기기' : '답안 보기'}
                                                </ShowAnswerButton>
                                                {selectedQuestion === item && (
                                                    <AnswerDetails>
                                                        <DeatailsText><strong>답:</strong> {item.correct_answer}</DeatailsText>
                                                        <DeatailsText><strong>설명:</strong> {item.explanation}</DeatailsText>
                                                        <DeatailsText><strong>출제 의도:</strong> {item.intent}</DeatailsText>
                                                    </AnswerDetails>
                                                )}
                                            </DetailsContainer>
                                        </QuestionContainer>
                                    ))
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
                <QuestionText>Loading ... </QuestionText>
            )}
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
    background-color: rgba(253, 138, 105, 0.3); /* RGB 색상 + 투명도 (0.5) */
    cursor: pointer; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
    transition: box-shadow 0.3s ease;

    &:hover {
        box-shadow: 0 7px 13px rgba(0, 0, 0, 0.3); 
    }
`;


const InfoContainer = styled.div`
    display: flex;           
    flex-direction: row;     
    align-items: center;   
    justify-content: center; 
    gap: 10px;            
`;

const LogoImg = styled.img`
    width: 70px;
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

const ShowAnswerButton = styled.button`
    font-family: 'Pretendard-Regular';
    margin-top: 20px;
    padding: 10px 25px;
    border: none;
    border-radius: 4px;
    background-color: #7DB249;
    color: white;
    cursor: pointer;
    font-size: 16px;
    display: block;      
    margin-left: auto;

    &:hover {
        background-color: #568A35;
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

const DeatailsText = styled.p`
    margin-bottom: 3px;
    font-size: 17px;
`;

const DeleteButton = styled.button`
    font-family: 'Pretendard-Regular';
    padding: 10px 25px;
    border: none;
    border-radius: 4px;
    background-color: #FD9F28;
    color: white;
    cursor: pointer;
    font-size: 16px;  

    &:hover {
        background-color: #0056b3;
    }
`;

