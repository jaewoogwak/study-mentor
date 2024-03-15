import React from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import FullPageScroll from '../components/FullPageScroll';
import FullPageHeader from '../components/FullPageHeader';

const MainPage = () => {
    return (
        <Wrapper>
            <FullPageHeader />
            <FullPageScroll />
        </Wrapper>
    );
};

export default MainPage;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`;
