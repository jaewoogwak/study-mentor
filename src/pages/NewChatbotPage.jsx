import { useContext, useEffect, useState } from 'react';
// import './NewChatbotPage.css';
import {
    addDoc,
    collection,
    doc,
    getDocs,
    updateDoc,
} from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { v4 as uuidv4 } from 'uuid'; // ES Modules

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

const API_KEY = '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';

// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = {
    //  Explain things like you're talking to a software professional with 5 years of experience.
    role: 'system',
    content:
        "Explain things like you're talking to a software professional with 2 years of experience.",
};

const NewChatbotPage = () => {
    const [messages, setMessages] = useState([
        {
            message: '안녕하세요! 어떤 문제가 궁금하신가요?',
            sentTime: 'just now',
            sender: 'ChatGPT',
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [chats, setChats] = useState([]);
    const [chatId, setChatId] = useState('');
    const { user, login, logout } = useAuth();

    const handleSend = async (message) => {
        const newMessage = {
            message,
            direction: 'outgoing',
            sender: 'user',
        };

        const newMessages = [...messages, newMessage];

        // 유저의 메시지를 firestore 채팅 db에 추가
        // const ref = doc(db, 'chats', chatId);
        // console.log('ref', ref);
        // await updateDoc(ref, {
        //     messages: newMessages,
        //     sender: 'user',
        //     direction: 'outgoing',
        // });

        // Initial system message to determine ChatGPT functionality
        // How it responds, how it talks, etc.
        setIsTyping(true);
        await processMessageToChatGPT(newMessages);
    };

    async function processMessageToChatGPT(chatMessages) {
        let apiMessages = chatMessages.map((messageObject) => {
            let role = '';
            if (messageObject.sender === 'ChatGPT') {
                role = 'assistant';
            } else {
                role = 'user';
            }
            return { role: role, content: messageObject.message };
        });

        // Add the user's message to Firestore
        // await addChatToFirestore(apiMessages);

        const apiRequestBody = {
            model: 'gpt-3.5-turbo',
            messages: [
                systemMessage, // The system message DEFINES the logic of our chatGPT
                ...apiMessages, // The messages from our chat with ChatGPT
            ],
        };

        await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiRequestBody),
        })
            .then((data) => {
                return data.json();
            })
            .then(async (data) => {
                console.log('datadaaaa', data);
                setMessages([
                    ...chatMessages,
                    {
                        message: data.choices[0].message.content,
                        sender: 'ChatGPT',
                    },
                ]);
                setIsTyping(false);

                // Add ChatGPT's message to Firestore
                // await addChatToFirestore(data.choices[0].message.content);
            });
    }

    async function addChatToFirestore(message) {
        console.log('Adding chat to firestore');

        // const docRef = await addDoc(collection(db, 'chats'), message);
        // const washingtonRef = doc(db, 'chat', );

        const ref = doc(db, 'chats', chatId);
        console.log('ref', ref);
        await updateDoc(ref, {
            messages: message,
            sender: 'ChatGPT',
        });

        console.log('Document written with ID: ', docRef.id);
    }

    async function getChatsFromFirestore() {
        const querySnapshot = await getDocs(collection(db, 'chats'));
        console.log('getChatsFromFirestore:');

        querySnapshot.forEach((doc) => {
            console.log(`${doc.id}`, doc.data());
            // user_id가 현재 로그인한 유저의 id와 같은 경우에만 chat을 가져옴

            if (doc.data().user_id === user.uid) {
                setMessages(doc.data().messages);
                setChatId(doc.id);
            }
        });
    }
    // firebase chats collection에 채팅내역이 없는지 확인
    const checkChats = async () => {
        const querySnapshot = await getDocs(collection(db, 'userChats'));
        // querySnampshot의 데이터를 Array.some으로 확인해야함
        // querySnampShot은 array가 아니라서 Array.prototype.some을 사용할 수 없음

        const arr = querySnapshot.docs.map((doc) => doc.data());

        // arr에 user_id가 현재 로그인한 유저의 id와 같은 데이터가 있는지 확인
        const result = arr.some((data) => data.user_id === user.uid);
        return result;
    };

    // 채팅내역이 없을 때 초기 채팅내역을 firestore에 저장
    const initialChat = async () => {
        const chat = {
            user_id: user.uid,
            messages: [
                {
                    message: '안녕하세요! 어떤 문제가 궁금하신가요?',
                    sentTime: 'just now',
                    sender: 'ChatGPT',
                },
            ],
        };

        // firestore에 채팅을 추가하기 전에 채팅 내역이 있는지 확인
        const hasChats = await checkChats();
        console.log('hasChats: ', hasChats);

        if (!hasChats) {
            const docRef = await addDoc(collection(db, 'chats'), chat);
            console.log('Document written with ID: ', docRef.id);

            const userChat = {
                user_id: user.uid,
            };

            const userChatRef = await addDoc(
                collection(db, 'userChats'),
                userChat
            );
            console.log('Document written with ID: ', userChatRef.id);
        }
    };

    useEffect(() => {
        auth.onAuthStateChanged((usr) => {
            login(usr);

            if (!usr) {
                navigate('/login');
            }
        });

        // // user 정보가 있을 때만 초기 채팅을 저장하거나 가져옴
        // if (user) {
        //     checkChats().then((result) => {
        //         if (result) {
        //             getChatsFromFirestore();
        //         } else {
        //             initialChat();
        //         }
        //     });
        // }
    }, [user]);

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

const Header = styled.header`
    display: flex;
    /* justify-content: center; */
    align-items: center;
    height: 80px;
    border-bottom: 1px solid #aecfff;
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
