// usestate : 상태 업데이트
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import Info1Svg from '../assets/info1.svg';
import Info2Svg from '../assets/info2.svg';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import PDFUpload from '../components/PDFUpload';
import Header from '../components/Header';
import ExamNumberInput from '../components/ExamNumberInput';
import { Switch } from 'antd';
import ProgressViewer from '../components/ProgressViewer';
import ProgressBar from '../components/progressBar';
import CreateExam from '../components/CreateExam';

import axios from 'axios';
import { usePDF } from 'react-to-pdf';
import PromptInput from '../components/PromptModal';
import PromptModal from '../components/PromptModal';
import PDFGenerateButton from '../components/PDFGenerateButton';
import ExamSetting from '../components/ExamSetting';
import InfoFooter from '../components/InfoFooter';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';

const DataUpload = () => {
    const navigate = useNavigate();
    const { user, logout, login } = useAuth();
    const [data, setData] = useState(null);
    // 객관식 문제
    const [multipleChoice, setMultipleChoice] = useState(2);
    // 주관식 문제
    const [shortAnswer, setShortAnswer] = useState(2);
    // 서술형 문제
    const [essay, setEssay] = useState(2);
    // 문제 수
    const [examNumber, setExamNumber] = useState(2);
    // 문제 생성 방향성 프롬프트
    const [prompt, setPrompt] = useState('');
    // 이미지 중심일 때 제공하는 프롬프트
    const [imagePrompt, setImagePrompt] = useState('');

    // 텍스트 중심인지
    const [isTextCentered, setIsTextCentered] = useState(0);

    // 강의자료에서만 생성 or 외부자료도 참고하여 생성
    const [isLectureOnly, setIsLectureOnly] = useState(0);

    // 유저 업로드 크레딧
    const [userCredit, setUserCredit] = useState(0);

    // 파일 업로드 시 크레딧 1 차감
    const deductCredit = async () => {
        const currentUser = user.email;
        let creditDocId = '';
        let currentCredit = 0;

        // credits 컬렉션에서 현재 사용자의 문서 가져오기
        const creditSnapshot = await getDocs(collection(db, 'credits'));
        creditSnapshot.forEach((doc) => {
            // console.log(`e ${doc.id} => ${doc.data()?.credit}`);

            if (doc.data().email === currentUser) {
                creditDocId = doc.id;
                currentCredit = doc.data().credit;
            }
        });

        // console.log('creditDocId', creditDocId);

        // credits 컬렉션에서 credit 차감
        if (creditDocId) {
            const newCredit = currentCredit - 1;

            await updateDoc(doc(db, 'credits', creditDocId), {
                credit: newCredit,
            });

            setUserCredit(newCredit);

            // console.log('Credit deducted successfully', newCredit);
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

        // 유저 아이디로 firebase DB 'credits' 가져오기
        const findCreditsId = async () => {
            // console.log('user', user.email);
            const currentUser = user.email;
            const credits = [];
            const creditSnapshot = await getDocs(collection(db, 'credits'));
            creditSnapshot.forEach((doc) => {
                console.log(`e ${doc.id} => ${doc.data()?.credit}`);

                if (doc.data().email === currentUser) {
                    credits.push(doc.data()?.credit);
                }
            });
            console.log('credits id ', credits[0]);
            return credits[0];
        };

        if (user) {
            findCreditsId().then((res) => {
                console.log('res', res);
                setUserCredit(res);
            });
        }

        // 로컬 스토리지에서 데이터 가져오기
        const localData = localStorage.getItem('examData');
        if (localData) {
            setData(JSON.parse(localData));
        }
    }, [user, multipleChoice, shortAnswer, essay, examNumber, isLectureOnly]);

    return (
        <Wrapper>
            <Header />

            <MainWrapper>
                <DescriptionWrapper>
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
                    />
                </DescriptionWrapper>
                <CreditWrapper>무료 사용 가능 횟수: {userCredit}</CreditWrapper>

                {/*
                    데이터가 없으면 PDF 업로드 컴포넌트를 보여줍니다.
                 */}
                {/*
                데이터가 있으면, 크레딧이 남아있는지 확인하고 문제 생성 컴포넌트를 보여줍니다.
                */}
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

                {data && userCredit < 1 && (
                    <NoCreditMessage>
                        무료 사용 가능 횟수가 부족합니다.
                    </NoCreditMessage>
                )}
                {/* <ProgressViewer /> */}
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
    /* justify-content: center; */
    flex: 1;
    height: calc(100vh - 80px);
    align-items: center;
`;

const DescriptionWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 24px;
    margin-bottom: 40px;
`;

const GeneratePDFBtn = styled.button`
    width: 50%;
    height: 100%;
    font-size: 24px;
    color: #ab41ff;
    text-decoration: none;
    cursor: pointer;
    border: none;
    background-color: white;
    margin-top: 20px;
    &:hover {
        color: #ff6b6b;
    }
`;

const DownloadBtn = styled.button`
    width: 50%;
    height: 100%;
    font-size: 24px;
    color: #ab41ff;
    text-decoration: none;
    cursor: pointer;
    border: none;
    background-color: white;
    margin-top: 20px;
    &:hover {
        color: #ff6b6b;
    }
`;

const CreditWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; // 추가
    font-size: 16px;
    color: #333; // 텍스트 색상 추가
    background-color: #f9f9f9; // 배경 색상 추가
    padding: 20px; // 패딩 추가
    border-radius: 10px; // 모서리 둥글게
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // 그림자 추가
    margin-bottom: 20px; // 하단 여백 추가
    text-align: center; // 텍스트 중앙 정렬
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
`;
