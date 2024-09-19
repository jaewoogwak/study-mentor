import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Header from '../components/Header';
import { auth } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import InfoFooter from '../components/InfoFooter';

const Settings = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(false); // 이메일 유효성 상태
    const [isEmailTouched, setIsEmailTouched] = useState(false); // 이메일 입력 여부 상태

    const { user, login, logout } = useAuth();

    // 이메일이 @koreatech.ac.kr로 끝나는지 확인
    const handleEmailChange = (e) => {
        const inputEmail = e.target.value;
        setEmail(inputEmail);
        setIsEmailTouched(true); // 이메일을 입력하기 시작한 시점
        setIsValidEmail(inputEmail.endsWith('@koreatech.ac.kr')); // 이메일이 유효하면 true
    };

    const sendVerificationCode = async () => {
        if (!isValidEmail) {
            setMessage('학교 이메일(@koreatech.ac.kr)만 사용 가능합니다.');
            return;
        }
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/email`,
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
                `${import.meta.env.VITE_API_URL}/auth/num`,
                { email: email, authnum: code }
            );
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error verifying code');
        }
    };

    return (
        <>
            <Wrapper>
                <Header />
                <InfoContainer>
                    <InfoBox>
                        <InfoText>🏫 한국기술교육대학교 이메일 인증</InfoText>
                        <TextCustom>
                            학교 이메일(@koreatech.ac.kr) 인증 시 <br />
                            무료 사용 횟수 10회를 제공합니다.
                        </TextCustom>
                    </InfoBox>
                </InfoContainer>
                <MainWrapper>
                    <ContentWrapper>
                        <h2 style={{ margin: '-30px 0px 20px 0px' }}>
                            이메일 인증
                        </h2>

                        <InputField
                            type='email'
                            value={email}
                            onChange={handleEmailChange}
                            placeholder='@koreatech.ac.kr'
                            isValid={isValidEmail}
                            isTouched={isEmailTouched} // 유효성 검사를 위한 상태 전달
                        />
                        <ActionButton
                            onClick={sendVerificationCode}
                            disabled={!isValidEmail} // 이메일 유효하지 않으면 버튼 비활성화
                        >
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
            <InfoFooter />
        </>
    );
};

export default Settings;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    margin: 0 auto;
`;

const MainWrapper = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const InfoContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 30px;

    @media (max-width: 768px) {
        margin: 20px;
    }
`;

const InfoBox = styled.div`
    width: 770px;
    padding: 30px;
    background: #fff0dd;
    border-radius: 12px;

    @media (max-width: 768px) {
        width: 90%;
        padding: 20px;
    }
`;

const InfoText = styled.h3`
    font-size: 24px;

    @media (max-width: 768px) {
        font-size: 18px;
    }
`;

const TextCustom = styled.p`
    font-size: 18px;
    margin-top: 10px;

    @media (max-width: 768px) {
        font-size: 14px;
        margin-top: 10px;
    }
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const InputField = styled.input`
    width: 400px;
    padding: 10px;
    margin: 20px 0;
    border-radius: 5px;
    border: 1px solid
        ${({ isTouched, isValid }) =>
            !isTouched
                ? '#ccc'
                : isValid
                ? '#4caf50'
                : '#f44336'}; /* 이메일을 터치한 후 유효성에 따라 색상 변경 */
    font-size: 16px;
    outline: none;
    background-color: ${({ isTouched, isValid }) =>
        !isTouched
            ? 'white'
            : isValid
            ? '#e8f5e9'
            : '#ffebee'}; /* 이메일을 터치한 후 유효성에 따라 배경색 변경 */

    @media (max-width: 768px) {
        width: 80%;
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
    font-family: 'Pretendard-Regular';
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
    pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};

    &:hover,
    &:active {
        background-color: #5d6dbe;
    }

    @media (max-width: 768px) {
        width: 90%;
        font-size: 12px;
        width: 200px;
    }
`;

const Message = styled.p`
    color: #4caf50;
    margin: 15px;
`;

const LogoutButton = styled(ActionButton)`
    background-color: #fd6f22;

    &:hover,
    &:active {
        background-color: #fc5230;
    }
`;
