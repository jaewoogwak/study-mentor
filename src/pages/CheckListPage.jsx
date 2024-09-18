import { useContext, useEffect, useState } from 'react';
import Header from '../components/Header'; 
import CheckList from '../components/CheckList'
import InfoFooter from '../components/InfoFooter'

import styled from 'styled-components';

const CheckListPage = () => {

    return (
        <>
            <Wrapper>
                <Header />
                <InfoContainer>
                    <InfoBox>
                        <InfoText>📰 오답 목록</InfoText>
                        <TextCustom>문제를 다시 한 번 풀어보며 시험 내용을 복기해보세요. <br /> ※ 채점 기능은 따로 제공하지 않습니다.</TextCustom>      
                    </InfoBox>
                </InfoContainer>
                <MainWrapper>
                    <ListContainer>
                        <CheckList />
                    </ListContainer>
                </MainWrapper>
            </Wrapper>
            <InfoFooter />
        </>
    );
}

export default CheckListPage;


const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;  
    margin: 0 auto;
`;

const MainWrapper = styled.div`
    flex-grow: 1; 
    display: flex;
    flex-direction: column;
    justify-content: center; 
`;

const InfoContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 30px;

    @media (max-width: 768px) {
        margin: 20px;
    }
`;

const InfoBox = styled.div` 
    width: 750px;
    padding: 30px;
    background: #B8E9FF;
    border-radius: 12px;

    @media (max-width: 768px) {
        width: 90%;
        padding: 20px;
    }
`; 

const InfoText = styled.h3`
    font-size: 24px; 

    @media (max-width: 768px) {
        font-size: 18px; 
    }
`;

const TextCustom = styled.p`
    font-size: 18px;
    margin-top: 10px;

    @media (max-width: 768px) {
        font-size: 14px;
        margin-top: 10px;
    }
`;

const ListContainer = styled.div`
    display: flex;
    justify-content: center;
`;