import React from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Switch, Space, ConfigProvider } from 'antd';
import '../styles/App.css';
import styled from 'styled-components';

const SwitchWithText = () => {
    const [checked, setChecked] = React.useState(true);

    return (
        <ConfigProvider
            theme={{
                components: {
                    Switch: {
                        // handleSize: '22px',
                    },
                },
            }}
        >
            <Space direction='vertical'>
                <Switch
                    checkedChildren={
                        <div
                            style={{
                                fontSize: '16px',
                            }}
                        >
                            텍스트와 이미지 모두 분석하기
                        </div>
                    }
                    unCheckedChildren={
                        <div
                            style={{
                                fontSize: '16px',
                            }}
                        >
                            텍스트만 분석하기
                        </div>
                    }
                    defaultChecked
                    style={{
                        backgroundColor: checked ? '#1890ff' : '#faad14',
                        display: 'flex',
                        justifyContent: 'center',
                        height: '22px',
                        // 중앙 정렬
                    }}
                    checked={checked}
                    onChange={setChecked}
                />
            </Space>
        </ConfigProvider>
    );
};
export default SwitchWithText;
