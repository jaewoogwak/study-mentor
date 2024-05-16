import React from 'react';
import styled from 'styled-components';

const InfoFooter = () => {
    return (
        <BoxContainer>
            <FooterInfo>
                <FooterContent>
                    © 2024 Graduation Work Project In KoreaTech. All rights reserved.
                    <br />Members
                </FooterContent>
                <FooterContent>
                    Contact Us: <a href="mailto:info@company.com">info@company.com</a>
                </FooterContent>
            </FooterInfo>
        </BoxContainer>
    );
};

export default InfoFooter;

const BoxContainer = styled.div`
    display: flex;
    justify-content: right; 
    align-items: center;
    padding: 25px;
    background: #f0f0f0; 
    width: 100%; 
    box-sizing: border-box; 
    margin-top: 70px;
`;

const FooterInfo = styled.div`
    text-align: right; 
`;

const FooterContent = styled.h3`
    font-size: 13px;
    margin: 5px 0; /* 상하 마진 조정 */
`;
