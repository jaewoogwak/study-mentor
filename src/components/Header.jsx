import React from 'react';
import styled from 'styled-components';
import LogoSvg from '../assets/logo.svg';
import title from '../assets/title.png';

import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';

const Header = () => {
    return (
        <HeaderWrapper>
            <HeaderItemWrapper>
                <Logo
                    onClick={() => {
                        window.location.href = '/';
                    }}
                >
                    <LogoImage src={title} alt='logo' />
                </Logo>

                <FileUploadLink to='/'>파일 업로드</FileUploadLink>
                <ChatbotLink to='/chatbot'>챗봇</ChatbotLink>
            </HeaderItemWrapper>
            <Logout
                onClick={() => {
                    auth.signOut();
                    logout();
                }}
            >
                logout
            </Logout>
        </HeaderWrapper>
    );
};

export default Header;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-bottom: 50px;
`;

const HeaderItemWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 50px;
`;

const HeaderWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;

    height: 80px;
    border-bottom: 1px solid #aecfff;

    padding-right: 30px;
`;

const Logo = styled.div`
    margin-left: 45px;
    cursor: pointer;
`;

const LogoImage = styled.img`
    width: 230px;
    height: 50px;
`;

const FileUploadLink = styled(Link)`
    margin-left: 125px;
    font-size: 24px;
    color: #ab41ff;
    text-decoration: none;
`;

const ChatbotLink = styled(Link)`
    /* margin-left: 42px; */
    font-size: 24px;
    text-decoration: none;
    color: black;
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
`;
