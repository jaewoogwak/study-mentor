import React, { useEffect } from 'react';
import styled from 'styled-components';
import title from '../assets/title.png';
import google from '../assets/google.png';
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

const provider = new GoogleAuthProvider();

const NewLogin = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const { user, login, logout } = useAuth();

    const handleGoogleLogin = () => {
        signInWithPopup(auth, provider)
            .then(async (result) => {
                console.log(result.user.email);
                try {
                    const querySnapshot = await getDocs(
                        collection(db, 'users')
                    );
                    const users = [];
                    querySnapshot.forEach((doc) => {
                        console.log(`${doc.id} => ${doc.data().email}`);
                        users.push(doc.data().email);
                    });

                    if (!users.includes(result.user.email)) {
                        const docRef = await addDoc(collection(db, 'users'), {
                            email: result.user.email,
                            uid: result.user.uid,
                        });
                    }

                    navigate('/');
                } catch (err) {
                    console.log('[Err]', err);
                }

                console.log(result);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            login(user);
            // user && navigate('/');
        });
    }, []);

    return (
        <Wrapper>
            <LogoContainer>
                <LogoImage src={title} />
            </LogoContainer>
            <LoginContainer>
                나만의 학습 어시스턴트 지금 시작하기
                <GoogleLoginButton
                    onClick={() => {
                        handleGoogleLogin();
                    }}
                >
                    <GoogleIcon src={google} alt='' />
                    Google 로그인
                </GoogleLoginButton>
            </LoginContainer>
        </Wrapper>
    );
};

export default NewLogin;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
    background-color: rgb(253, 253, 253);
`;

const LogoContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: 100%;
`;

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: 100%;
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 34px;
    font-stretch: narrower;
    font-weight: bold;
`;

const LogoImage = styled.img`
    width: 700px;
    margin-left: 80px;
`;

const GoogleLoginButton = styled.button`
    width: 300px;
    height: 50px;
    background-color: #fff;
    border: 0.5px solid #000000bb;
    border-radius: 10px;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
`;

const GoogleIcon = styled.img`
    width: 30px;
    height: 30px;
    margin-right: 30px;
`;
