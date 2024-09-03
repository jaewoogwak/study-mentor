import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

const CheckList = ( ) => {
    const [documents, setDocuments] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [answers, setAnswers] = useState({});
    const { user, login, logout } = useAuth();

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                if (user) {
                    const userId = user.uid;
                    console.log("Fetching documents for user ID:", userId);
    
                    // Reference to the exams collection without filtering
                    const colRef = collection(db, 'users', userId, 'exams');
                    console.log("Collection Reference:", colRef);
    
                    const querySnapshot = await getDocs(colRef);
                    console.log("Documents found:", querySnapshot.size);
    
                    const docs = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    console.log("Fetched Documents:", docs);
    
                    setDocuments(docs);
                } else {
                    console.error('User is not authenticated');
                }
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };
    
        if (user !== null && user !== undefined) {
            fetchDocuments();
        }
    }, [user]);

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
            await deleteDoc(doc(db, 'exams', docId));
            console.log(`Document with ID ${docId} deleted`);
            // Update the local state to remove the deleted document
            setDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== docId));
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };
    
    return (
        <Wrapper>
            {documents.length > 0 ? (
                documents.map(doc => (
                    <div key={doc.id}>
                        <h2>Document ID: {doc.id}</h2>
                        <DocumentContainer>
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
                                                            checked={answers[`q${index}`] === i}
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
                                        <ShowAnswerButton onClick={() => handleShowAnswer(item)}>
                                            {selectedQuestion === item ? '답안 숨기기' : '답안 보기'}
                                        </ShowAnswerButton>
                                        {selectedQuestion === item && (
                                            <AnswerDetails>
                                                <p><strong>답:</strong> {item.correct_answer}</p>
                                                <p><strong>설명:</strong> {item.explanation}</p>
                                                <p><strong>출제 의도:</strong> {item.intent}</p>
                                                
                                            </AnswerDetails>
                                        )}
                                    </QuestionContainer>
                                ))
                            
                            ) : (
                                <p>No items found</p>
                            )}
                            </DocumentContainer>

                        {/* <DeleteButton onClick={() => handleDeleteDocument(doc.id)}>
                            Delete Document
                        </DeleteButton> */}
                    </div>
                ))
            ) : (
                <p>No documents found</p>
            )}
        </Wrapper>
    );
};

export default CheckList;

const Wrapper = styled.div`
    // display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

const DocumentContainer = styled.div`
    padding: 40px;
    margin: 40px;
    width: 100%;
    max-width: 800px;
    border: 2px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    box-sizing: border-box;
    text-align: left;
`;

const QuestionContainer = styled.div`
    margin-top: 20px;
    margin-bottom: 30px;
`;

const QuestionTitle = styled.div`
    margin-bottom: 10px;
`;

const IndexText = styled.p`
    font-family: 'Pretendard-Regular';
    font-size: 22px;
    margin-bottom: 10px;
    font-weight: 600;
`;

const QuestionText = styled.p`
    font-family: 'Pretendard-Regular';
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
    label {
        margin-left: 10px;
    }
    font-size: 16px;
`;

const TextInputContainer = styled.div`
    margin: 20px 0px;
    font-size: 16px;
    input {
        width: 80%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
`;

const ShowAnswerButton = styled.button`
    padding: 10px 20px;
    margin-bottom: 10px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    font-size: 16px;
    
    &:hover {
        background-color: #0056b3;
    }
`;

const AnswerDetails = styled.div`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f9f9f9;
`;

const DeleteButton = styled.button`
    padding: 10px 20px;
    margin-bottom: 10px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    font-size: 16px;
    
    &:hover {
        background-color: #0056b3;
    }
`;
