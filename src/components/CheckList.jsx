import { useContext, useEffect, useState } from 'react';

import { auth, db } from '../services/firebase';

import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc,
    getDoc,
} from 'firebase/firestore';

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import {
    Link,
    useNavigate,
    // useLocation,
} from 'react-router-dom';

import { onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import { set } from 'firebase/database';

import logo from '../assets/logo.png';

import styled from 'styled-components';

const CheckList = () => {

    const { user, login } = useAuth();
    const [documents, setDocuments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((usr) => {
            login(usr);

            if (!usr) {
                navigate('/login');
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [login, navigate]);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                // 컬렉션 참조 생성
                const colRef = collection(db, 'exams');
                
                // 모든 문서 데이터 가져오기
                const querySnapshot = await getDocs(colRef);
                
                // 문서 데이터를 상태에 저장
                const docsArray = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setDocuments(docsArray);
            } catch (e) {
                console.error('Error getting documents:', e);
            }
        };

        fetchDocuments();
    }, []);

    return (
        <Wrapper>
            {documents.length > 0 ? (
                documents.map(doc => (
                    <div key={doc.id}>
                        <h3>Document ID: {doc.id}</h3>
                        <CheckTest>
                            <ExamTitle>
                                <LogoImg src={logo} alt='logo' />
                                <Title>Study Mentor Exam</Title>
                            </ExamTitle>
                            
                        </CheckTest>
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
    display: flex;
    flex-direction: column;
    align-items: center; 
    padding: 20px;
`;

const CheckTest = styled.div`
    padding: 20px;
    margin: 50px auto 20px auto;
    width: 100%;
    max-width: 800px; 
    border: 3px solid black; 
    box-sizing: border-box;  
`;

const ExamTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap; 
`;

const LogoImg = styled.img`
    width: 50px;
    height: auto; 
`;

const Title = styled.div`
   margin-left: 10px;
   font-family: 'Pretendard-Regular'; 
   font-size: 24px; 
`;