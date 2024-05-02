import React from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Switch, Space, ConfigProvider } from 'antd';
import '../styles/App.css';
import styled from 'styled-components';

const SwitchWithText = ({ isTextCentered, setIsTextCentered }) => {
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
                            텍스트 중심으로 분석하기
                        </div>
                    }
                    unCheckedChildren={
                        <div
                            style={{
                                fontSize: '16px',
                            }}
                        >
                            이미지 중심으로 분석하기
                        </div>
                    }
                    defaultChecked
                    style={{
                        backgroundColor: isTextCentered ? '#1890ff' : '#faad14',
                        display: 'flex',
                        justifyContent: 'center',
                        height: '22px',
                        // 중앙 정렬
                    }}
                    checked={isTextCentered}
                    onChange={setIsTextCentered}
                />
            </Space>
        </ConfigProvider>
    );
};
export default SwitchWithText;
