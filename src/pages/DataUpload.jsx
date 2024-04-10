import React, { useEffect } from 'react';
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
import SwitchWithText from '../components/SwitchWithText';

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
                <DescriptionWrapper>
                    <UploadInfoContainer>
                        <h1>시험 문제 생성 설정</h1>
                        <SettingWrapper>
                            <SwitchWrapper>
                                객관식
                                <Switch defaultChecked />
                            </SwitchWrapper>
                            <SwitchWrapper>
                                주관식
                                <Switch defaultChecked />
                            </SwitchWrapper>
                            <SwitchWrapper>
                                서술형
                                <Switch defaultChecked />
                            </SwitchWrapper>
                            <SwitchWrapper>
                                <SwitchWithText defaultChecked />
                            </SwitchWrapper>
                        </SettingWrapper>
                    </UploadInfoContainer>
                </DescriptionWrapper>
                <PDFUpload />
                <ProgressViewer />
            </MainWrapper>
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

    height: calc(100vh - 80px);
    align-items: center;
`;

const DescriptionWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 24px;
    margin-bottom: 40px;
`;

const UploadInfoContainer = styled.div`
    width: 698px;
    height: 200px;
    border-radius: 20px;
    border: 0.5px solid gray;
    padding: 20px;
`;

const SettingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
    justify-content: center;
    align-items: center;
`;

const SwitchWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
`;
