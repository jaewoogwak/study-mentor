import React from 'react';
import { Flex, Input } from 'antd';
const { TextArea } = Input;

const PromptInput = ({ prompt, setPrompt }) => {
    const onChange = (e) => {
        setPrompt(e.target.value);
    };
    return (
        <Flex vertical gap={32}>
            <TextArea
                showCount
                maxLength={100}
                onChange={onChange}
                placeholder='어떤 이론의 등장 배경과 문제점과 한계를 묻는 문제 중심으로 만들고 싶어.'
                style={{
                    height: 200,
                    resize: 'none',
                    marginBottom: 32,
                }}
            />
        </Flex>
    );
};
export default PromptInput;
