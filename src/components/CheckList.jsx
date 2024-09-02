import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

const CheckList = () => {
    const [documents, setDocuments] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const colRef = collection(db, 'exams');
                const querySnapshot = await getDocs(colRef);

                const docs = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setDocuments(docs);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        fetchDocuments();
    }, []);

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

    return (
        <Wrapper>
            {documents.length > 0 ? (
                documents.map(doc => (
                    <DocumentContainer key={doc.id}>
                        <h2>Document ID: {doc.id}</h2>
                        {doc.items && doc.items.length > 0 ? (
                            doc.items.map((item, index) => (
                                <QuestionContainer key={index}>
                                    <QuestionTitle>
                                        <h3>Question {index + 1}</h3>
                                        <p>{item.question}</p>
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
                                        {selectedQuestion === item ? 'Hide Answer' : 'Show Answer'}
                                    </ShowAnswerButton>
                                    {selectedQuestion === item && (
                                        <AnswerDetails>
                                            <p><strong>Intent:</strong> {item.intent}</p>
                                            <p><strong>Explanation:</strong> {item.explanation}</p>
                                            <p><strong>Correct Answer:</strong> {item.correct_answer}</p>
                                        </AnswerDetails>
                                    )}
                                </QuestionContainer>
                            ))
                        ) : (
                            <p>No items found</p>
                        )}
                    </DocumentContainer>
                ))
            ) : (
                <p>No documents found</p>
            )}
        </Wrapper>
    );
};

export default CheckList;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

const DocumentContainer = styled.div`
    padding: 20px;
    margin: 20px;
    width: 100%;
    max-width: 800px;
    border: 2px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    box-sizing: border-box;
`;

const QuestionContainer = styled.div`
    margin-top: 20px;
    margin-bottom: 30px;
`;

const QuestionTitle = styled.div`
    margin-bottom: 10px;
`;

const ChoicesList = styled.div`
    margin-bottom: 10px;
`;

const ChoiceItem = styled.div`
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    label {
        margin-left: 8px;
    }
`;

const TextInputContainer = styled.div`
    margin-bottom: 10px;
    input {
        width: 100%;
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
