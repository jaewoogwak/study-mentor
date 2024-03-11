import React from 'react';
import styled from 'styled-components';
import login_main from '../assets/login_main.png';
import login_left_circle from '../assets/login_left_circle.png';
import login_right_circle from '../assets/login_right_circle.png';

const NewLoginPage = () => {
    return (
        <Container>
            <Title>Study Mentor</Title>
            <Description>ChatGPT 기반 스터디 멘토 플랫폼</Description>
            <LoginButton>
                <LoginFont>로그인</LoginFont>
            </LoginButton>
            <LoginImageContainer>
                <LoginLeftCircle
                    src={login_left_circle}
                    alt='login_left_circle'
                />
                <LoginImage src={login_main} alt='login_main' />
                <LoginRightCircle
                    src={login_right_circle}
                    alt='login_right_circle'
                />
            </LoginImageContainer>
        </Container>
    );
};

export default NewLoginPage;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
    background-color: rgb(253, 253, 253);
`;

const Title = styled.div`
    color: #fd9f28;
    padding: 0;
    text-align: center;
    margin-top: 41px;

    font-size: 100px;
    font-style: normal;
    font-weight: 900;
    font-family: 'Passion One';
`;

const Description = styled.div`
    margin-top: 10px;
    color: #000;

    text-align: center;
    font-family: 'Anek Kannada';
    font-size: 40px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;

const LoginButton = styled.button`
    width: 168px;
    height: 62px;
    margin-top: 38px;
    flex-shrink: 0;
    border-radius: 60px;
    border: 1px solid #fd9f28;
    background: rgba(253, 159, 40, 0.5);
`;

const LoginFont = styled.div`
    color: #000;

    text-align: center;
    font-family: Abel;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const LoginImageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: 100%;
`;

const LoginImage = styled.img`
    margin-top: 38px;
    width: 550px;
    object-fit: contain;
    z-index: 3;
    top: 20px;
    position: relative;
`;

const LoginLeftCircle = styled.img`
    position: relative;
    top: 80px;
    left: 40px;
    z-index: 1;
    width: 300px;
`;

const LoginRightCircle = styled.img`
    width: 300px;
    position: relative;
    top: 20px;
    right: 40px;
    z-index: 1;
`;
