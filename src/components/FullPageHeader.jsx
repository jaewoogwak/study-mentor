import React, { useState } from 'react';
import styled from 'styled-components';
import logo2 from '../assets/logo2.png';
import { NavLink } from 'react-router-dom';
import { auth } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

const FullPageHeader = () => {
    const [isOpen, setIsOpen] = useState(false);

    const activeStyle = {
        color: '#6392ff',
    };

    const { user, login, logout } = useAuth();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <HeaderWrapper>
            <TitleWrapper onClick={() => (window.location.href = '/')}>
                <LogoSvgWrapper src={logo2} alt='logo' />
                <Title>Study Mentor</Title>
            </TitleWrapper>

            <MenuIcon onClick={toggleMenu}>
                <div />
                <div />
                <div />
            </MenuIcon>

            <NavLinks isOpen={isOpen}>
                <FileUploadLink
                    to='/upload'
                    activeClassName='activeLink'
                    style={({ isActive }) => (isActive ? activeStyle : {})}
                    onClick={toggleMenu}
                >
                    파일 업로드
                </FileUploadLink>
                <ChatbotLink
                    to='/chatbot'
                    activeClassName='activeLink'
                    style={({ isActive }) => (isActive ? activeStyle : {})}
                    onClick={toggleMenu}
                >
                    챗봇
                </ChatbotLink>
                <CheckListLink
                    to='/checklist'
                    activeClassName='activeLink'
                    style={({ isActive }) => (isActive ? activeStyle : {})}
                    onClick={toggleMenu}
                >
                    오답목록
                </CheckListLink>
                <Logout
                    onClick={() => {
                        auth.signOut();
                        logout();
                        window.location.href = '/login';
                    }}
                >
                    로그아웃
                </Logout>
            </NavLinks>
        </HeaderWrapper>
    );
};

export default FullPageHeader;

const HeaderWrapper = styled.div`
    width: 100%;
    max-width: 100vw;
    z-index: 100;
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    height: 80px;
    border-bottom: 1px solid #e0e0e0;
    background-color: white;
    box-sizing: border-box;

    @media (max-width: 768px) {
        padding: 0 20px;
    }
`;

const TitleWrapper = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    cursor: pointer;
`;

const LogoSvgWrapper = styled.img`
    width: 60px;
`;

const Title = styled.div`
    color: #fd9f28;
    font-size: 40px;
    font-weight: 900;
    line-height: normal;

    @media (max-width: 768px) {
        font-size: 24px;
    }
`;

const MenuIcon = styled.div`
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 24px;
    height: 24px;
    cursor: pointer;

    div {
        width: 100%;
        height: 3px;
        background-color: black;
    }

    @media (max-width: 768px) {
        display: flex;
    }
`;

const NavLinks = styled.div`
    display: flex;
    gap: 50px;

    @media (max-width: 768px) {
        position: absolute;
        top: 80px;
        left: 0;
        width: 100%;
        max-width: 100vw;
        background-color: white;
        flex-direction: column;
        gap: 20px;
        align-items: center;
        padding: 20px 0;
        display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
        border-top: 1px solid #e0e0e0;
        box-sizing: border-box;
    }
`;

const FileUploadLink = styled(NavLink)`
    font-size: 24px;
    color: black;
    text-decoration: none;
    font-weight: 600;

    &:hover {
        color: #6392ff;
    }

    @media (max-width: 768px) {
        font-size: 18px;
    }
`;

const ChatbotLink = styled(NavLink)`
    font-size: 24px;
    text-decoration: none;
    color: black;
    font-weight: 600;

    &:hover {
        color: #6392ff;
    }

    @media (max-width: 768px) {
        font-size: 18px;
    }
`;

const CheckListLink = styled(NavLink)`
    font-size: 24px;
    text-decoration: none;
    color: black;
    font-weight: 600;

    &:hover {
        color: #6392ff;
    }

    @media (max-width: 768px) {
        font-size: 18px;
    }
`;

const Logout = styled.div`
    font-size: 24px;
    color: black;
    cursor: pointer;
    font-weight: 600;

    @media (max-width: 768px) {
        font-size: 18px;
    }
`;
