import { useContext, useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc,
    getDoc,
} from 'firebase/firestore';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SearchBar from '../components/SearchBar';
import '../styles/ChatBotCustom.css';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import InfoFooter from '../components/InfoFooter';
import { useChatStore } from '../contexts/store';
import ChatMentor from '../assets/chat_mentor.png';

const API_KEY = import.meta.env.VITE_API_KEY;

const NewChatbotPage = () => {
    const {
        messages,
        setMessages,
        isTyping,
        setIsTyping,
        setQuestionData,
        questionData,
    } = useChatStore();
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();

    const handleSend = async (message) => {
        const newMessage = {
            message: message,
            direction: 'outgoing',
            sender: 'user',
        };

        setMessages([...messages, newMessage]);

        setIsTyping(true);

        await sendTextToServer(message);
    };

    const findChatId = async () => {
        const currentUser = user.email;
        const chats = [];
        const messageSnapshot = await getDocs(collection(db, 'chats'));
        messageSnapshot.forEach((doc) => {
            if (doc.data().email === currentUser) {
                chats.push(doc.id);
            }
        });
        return chats[0];
    };

    async function sendTextToServer(text) {
        const address = `${
            import.meta.env.VITE_API_URL
        }/chatbot/question-answer`;

        const token = await user.getIdToken();
        await fetch(address, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: text,
            }),
        })
            .then((response) => response.json())
            .then(async (data) => {
                setMessages([
                    ...messages,
                    {
                        message: text,
                        sender: 'user',
                        direction: 'outgoing',
                    },
                    {
                        message: data.answer,
                        sender: 'ChatGPT',
                    },
                ]);

                const id = await findChatId();
                const currentUserMessage = {
                    message: text,
                    sender: 'user',
                    direction: 'outgoing',
                };

                const chatRef = doc(db, 'chats', id);
                updateDoc(chatRef, {
                    messages: [
                        ...messages,
                        currentUserMessage,
                        {
                            message: data.answer,
                            sender: 'ChatGPT',
                        },
                    ],
                });

                setIsTyping(false);
            })
            .catch((error) => console.error('Error:', error));
    }

    useEffect(() => {
        auth.onAuthStateChanged((usr) => {
            login(usr);

            if (!usr) {
                navigate('/login');
            }
        });

        const getMessages = async () => {
            const currentUserFBId = await findChatId();

            if (!currentUserFBId) {
                const docRef = await addDoc(collection(db, 'chats'), {
                    email: user.email,
                    messages: [
                        {
                            message: '안녕하세요! 어떤 문제가 궁금하신가요?',
                            sentTime: 'just now',
                            sender: 'ChatGPT',
                        },
                    ],
                });
            }

            const chatRef = doc(db, 'chats', currentUserFBId);
            const chatSnapshot = await getDoc(chatRef);

            if (chatSnapshot.exists()) {
                const chatData = chatSnapshot.data();
                const messages = chatData.messages;

                if (questionData) {
                    messages.push({
                        message: questionData,
                        sender: 'user',
                        direction: 'outgoing',
                    });
                    setQuestionData(null);
                }
                setMessages(messages);
            }
        };

        getMessages();
    }, [user, login, navigate, setMessages]);

    return (
        <Wrapper>
            <Header />
            <Main>
                {messages.length === 1 ? (
                    <ChatListWraper>
                        <InfoWrapper>
                            <ChatWrapper>
                                <MainImg src={ChatMentor} alt='chatmentor' />
                                <TextContainer>
                                    <MainText>Chatting with a Mentor</MainText>
                                    <p style={{ fontSize: '17px' }}>
                                        모르는 것에 대해 자유롭게 질문해보세요.
                                    </p>
                                </TextContainer>
                            </ChatWrapper>
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
                            </QuestionList>
                        </InfoWrapper>
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
            <InfoFooter />
        </Wrapper>
    );
};

export default NewChatbotPage;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
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

const InfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 500px;

    @media (max-width: 768px) {
        padding: 20px;
        height: auto; /* 모바일에서는 높이 자동 조정 */
    }
`;

const ChatWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 30px;
    margin-top: 140px;
    margin-bottom: 30px;

    @media (max-width: 768px) {
        flex-direction: column; /* 모바일에서는 수직 정렬 */
        margin-top: 20px;
        margin-bottom: 20px;
        gap: 10px; /* 간격 조정 */
    }
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: center; /* 모바일에서 텍스트 중앙 정렬 */

    @media (max-width: 768px) {
        gap: 5px; /* 모바일에서는 간격 조정 */
    }
`;

const MainImg = styled.img`
    width: 90px;
    height: 90px;

    @media (max-width: 768px) {
        width: 70px;
        height: 70px; /* 모바일에서는 이미지 크기 조정 */
    }
`;

const MainText = styled.h2`
    font-size: 35px;

    @media (max-width: 768px) {
        font-size: 24px; /* 모바일에서는 폰트 크기 조정 */
    }
`;

const InfoText = styled.div`
    font-size: 18px;
    font-weight: 500;
    line-height: 30px;
    text-align: center;

    @media (max-width: 768px) {
        font-size: 16px; /* 모바일에서는 폰트 크기 조정 */
        line-height: 24px; /* 모바일에서 줄 간격 조정 */
        padding: 10px;
    }
`;

const QuestionList = styled.div`
    display: flex;
    gap: 17px;
    margin-top: 140px;

    @media (max-width: 768px) {
        flex-direction: column; /* 모바일에서는 수직 정렬 */
        margin-top: 20px;
        gap: 10px; /* 간격 조정 */
    }
`;

const ImageTypeWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 320px;
    height: 85px;
    background-color: #f0f8ff;
    border-radius: 10px;

    @media (max-width: 768px) {
        width: 100%; /* 모바일에서는 너비 100% */
        height: 60px; /* 모바일에서는 높이 조정 */
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    padding-top: 20px;
    padding-bottom: 20px;

    @media (max-width: 768px) {
        gap: 10px; /* 모바일에서는 간격 조정 */
        padding-top: 10px; /* 상단 패딩 조정 */
        padding-bottom: 10px; /* 하단 패딩 조정 */
    }
`;

const MainContainerWrapper = styled(MainContainer)`
    width: 700px;
    height: 70vh;
    margin: 0 auto;
    border: none;

    @media (max-width: 768px) {
        width: 100%; /* 모바일에서는 너비 100% */
        height: 60vh; /* 모바일에서는 높이 조정 */
    }
`;
