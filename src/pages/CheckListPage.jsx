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
                    <h1>See You Soon ! </h1>
                </InfoContainer>
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
    margin: 50px;
`;