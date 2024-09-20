import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Header from '../components/Header';
import { auth, db } from '../services/firebase'; // firebase DB 가져오기
import { useAuth } from '../contexts/AuthContext';
import InfoFooter from '../components/InfoFooter';
import {
    doc,
    updateDoc,
    getDocs,
    collection,
    query,
    where,
} from 'firebase/firestore'; // Firestore 관련 함수 가져오기

const Settings = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isEmailTouched, setIsEmailTouched] = useState(false);

    const { user, logout } = useAuth(); // AuthContext 사용

    const handleEmailChange = (e) => {
        const inputEmail = e.target.value;
        setEmail(inputEmail);
        setIsEmailTouched(true);
        setIsValidEmail(inputEmail.endsWith('@koreatech.ac.kr'));
    };

    const sendVerificationCode = async () => {
        if (!isValidEmail) {
            setMessage('학교 이메일(@koreatech.ac.kr)만 사용 가능합니다.');
            setIsError(true);
            return;
        }
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/email`,
                { email: email }
            );
            setMessage(response.data.message);
            setIsError(false);
            setIsCodeSent(true);
        } catch (error) {
            setMessage('Error sending verification code');
            setIsError(true);
        }
    };

    const verifyCode = async () => {
        try {
            // 먼저 이미 인증된 사용자인지 확인
            const user = auth.currentUser;

            // 유저의 이메일
            const userEmail = user.email;
            const q = query(
                collection(db, 'credits'),
                where('email', '==', userEmail)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                querySnapshot.forEach((docSnapshot) => {
                    const docData = docSnapshot.data();
                    // isVerified가 true이거나 isVerified 필드가 없으면 이미 인증된 사용자로 판단
                    if (docData.isVerified) {
                        setMessage('이미 인증된 사용자입니다.');
                        setIsError(true);
                        throw new Error('이미 인증된 사용자');
                    }
                });
            }

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/num`,
                { email: userEmail, authnum: code }
            );

            setMessage(response.data.message);
            setIsError(false);

            // 이메일 인증 성공 시 Firebase에서 크레딧 업데이트 로직
            if (response.status === 200) {
                console.log('updateCredits');
                await updateCredits(userEmail, 10); // 인증 후 크레딧 10으로 업데이트
            }
        } catch (error) {
            if (error.message === '이미 인증된 사용자') {
                setMessage('이미 인증된 사용자입니다.');
            } else {
                console.log(error);
                setMessage(
                    '인증 코드 확인 중 오류가 발생했습니다. 다시 시도해주세요.'
                );
            }
            setIsError(true);
        }
    };

    // Firebase에서 해당 이메일 사용자의 크레딧을 10으로 업데이트하는 함수
    const updateCredits = async (email, newCredit) => {
        try {
            const q = query(
                collection(db, 'credits'),
                where('email', '==', email)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                querySnapshot.forEach(async (docSnapshot) => {
                    const docRef = doc(db, 'credits', docSnapshot.id);
                    await updateDoc(docRef, {
                        credit: newCredit,
                        isVerified: true, // 인증 상태도 true로 업데이트
                    });
                });
                console.log('Credits successfully updated to 10.');
                setMessage('Credits successfully updated to 10.');
                setIsError(false);
            } else {
                setMessage('User not found in credits collection.');
                setIsError(true);
            }
        } catch (error) {
            setMessage('Error updating credits');
            setIsError(true);
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
                            isTouched={isEmailTouched}
                        />
                        <ActionButton
                            onClick={sendVerificationCode}
                            disabled={!isValidEmail}
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

                        {message && (
                            <Message isError={isError}>{message}</Message>
                        )}

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
            !isTouched ? '#ccc' : isValid ? '#4caf50' : '#f44336'};
    font-size: 16px;
    outline: none;
    background-color: ${({ isTouched, isValid }) =>
        !isTouched ? 'white' : isValid ? '#e8f5e9' : '#ffebee'};

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
    color: ${({ isError }) => (isError ? '#f44336' : '#4caf50')};
    margin: 15px;
`;

const LogoutButton = styled(ActionButton)`
    background-color: #fd6f22;

    &:hover,
    &:active {
        background-color: #fc5230;
    }
`;
