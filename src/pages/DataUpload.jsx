import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

import LogoImg from '../assets/datauploadlogo.png';

import PDFUpload from '../components/PDFUpload';
import Header from '../components/Header';
import CreateExam from '../components/CreateExam';
import ExamSetting from '../components/ExamSetting';
import InfoFooter from '../components/InfoFooter';

import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';

const DataUpload = () => {
    const navigate = useNavigate();
    const { user, logout, login } = useAuth();
    const [data, setData] = useState(null);
    const [multipleChoice, setMultipleChoice] = useState(2);
    const [shortAnswer, setShortAnswer] = useState(2);
    const [essay, setEssay] = useState(2);
    const [examNumber, setExamNumber] = useState(2);
    const [prompt, setPrompt] = useState('');
    const [imagePrompt, setImagePrompt] = useState('');
    const [isTextCentered, setIsTextCentered] = useState(false);
    const [isLectureOnly, setIsLectureOnly] = useState(0);
    const [userCredit, setUserCredit] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(0);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const deductCredit = async () => {
        const currentUser = user.email;
        let creditDocId = '';
        let currentCredit = 0;

        const creditSnapshot = await getDocs(collection(db, 'credits'));
        creditSnapshot.forEach((doc) => {
            if (doc.data().email === currentUser) {
                creditDocId = doc.id;
                currentCredit = doc.data().credit;
            }
        });

        if (creditDocId) {
            const newCredit = currentCredit - 1;
            await updateDoc(doc(db, 'credits', creditDocId), {
                credit: newCredit,
            });
            setUserCredit(newCredit);
        } else {
            console.error('User not found in credits collection');
        }
    };

    useEffect(() => {
        auth.onAuthStateChanged((usr) => {
            login(usr);
            if (!usr) {
                navigate('/login');
            }
        });

        const findCreditsId = async () => {
            const currentUser = user.email;
            const credits = [];
            const creditSnapshot = await getDocs(collection(db, 'credits'));
            creditSnapshot.forEach((doc) => {
                if (doc.data().email === currentUser) {
                    credits.push(doc.data()?.credit);
                }
            });
            return credits[0];
        };

        if (user) {
            findCreditsId().then((res) => {
                setUserCredit(res);
            });
        }

        const localData = localStorage.getItem('examData');
        if (localData) {
            setData(JSON.parse(localData));
        }
    }, [user, multipleChoice, shortAnswer, essay, examNumber, isLectureOnly]);

    return (
        <Wrapper>
            <Header />
            <MainWrapper>
                <CreditWrapper>무료 사용 가능 횟수: {userCredit}</CreditWrapper>

                <DescriptionWrapper>
                    <InfoImg src={LogoImg} alt='LogoImg' />
                    <InfoText>
                        학습자료를 업로드하여 시험문제를 생성하세요!
                    </InfoText>
                </DescriptionWrapper>

                <SettingButton onClick={openModal}>시험 설정하기</SettingButton>
                <ExamSetting
                    prompt={prompt}
                    setPrompt={setPrompt}
                    imagePrompt={imagePrompt}
                    setImagePrompt={setImagePrompt}
                    multipleChoice={multipleChoice}
                    setMultipleChoice={setMultipleChoice}
                    shortAnswer={shortAnswer}
                    setShortAnswer={setShortAnswer}
                    essay={essay}
                    setEssay={setEssay}
                    examNumber={examNumber}
                    setExamNumber={setExamNumber}
                    isTextCentered={isTextCentered}
                    setIsTextCentered={setIsTextCentered}
                    isLectureOnly={isLectureOnly}
                    setIsLectureOnly={setIsLectureOnly}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />

                <WarningText>수학 문제 생성 과정에서 어려움이 있을 수 있으며, 시험 문제에 일부 오류가 포함될 가능성도 있습니다.</WarningText>


                {!data && (
                    <PDFUpload
                        examData={data}
                        setExamData={setData}
                        multipleChoice={multipleChoice}
                        setMultipleChoice={setMultipleChoice}
                        shortAnswer={shortAnswer}
                        setShortAnswer={setShortAnswer}
                        essay={essay}
                        setEssay={setEssay}
                        examNumber={examNumber}
                        setExamNumber={setExamNumber}
                        prompt={prompt}
                        imagePrompt={imagePrompt}
                        isTextCentered={isTextCentered}
                        setIsTextCentered={setIsTextCentered}
                        isLectureOnly={isLectureOnly}
                        setIsLectureOnly={setIsLectureOnly}
                        deductCredit={deductCredit}
                    />
                )}

                <CreateExam
                    data={data}
                    setData={setData}
                    credits={userCredit}
                />
            </MainWrapper>
            <InfoFooter />
        </Wrapper>
    );
};

export default DataUpload;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const MainWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 40px;
    padding-bottom: 20px;
    flex: 1;
    height: calc(100vh - 80px);
    align-items: center;
    margin-top: 30px;

    @media (max-width: 768px) {
        padding-top: 20px;
        padding-bottom: 10px;
        height: auto; /* 모바일에서는 높이를 자동으로 조정 */
    }
`;

const DescriptionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    margin-top: 25px;

    @media (max-width: 768px) {
        gap: 10px;
        margin-bottom: 20px;
    }
`;

const InfoImg = styled.img`
    width: 285px;

    @media (max-width: 768px) {
        width: 100%; /* 모바일에서는 이미지를 가로 크기에 맞춤 */
        max-width: 285px; /* 최대 너비 제한 */
    }
`;

const InfoText = styled.p`
    font-size: 22px;
    text-align: center;

    @media (max-width: 768px) {
        font-size: 18px; /* 모바일에서는 글자 크기 조정 */
        padding: 0 10px; /* 좌우 패딩 추가 */
    }
`;

const CreditWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    color: #333;
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
    text-align: center;

    @media (max-width: 768px) {
        font-size: 14px; /* 모바일에서는 글자 크기 조정 */
        padding: 15px; /* 패딩 조정 */
        margin-bottom: 15px; /* 하단 여백 조정 */
    }
`;

const NoCreditMessage = styled.div`
    font-size: 20px;
    color: #ff0000;
    background-color: #ffe5e5;
    padding: 15px;
    border: 2px solid #ff0000;
    border-radius: 10px;
    margin-top: 20px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
        font-size: 16px; /* 모바일에서는 글자 크기 조정 */
        padding: 10px; /* 패딩 조정 */
        margin-top: 15px; /* 상단 여백 조정 */
    }
`;

const SettingButton = styled.button`
    width: 680px;
    margin: 35px 0 10px 0;
    padding: 10px 20px;

    border-radius: 20px;
    border: 1px;

    font-size: 16px;
    font-family: 'Pretendard-Regular';
    color: white;

    background-color: #3a4ca8;

    &:hover,
    &:active {
        background-color: #5d6dbe;
        color: white;
    }

    @media (max-width: 768px) {
        width: 90%; 
        max-width: 680px;
    }
`;

const WarningText = styled.p`
    font-size: 13px;
    margin: 12px 0px;
    color: #9e9e9e;

    @media (max-width: 768px) {
        font-size: 9px; 
    }
`;
