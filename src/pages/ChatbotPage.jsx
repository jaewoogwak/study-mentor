import { useContext, useEffect, useState } from 'react';
// import './NewChatbotPage.css';

import { auth, db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import { Link } from 'react-router-dom';
import Info1Svg from '../assets/info1.svg';
import Info2Svg from '../assets/info2.svg';
import LogoSvg from '../assets/logo.svg';

import styled from 'styled-components';
import SearchBar from '../components/SearchBar';

import '../styles/ChatBotCustom.css';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import { set } from 'firebase/database';
import Header from '../components/Header';

const API_KEY = import.meta.env.VITE_APP_API_KEY;

const NewChatbotPage = () => {
    const [messages, setMessages] = useState([
        {
            message: '안녕하세요! 어떤 문제가 궁금하신가요?',
            sentTime: 'just now',
            sender: 'ChatGPT',
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const { user, login, logout } = useAuth();

    const handleSend = async (message) => {
        const newMessage = {
            message,
            direction: 'outgoing',
            sender: 'user',
        };

        setMessages([...messages, newMessage]);

        setIsTyping(true);
        // await processMessageToChatGPT(newMessages);
        await sendTextToServer(message);
    };

    async function sendTextToServer(text) {
        const address = `${
            import.meta.env.VITE_APP_API_URL
        }/chatbot/question-answer`;

        console.log('address', address, import.meta.env.VITE_APP_API_URL);
        await fetch(address, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: text,
            }),
        })
            .then((response) => response.json())
            .then(async (data) => {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        message: data.answer,
                        sender: 'ChatGPT',
                    },
                ]);

                await getMessages();

                setIsTyping(false);
            })
            .catch((error) => console.error('Error:', error));
    }

    const getMessages = async () => {
        // 존재하는 유저 가져오기
        const users = [];
        const querySnapshot = await getDocs(collection(db, 'users'));
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            users.push(doc.data().email);
        });

        // 현재 로그인한 유저 가져오기
        const currentUser = user.email;

        // 유저의 메시지 가져오기
        const messages = [];
        const messageSnapshot = await getDocs(collection(db, 'messages'));
        messageSnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data().email}`);

            if (doc.data().email === currentUser) {
                messages.push(doc.data().messages);
            }

            console.log('messages', messages);
        });
    };

    useEffect(() => {
        auth.onAuthStateChanged((usr) => {
            login(usr);

            if (!usr) {
                navigate('/login');
            }
        });

        console.log('messages', messages);
    }, [user, messages]);

    return (
        <Wrapper>
            <Header />
            <Main>
                {messages.length === 1 ? (
                    <ChatListWraper>
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
                        <SearchBar
                            placeholder={'챗봇에게 물어볼 질문을 작성해주세요'}
                            onSend={handleSend}
                        />
                    </ChatListWraper>
                ) : (
                    <Container>
                        <MainContainerWrapper>
                            <ChatContainer>
                                <MessageList
                                    scrollBehavior='smooth'
                                    typingIndicator={
                                        isTyping ? (
                                            <TypingIndicator content='ChatGPT is typing' />
                                        ) : null
                                    }
                                >
                                    {messages.map((message, i) => {
                                        console.log(message);
                                        return (
                                            <Message key={i} model={message} />
                                        );
                                    })}
                                </MessageList>
                            </ChatContainer>
                        </MainContainerWrapper>
                        <SearchBar
                            placeholder={'챗봇에게 물어볼 질문을 작성해주세요'}
                            onSend={handleSend}
                        />
                    </Container>
                )}
            </Main>
        </Wrapper>
    );
};

const Test = styled.div``;

export default NewChatbotPage;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
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

const MainWrapper = styled.div`
    display: flex;
    flex-direction: row;
    height: calc(100vh - 74px);
`;

const Main = styled.main`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0 auto;
    height: calc(100vh - 74px);
`;

const ChatListWraper = styled.div`
    display: flex;
    flex-direction: column;
`;

const InfoList = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    gap: 20px;
    margin-top: 30px;
    margin-bottom: 40px;
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

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
`;

const MainContainerWrapper = styled(MainContainer)`
    width: 700px;
    // 높이는 화면에 따라 조절해야함. 바닥에서 20px 떨어지게 하기
    height: 75vh;
    margin: 0 auto;
    border: none;
`;
