import { useContext, useEffect, useState } from 'react';
// import './NewChatbotPage.css';

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

import Header from '../components/Header';
import InfoFooter from '../components/InfoFooter';
import { useChatStore } from '../contexts/store';

import styled from 'styled-components';

const API_KEY = import.meta.env.VITE_API_KEY;

const CheckListPage = () => {

    useEffect(() => {
        auth.onAuthStateChanged((usr) => {
            login(usr);

            if (!usr) {
                navigate('/login');
            }
        });
    });

    return (
        <Wrapper>
            <Header />
                <InfoContainer>
                    <InfoBox>
                        <h3>🔵 이 페이지는 앞서 풀어본 문제에 대한 목록입니다.</h3>
                        <TextCustom>각 시험지에 대해 틀린 부분은 빨간색으로 표시되어 있으니, 다시 한 번 풀어보세요!</TextCustom>          
                    </InfoBox>
                </InfoContainer>
                <ListContainer>

                </ListContainer>
            {/* <InfoFooter /> */}
        </Wrapper>
    );
}

export default CheckListPage;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const InfoContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 50px;
`;

const InfoBox = styled.div` 
    width: 700px;
    margin: 10px;
    padding: 30px;
    background: #B8E9FF;
    border-radius: 12px;
`; 

const TextCustom = styled.p`
    font-size: 18px;
    padding-top: 10px;
`;

const ListContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 20px;
`;