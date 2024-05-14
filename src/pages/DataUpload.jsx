// usestate : 상태 업데이트
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import Info1Svg from '../assets/info1.svg';
import Info2Svg from '../assets/info2.svg';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
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

    console.log('#######data', data);

    console.log('env', import.meta.env.VITE_API_URL);

    useEffect(() => {
        auth.onAuthStateChanged((usr) => {
            login(usr);

            if (!usr) {
                navigate('/login');
            }
        });

        // 로컬 스토리지에서 데이터 가져오기
        const localData = localStorage.getItem('examData');
        if (localData) {
            setData(JSON.parse(localData));
        }

        console.log('[user info]: ', user);
        console.log('data', data);
        console.log(
            'multipleChoice',
            multipleChoice,
            'shortAnswer',
            shortAnswer,
            'essay',
            essay,
            'examNumber',
            examNumber,
            'isLectureOnly',
            isLectureOnly
        );
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

                {/*
                    데이터가 없으면 PDF 업로드 컴포넌트를 보여줍니다.
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
                    />
                )}
                {/* <ProgressViewer /> */}
                <CreateExam data={data} setData={setData} />
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
