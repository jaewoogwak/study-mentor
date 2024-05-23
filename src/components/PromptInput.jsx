import React from 'react';
import { Flex, Input } from 'antd';
import styled from 'styled-components';

const { TextArea } = Input;

const PromptInput = ({
    prompt,
    setPrompt,
    imagePrompt,
    setImagePrompt,
    isTextCentered,
}) => {
    const onChangePrompt = (e) => {
        setPrompt(e.target.value);
    };
    const onChangeImagePrompt = (e) => {
        setImagePrompt(e.target.value);
    };
    return (
        <Flex vertical gap={20}>
            <InfoText>
                문제는 아래와 같이 생성할 수 있어요.
            </InfoText>
            <CustomPromptRecommandWrapper>
                <CustomPromptRecommand>
                    이론 기반의 계산 문제를 만들어줘
                </CustomPromptRecommand>
                <CustomPromptRecommand>
                    매우 어려운 난이도로 출제해줘
                </CustomPromptRecommand>
            </CustomPromptRecommandWrapper>
            <InfoText>
                위와 같은 예시로 시험 문제 방향성을 설정해보세요.
            </InfoText>
            <TextArea
                showCount
                maxLength={100}
                onChange={onChangePrompt}
                placeholder='ex) 어떤 이론의 등장 배경과 문제점과 한계를 묻는 문제 중심으로 만들고 싶어.'
                style={{
                    height: 200,
                    resize: 'none',
                    marginBottom: 32,
                }}
            />
            {isTextCentered == 1 && (
                <>
                    <InfoText>
                        강의 자료의 이미지가 주로 어떠한 형태로 나타나는지 설명해주세요.
                    </InfoText>
                    <TextArea
                        showCount
                        maxLength={100}
                        onChange={onChangeImagePrompt}
                        placeholder='ex) 강의 자료의 이미지는 주로 그래프나 표로 제공된다 이러한 이미지를 분석하는 문제를 만들고 싶어.'
                        style={{
                            height: 200,
                            resize: 'none',
                            marginBottom: 32,
                            fontFamily: 'Pretendard-Regular'
                        }}
                    />
                </>
            )}
        </Flex>
    );
};
export default PromptInput;

const InfoText = styled.p`
    font-size: 17px;
`;

const CustomPromptRecommandWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 14px;
    align-items: center;

    text-align: center;
    font-family: "GmarketSansMedium";
`;

const CustomPromptRecommand = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    background: #b6dcee;
    color: #000;
    padding: 10px 5px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    // margin-top: 10px;
    text-align: center;
    width: 310px;
    // margin-bottom: 20px;
`;

