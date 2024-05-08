import React, { useEffect } from 'react';
import Fullpage, {
    FullPageSections,
    FullpageSection,
} from '@ap.cx/react-fullpage';
import styled from 'styled-components';

import study_two_people from '../assets/study_two_people.png';
import example from '../assets/example.svg';
import question from '../assets/question.svg';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/firebase';

const FullPageScroll = () => {
    return (
        <Wrapper>
            <Fullpage>
                <FullPageSections>
                    <FullpageSection
                        style={{
                            // backgroundColor: 'lime',
                            height: '100vh',
                            padding: '1em',
                        }}
                    >
                        <PageWrapper>
                            <FirstContainer>
                                <Text
                                    fontsize='32px'
                                    style={{ fontWeight: 'bold' }}
                                >
                                    시험 문제는 스터디 멘토와 함께!<br></br>{' '}
                                    방금 공부한 내용을 시험해보세요.
                                </Text>

                                <Image
                                    src={study_two_people}
                                    alt='study'
                                    width='50%'
                                    height='50%'
                                />
                            </FirstContainer>
                        </PageWrapper>
                    </FullpageSection>
                    <FullpageSection
                        style={{
                            backgroundColor: '#FFF9E8',
                            padding: '1em',
                        }}
                    >
                        <SecondContainer>
                            <Image
                                src={example}
                                alt='example'
                                width='611px'
                                height='421px'
                            />
                            <div>
                                <Text
                                    fontsize='40px'
                                    style={{ fontWeight: 'bold' }}
                                >
                                    시험 문제 만들기
                                </Text>
                                <Text
                                    fontsize='30px'
                                    style={{
                                        fontWeight: '300',
                                        marginTop: '39px',
                                    }}
                                >
                                    자신이 학습한 내용이 담긴 이미지 혹은 PDF<br></br>{' '}
                                    파일을 업로드하여 시험 문제를 만들어보세요!
                                </Text>
                                <FileUploadLink
                                    onClick={() => {
                                        window.location.href = '/upload';
                                    }}
                                    style={{
                                        textDecoration: 'none',
                                    }}
                                >
                                    파일 업로드
                                </FileUploadLink>
                            </div>
                        </SecondContainer>
                    </FullpageSection>
                    <FullpageSection
                        style={{
                            // backgroundColor: 'firebrick',
                            padding: '1em',
                        }}
                    >
                        <SecondContainer>
                            <div>
                                <Text
                                    fontsize='40px'
                                    style={{ fontWeight: 'bold' }}
                                >
                                    1:1 질문하기
                                </Text>
                                <Text
                                    fontsize='30px'
                                    style={{
                                        fontWeight: '300',
                                        marginTop: '39px',
                                    }}
                                >
                                    학습한 내용이 헷갈릴 때, <br />
                                    스터디멘토에게 질문할 수 있어요
                                </Text>
                                <FileUploadLink
                                    onClick={() => {
                                        window.location.href = '/chatbot';
                                    }}
                                    style={{
                                        textDecoration: 'none',
                                    }}
                                >
                                    질문하기
                                </FileUploadLink>
                            </div>
                            <Image
                                src={question}
                                alt='example'
                                width='611px'
                                height='421px'
                            />
                        </SecondContainer>
                    </FullpageSection>
                </FullPageSections>
            </Fullpage>
        </Wrapper>
    );
};

export default FullPageScroll;

const Wrapper = styled.div`
    /* display: flex; */

    /* z-index: 10; */
`;

/**********************************/
/*      공용 스타일       */
const Image = styled.img`
    width: ${(props) => props.width || '100%'};
    height: ${(props) => props.height || '80%'};
`;

const Text = styled.div`
    font-size: ${(props) => props.fontsize || '16px'};
    line-Height: 1.5;
`;

/**********************************/
/*      첫 번째 페이지 스타일       */
const PageWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    /* padding-bottom: 50px; */
`;

const FirstContainer = styled.div`
    margin-top: 218px;
    display: flex;
    /* flex-direction: column; */
    align-items: center;
    justify-content: center;
    gap: 96px;
`;

/**********************************/

/**********************************/
/*      두 번째 페이지 스타일       */

const SecondContainer = styled.div`
    margin-top: 218px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 96px;
`;

const FileUploadLink = styled.button`
    // color: white;
    text-decoration: none;
    font-size: 22px;
    margin-top: 32px;
    cursor: pointer;
    border: 3px #FD9F28 dotted;
    background-color: #FFCD4A;
    padding: 10px 25px;
    border-radius: 10px;

    font-family: 'Pretendard-Regular';
    font-weight: bold;

    &:hover {
        background-color: #FD9F28; 
    }
`;
