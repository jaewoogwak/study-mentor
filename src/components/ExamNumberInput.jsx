import { InputNumber } from 'antd';
import React from 'react';

const onChange = (value) => {
    console.log('changed', value);
};
const ExamNumberInput = ({ min, max, defaultValue }) => (
    <InputNumber min={1} max={20} defaultValue={10} onChange={onChange} />
);
export default ExamNumberInput;
