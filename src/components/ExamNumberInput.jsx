import { InputNumber } from 'antd';
import React from 'react';

const onChange = (value) => {
    console.log('changed', value);
};
const ExamNumberInput = () => (
    <InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />
);
export default ExamNumberInput;
