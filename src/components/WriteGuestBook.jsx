import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const WriteGuestBook = () => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [nameOption, setNameOption] = useState(''); 
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const displayName = nameOption === 'anonymous' ? '익명' : name;
        if (message) {
            const newEntry = {
                name: displayName,
                message,
                timestamp: new Date()
            };
            
            try {
                await addDoc(collection(db, 'guestbook'), newEntry); // 'guestbook' 컬렉션에 문서 추가
                setName(''); 
                setMessage('');
                setNameOption('anonymous');
                setSubmitSuccess(true);
                setSubmitError(null);
                window.location.reload(); 
            } catch (error) {
                console.error('문서 추가 오류:', error);
                setSubmitError('방명록 저장에 실패하였습니다.');
                setSubmitSuccess(false);
            }
        }
    };

    useEffect(() => {
        if (submitSuccess) {
            alert('방명록이 성공적으로 저장되었습니다.');
            window.location.reload(); // 페이지 새로 고침
        }
    }, [submitSuccess]);

    return (
        <Wrapper>
            <BookContainer onSubmit={handleSubmit}>
                <h2 style={{margin: "20px 0px 30px 0px"}}>👣 방명록 작성하기</h2>
                <NameContainer>
                    <CustomText>표시될 이름을 정해주세요.</CustomText>
                    <Namelabel>
                        <input
                            type="radio"
                            value="anonymous"
                            checked={nameOption === 'anonymous'}
                            onChange={() => setNameOption('anonymous')}
                        />
                        익명
                    </Namelabel>
                    <Namelabel>
                        <input
                            type="radio"
                            value="nickname"
                            checked={nameOption === 'nickname'}
                            onChange={() => setNameOption('nickname')}
                        />
                        별칭
                    </Namelabel>
                </NameContainer>

                {nameOption === 'nickname' && (
                    <>
                        <CustomText>별칭을 입력해주세요. (5글자 이내)</CustomText>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                width: "120px",
                                padding: "5px",
                                fontSize: "18px",
                                fontFamily: "GmarketSansMedium",
                                textAlign: "center",
                            }}
                            minLength={1}
                            maxLength={5}
                        />
                    </>
                )}

                <TextContainer>
                    <CustomText>하고 싶은 말을 남겨주세요. (최소 10, 최대 200글자)</CustomText>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{
                            width: "700px",
                            height: "200px",
                            fontSize: "16px",
                            fontFamily: "GmarketSansMedium",
                            padding: "20px"
                        }}
                        maxLength={200}
                        minLength={10}
                    />
                </TextContainer>
                
                <WarningMessage>저장 후 삭제는 불가합니다.</WarningMessage>
                <SubmitButton>남기기</SubmitButton>
            </BookContainer>
        </Wrapper>
    );
};

export default WriteGuestBook;

const Wrapper = styled.div`
    padding: 10px 35px;
    background-color: #B8E9FF;
    border-radius: 10px;
`;

const BookContainer = styled.form`
`;

const NameContainer = styled.div`
    flex-direction: row;
`;

const CustomText = styled.p`
    font-size: 20px;
    margin: 20px 0px;
`;

const Namelabel = styled.label`
    font-size: 20px;
    font-family: "Pretendard-Regular";
    margin: 30px;
`

const TextContainer = styled.div`
    margin: 30px 0px;
`;

const WarningMessage = styled.p`
    font-size: 15px;
    margin-top: 20px;
    color: #D94925;
`;

const SubmitButton = styled.button`
    font-family: 'Pretendard-Regular';
    padding: 10px 25px;
    border: none;
    border-radius: 4px;
    background-color: #18A8F1;
    color: white;
    cursor: pointer;
    font-size: 16px;  
    margin: 15px 0px;
    &:hover {
        background-color: #1187CF;
    }
`;
