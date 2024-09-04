import { useContext, useEffect, useState } from 'react';
import Header from '../components/Header'; 
import InfoFooter from '../components/InfoFooter'

import styled from 'styled-components';

const CheckListPage = () => {

    return (
        <Wrapper>
            <Header />
            <InfoFooter />
        </Wrapper>
    );
}

export default CheckListPage;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`;
