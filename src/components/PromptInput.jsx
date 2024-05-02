import React from 'react';
import { Flex, Input } from 'antd';
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
        <Flex vertical gap={32}>
            <TextArea
                showCount
                maxLength={100}
                onChange={onChangePrompt}
                placeholder='시험 문제 생성 방향성을 설정할 수 있어요.  ex) 어떤 이론의 등장 배경과 문제점과 한계를 묻는 문제 중심으로 만들고 싶어.'
                style={{
                    height: 200,
                    resize: 'none',
                    marginBottom: 32,
                }}
            />
            {!isTextCentered && (
                <TextArea
                    showCount
                    maxLength={100}
                    onChange={onChangeImagePrompt}
                    placeholder='강의 자료의 이미지는 주로 어떤 형태로 제공되나요?  ex) 강의 자료의 이미지는 주로 그래프나 표로 제공됩니다. 이러한 이미지를 분석하는 문제를 만들고 싶어.'
                    style={{
                        height: 200,
                        resize: 'none',
                        marginBottom: 32,
                    }}
                />
            )}
        </Flex>
    );
};
export default PromptInput;
