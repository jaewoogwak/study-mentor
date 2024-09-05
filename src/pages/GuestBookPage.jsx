import { useContext, useEffect, useState } from 'react';
import Header from '../components/Header'; 
import InfoFooter from '../components/InfoFooter'
import WriteGuestBook from '../components/WriteGuestBook';
import ReadGuestBook from '../components/ReadGuestBook';

import styled from 'styled-components';

const CheckListPage = () => {

    return (
        <Wrapper>
            <Header />
            <InfoContainer>
                <InfoBox>
                    <h2>🌏 방명록</h2>
                    <TextCustom>하고 싶은 이야기를 마음껏 남겨보세요! <br />※ 내용에 따라 검열의 대상이 될 수도 있습니다.</TextCustom>          
                </InfoBox>
            </InfoContainer>
            <WriteContainer>
                <WriteGuestBook />
            </WriteContainer>
            <DivisionLine />
            <ReadContainer>
                <ReadGuestBook />
            </ReadContainer>
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
    width: 750px;
    padding: 30px;
    background: #FFE4FA;
    border-radius: 12px;
`; 

const TextCustom = styled.p`
    font-size: 18px;
    margin-top: 10px;
`;

const WriteContainer = styled.div`
    display: flex;
    justify-content: center;       
`;

const DivisionLine = styled.div`
  border-top: 2px dashed #444444;
  margin: 40px auto;
  width: 400px;
  height: 0px;
  
  &:after {
    content: "◆";
    position: relative;
    top: -9px;
    left: calc(50%, 7px);
  }
`;

const ReadContainer = styled.div`
    display: flex;
    justify-content: center;       
`;