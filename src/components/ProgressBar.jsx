import React, { useState } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Progress } from 'antd';

const ProgressBar = (percent) => {
    // const [percent, setPercent] = useState(0);

    return (
        <Flex vertical gap='small'>
            <Flex vertical gap='small'>
                <Progress percent={percent} type='line' />
                {/* <Progress percent={percent} type='circle' /> */}
            </Flex>
        </Flex>
    );
};
export default ProgressBar;
