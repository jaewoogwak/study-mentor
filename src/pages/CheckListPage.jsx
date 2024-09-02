import { useContext, useEffect, useState } from 'react';
import Header from '../components/Header'; 
import CheckList from '../components/CheckList'
import InfoFooter from '../components/InfoFooter'

import styled from 'styled-components';

const CheckListPage = () => {

    return (
        <Wrapper>
            <Header />
                <InfoContainer>
                    <InfoBox>
                        <h3>🔶 이 페이지는 앞서 풀어본 문제에 대한 목록입니다.</h3>
                        <TextCustom>각 시험지에 대해 틀린 부분은 빨간색으로 표시되어 있으니, 다시 한 번 풀어보세요!</TextCustom>          
                    </InfoBox>
                </InfoContainer>
                <ListContainer>
                    {/* <CheckList /> */}
                </ListContainer>
            <InfoFooter />
        </Wrapper>
    );
}

export default CheckListPage;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const InfoContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 30px;
`;

const InfoBox = styled.div` 
    width: 700px;
    // margin: 10px;
    padding: 30px;
    background: #B8E9FF;
    border-radius: 12px;
`; 

const TextCustom = styled.p`
    font-size: 18px;
`;

const ListContainer = styled.div`
    display: flex;
    justify-content: center;
`;