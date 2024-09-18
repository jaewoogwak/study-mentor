import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Header from '../components/Header';
import { auth } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);

    const { user, login, logout } = useAuth();

    const sendVerificationCode = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/pdf/auth-email`,
                { email: email }
            );
            setMessage(response.data.message);
            setIsCodeSent(true);
        } catch (error) {
            setMessage('Error sending verification code');
        }
    };

    const verifyCode = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/pdf/auth-num`,
                { email: email, authnum: code }
            );
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error verifying code');
        }
    };

    return (
        <Wrapper>
            <Header />
            <MainWrapper>
                <InfoContainer>
                    <InfoBox>
                        <h2>🌏 한국기술교육대학교 이메일 인증</h2>
                        <TextCustom>
                            학교 이메일(@koreatech.ac.kr) 인증 시 <br />
                            무료 사용 횟수 10회를 제공합니다.
                        </TextCustom>
                    </InfoBox>
                </InfoContainer>

                <ContentWrapper>
                    <h2>이메일 인증</h2>

                    <InputField
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='@koreatech.ac.kr'
                    />
                    <ActionButton onClick={sendVerificationCode}>
                        인증 코드 발송
                    </ActionButton>

                    {isCodeSent && (
                        <>
                            <InputField
                                type='text'
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder='인증 코드를 입력하세요'
                            />
                            <ActionButton onClick={verifyCode}>
                                코드 확인
                            </ActionButton>
                        </>
                    )}

                    {message && <Message>{message}</Message>}

                    <LogoutButton
                        onClick={() => {
                            auth.signOut();
                            logout();
                            window.location.href = '/login';
                        }}
                    >
                        로그아웃
                    </LogoutButton>
                </ContentWrapper>
            </MainWrapper>
        </Wrapper>
    );
};

export default Settings;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    /* background-color: #f4f6f8; */
`;

const MainWrapper = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
`;

const InfoContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 30px;
`;

const InfoBox = styled.div`
    width: 750px;
    padding: 30px;
    background: #d7fdc9;
    border-radius: 12px;
    text-align: center;
`;

const TextCustom = styled.p`
    font-size: 18px;
    margin-top: 10px;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
`;

const InputField = styled.input`
    width: 400px;
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 16px;
    outline: none;

    @media (max-width: 768px) {
        width: 90%;
    }
`;

const ActionButton = styled.button`
    width: 420px;
    margin: 10px 0;
    padding: 12px;
    background-color: #3a4ca8;
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;

    &:hover,
    &:active {
        background-color: #5d6dbe;
    }

    @media (max-width: 768px) {
        width: 90%;
    }
`;

const Message = styled.p`
    color: #4caf50;
    margin-top: 15px;
`;

const LogoutButton = styled(ActionButton)`
    background-color: #f44336;
    cursor: pointer;

    &:hover,
    &:active {
        background-color: #e53935;
    }
`;
