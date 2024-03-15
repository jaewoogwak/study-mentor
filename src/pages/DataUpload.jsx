import React, { useEffect } from 'react';
import styled from 'styled-components';
import Info1Svg from '../assets/info1.svg';
import Info2Svg from '../assets/info2.svg';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import PDFUpload from '../components/PDFUpload';
import Header from '../components/Header';

const DataUpload = () => {
    const navigate = useNavigate();
    const { user, logout, login } = useAuth();

    useEffect(() => {
        auth.onAuthStateChanged((usr) => {
            login(usr);

            if (!usr) {
                navigate('/login');
            }
        });

        console.log('[user info]: ', user);
    }, [user]);

    return (
        <Wrapper>
            <Header />
            <MainWrapper>
                <Main>
                    <InfoList>
                        <InfoWrapper>
                            <InfoBox src={Info1Svg} alt='info1' />
                            <InfoText>이런 문제를 만들 수 있어요</InfoText>
                            <QuestionList>
                                <QuestionWrapper>
                                    <InfoText>객관식 문제</InfoText>
                                </QuestionWrapper>
                                <QuestionWrapper>
                                    <InfoText>주관식 문제</InfoText>
                                </QuestionWrapper>
                                <QuestionWrapper>
                                    <InfoText>서술형 문제</InfoText>
                                </QuestionWrapper>
                            </QuestionList>
                        </InfoWrapper>

                        <InfoWrapper>
                            <InfoBox src={Info2Svg} alt='info2' />
                            <InfoText>이런 파일로 문제를 만들어요</InfoText>
                            <QuestionList>
                                <ImageTypeWrapper>
                                    <InfoText>JPG</InfoText>
                                </ImageTypeWrapper>
                                <ImageTypeWrapper>
                                    <InfoText>PDF</InfoText>
                                </ImageTypeWrapper>
                                <ImageTypeWrapper>
                                    <InfoText>임시1</InfoText>
                                </ImageTypeWrapper>
                            </QuestionList>
                        </InfoWrapper>
                    </InfoList>

                    <PDFUpload />
                </Main>
            </MainWrapper>
        </Wrapper>
    );
};

export default DataUpload;

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

const Sidebar = styled.aside`
    width: 250px;
    height: calc(100vh - 74px);
    border-right: 1px solid #eaeaea;
    background-color: rgb(242, 247, 255);
`;

const MainWrapper = styled.div`
    display: flex;
    flex-direction: row;
    /* height: calc(100vh - 74px); */
    padding-bottom: 20px;
`;

const Logo = styled.div`
    margin-left: 45px;
`;
const Title = styled.div`
    /* margin-left: 17px; */
    font-weight: 500;
    font-size: 28px;
    line-height: 18px 18px;
`;

const Main = styled.main`
    display: flex;
    flex-direction: column;

    margin: 0 auto;
    /* height: calc(100vh - 74px); */
`;

const InfoList = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 30px;
    margin-bottom: 10px;
`;

const InfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 320px;
    height: 461px;
`;

const InfoBox = styled.img`
    width: 47px;
    height: 47px;
    margin-bottom: 15px;
`;

const InfoText = styled.div`
    font-size: 20px;
    font-weight: 500;
    line-height: 32px;
`;

const QuestionList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 30px;
`;

const QuestionWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 320px;
    height: 92px;
    background-color: #fff0f6;
    border-radius: 10px;
`;

const ImageTypeWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 320px;
    height: 92px;
    background-color: #f0f8ff;
    border-radius: 10px;
`;

const SearchBar = styled.div`
    display: flex;
    width: 100%;
    height: 65px;
    border-radius: 15px;
    border: 1px;

    border: 1px solid #eaeaea;
    border-radius: 16px;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;

    font-size: 24px;
    color: #00000057;
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
