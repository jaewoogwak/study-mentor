import React from 'react';
import styled from 'styled-components';
import LogoSvg from '../assets/logo.svg';
import logo2 from '../assets/logo2.png';
import title from '../assets/title.png';

import { Link, useNavigate, NavLink } from 'react-router-dom';
import { auth } from '../services/firebase';

const FullPageHeader = () => {
    const activeStyle = {
        color: '#6392ff',
    };

    return (
        <HeaderWrapper>
            <HeaderItemWrapper>
                <TitleWrapper
                    onClick={() => {
                        window.location.href = '/';
                    }}
                >
                    <LogoSvgWrapper src={logo2} alt='logo' />

                    <Title>Study Mentor</Title>
                </TitleWrapper>

                <FileUploadLink
                    to='/'
                    activeClassName='activeLink'
                    style={({ isActive }) => (isActive ? activeStyle : {})}
                >
                    파일 업로드
                </FileUploadLink>
                <ChatbotLink
                    to='/chatbot'
                    activeClassName='activeLink'
                    style={({ isActive }) => (isActive ? activeStyle : {})}
                >
                    챗봇
                </ChatbotLink>
            </HeaderItemWrapper>
            <Logout
                onClick={() => {
                    auth.signOut();
                    // auth.logout();
                }}
            >
                로그아웃
            </Logout>
        </HeaderWrapper>
    );
};

export default FullPageHeader;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-bottom: 50px;
`;

const LogoSvgWrapper = styled.img`
    width: 60px;
`;

const HeaderItemWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 50px;
`;

const HeaderWrapper = styled.div`
    width: 100vw;
    z-index: 100;
    position: fixed;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;

    height: 80px;
    border-bottom: 1px solid #e0e0e0;

    padding-right: 30px;
    background-color: white;
`;

const Logo = styled.div`
    margin-left: 45px;
    cursor: pointer;
`;

const LogoImage = styled.img`
    width: 230px;
    height: 50px;
`;
const TitleWrapper = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    margin-left: 45px;

    cursor: pointer;
`;

const Title = styled.div`
    color: #fd9f28;

    text-align: center;
    font-family: 'Passion One';
    font-size: 40px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
`;

const FileUploadLink = styled(NavLink)`
    margin-left: 125px;
    font-size: 24px;
    color: black;
    text-decoration: none;
    font-family: 'Red Hat Text';
    font-weight: 600;
`;

const ChatbotLink = styled(NavLink)`
    /* margin-left: 42px; */
    font-size: 24px;
    text-decoration: none;
    color: black;
    font-family: 'Red Hat Text';
    font-weight: 600;
`;

const Logout = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 42px;
    font-size: 24px;
    text-decoration: none;
    color: black;
    cursor: pointer;
    font-family: 'Red Hat Text';
    font-weight: 600;
`;
