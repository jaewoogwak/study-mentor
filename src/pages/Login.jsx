import React, { useEffect } from 'react';
import styled from 'styled-components';
import login_main from '../assets/login_main.png';

import google from '../assets/google.png';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

const provider = new GoogleAuthProvider();

const NewLoginPage = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const { user, login } = useAuth();

    const handleGoogleLogin = () => {
        signInWithPopup(auth, provider)
            .then(async (result) => {
                try {
                    const querySnapshot = await getDocs(
                        collection(db, 'users')
                    );
                    const users = [];
                    querySnapshot.forEach((doc) => {
                        users.push(doc.data().email);
                    });

                    if (!users.includes(result.user.email)) {
                        await addDoc(collection(db, 'users'), {
                            email: result.user.email,
                            uid: result.user.uid,
                        });

                        await addDoc(collection(db, 'credits'), {
                            email: result.user.email,
                            credit: 3,
                        });
                    }

                    navigate('/');
                } catch (err) {
                    console.log('[Err]', err);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            login(user);
        });
    }, []);

    return (
        <OuterContainer>
            <InnerContainer>
                <Title>Study Mentor</Title>
                <Description>ChatGPT 기반 스터디 멘토 플랫폼</Description>
                <LoginButton onClick={handleGoogleLogin}>로그인</LoginButton>
                <LoginImageContainer>
                    <LoginImage src={login_main} alt='login_main' />
                </LoginImageContainer>
            </InnerContainer>
        </OuterContainer>
    );
};

export default NewLoginPage;

const OuterContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
    background-color: rgb(253, 253, 253);

    box-sizing: border-box;
`;

const InnerContainer = styled.div`
    width: 100%;
    max-width: 500px; /* 화면 중앙의 최대 너비 */
    padding: 20px;
    border-radius: 10px;

    display: flex;
    flex-direction: column;
    align-items: center;

    @media (max-width: 768px) {
        max-width: 90%; /* 모바일에서의 너비 조정 */
        padding: 10px;
    }
`;

const Title = styled.div`
    color: #fd9f28;
    text-align: center;
    margin-top: 20px;
    font-size: 60px;
    font-weight: 900;

    @media (max-width: 768px) {
        font-size: 40px;
        margin-top: 10px;
    }
`;

const Description = styled.div`
    margin-top: 10px;
    color: #000;
    text-align: center;
    font-size: 24px;
    font-weight: 600;

    @media (max-width: 768px) {
        font-size: 18px;
    }
`;

const LoginButton = styled.button`
    width: 150px;
    height: 50px;
    margin-top: 20px;
    border-radius: 30px;
    border: 1px solid #fd9f28;
    background: rgba(253, 159, 40, 0.5);
    font-size: 18px;
    cursor: pointer;
    &:hover {
        background: #fd9f28;
        color: #fff;
    }

    @media (max-width: 768px) {
        width: 120px;
        height: 40px;
        font-size: 16px;
    }
`;

const LoginImageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 20px;

    @media (max-width: 768px) {
        flex-direction: column;
        margin-top: 10px;
    }
`;

const LoginImage = styled.img`
    width: 300px;
    object-fit: contain;
    z-index: 3;
    position: relative;

    @media (max-width: 768px) {
        width: 80%;
    }
`;
