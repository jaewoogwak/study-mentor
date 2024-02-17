import React from 'react';
import styled from 'styled-components';
import ImageUpload from '../components/ImageUpload';
import LogoSvg from '../assets/logo.svg';
import Info1Svg from '../assets/info1.svg';
import Info2Svg from '../assets/info2.svg';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import NewChatbotPage from './NewChatbotPage';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const Header = styled.header`
    display: flex;
    /* justify-content: center; */
    align-items: center;
    height: 80px;
    border-bottom: 1px solid #aecfff;
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
    height: calc(100vh - 74px);
`;

const Logo = styled.div`
    margin-left: 45px;
`;
const Title = styled.div`
    margin-left: 17px;
    font-weight: 500;
    font-size: 28px;
    line-height: 18px 18px;
`;

const Main = styled.main`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0 auto;
    height: calc(100vh - 74px);
`;

const InfoList = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 30px;
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
    gap: 17px;
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

const FileUploadLink = styled(Link)`
    margin-left: 125px;
    font-size: 24px;
    color: #ab41ff;
    text-decoration: none;
`;

const ChatbotLink = styled(Link)`
    margin-left: 42px;
    font-size: 24px;
    text-decoration: none;
    color: black;
`;

// 파이썬 플라스크 서버를 aws ec2에 올려서 사용중임
// 해당 주소는 http://13.124.221.128:5000/
// react-query로 해당 주소로 요청을 보내는 코드 작성

const ChatbotPage = () => {
    return (
        <Wrapper>
            <Header>
                <Logo>
                    <img src={LogoSvg} alt='logo' />
                </Logo>
                <Title>스터디 멘토</Title>
                <FileUploadLink to='/'>파일 업로드</FileUploadLink>
                <ChatbotLink to='/chatbot'>챗봇</ChatbotLink>
            </Header>
            <MainWrapper>
                <Main>
                    {/* <ImageUpload /> */}
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
                            <InfoText>이런 방식으로 질문해요</InfoText>
                            <QuestionList>
                                <ImageTypeWrapper>
                                    <InfoText>
                                        Python class의 개념에 대해
                                        <br /> 객관식 문제를 만들어줘
                                    </InfoText>
                                </ImageTypeWrapper>
                                <ImageTypeWrapper>
                                    <InfoText>
                                        내가 입력한 파일에서 <br />
                                        주관식 문제를 만들어줘
                                    </InfoText>
                                </ImageTypeWrapper>
                                <ImageTypeWrapper>
                                    <InfoText>
                                        CNN 모델의 개념에 대한
                                        <br /> 서술형 문제를 만들어줘
                                    </InfoText>
                                </ImageTypeWrapper>
                            </QuestionList>
                        </InfoWrapper>
                    </InfoList>
                    <NewChatbotPage />
                    {/* <SearchBar placeholder='챗봇에게 물어볼 질문을 작성해주세요' /> */}
                </Main>
            </MainWrapper>
        </Wrapper>
    );
};

export default ChatbotPage;
