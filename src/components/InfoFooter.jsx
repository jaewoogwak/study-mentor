import React from 'react';
import styled from 'styled-components';

const InfoFooter = () => {
    return (
        <BoxContainer>
            <FooterInfo>
                <FooterContent>
                    © 2024 Graduation Work Project In KoreaTech. All rights reserved.
                    <br /> Members: JaeWoo Gwak, KunWoo Kim, JunGon Kim, AHyeon Yoon, KyeongHo Kim
                </FooterContent>
                <FooterContent>
                    Contact Us: <a href="mailto:info@company.com">studymentor@koreatech.ac.kr</a>
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
    background: rgba(238, 238, 238, 0.3);
    width: 100%; 
    box-sizing: border-box; 
    margin-top: 70px;

    @media (max-width: 768px) { /* Adjust this breakpoint as needed */
        padding: 10px;
        margin-top: 50px;
    }
`;

const FooterInfo = styled.div`
    text-align: right; 
`;

const FooterContent = styled.h3`
    font-size: 13px;
    margin: 5px 0; /* 상하 마진 조정 */

    @media (max-width: 768px) {
        font-size: 8px; /* Adjust font size on smaller screens */
        margin: 3px 0; /* Adjust margin on smaller screens */
    }
`;
