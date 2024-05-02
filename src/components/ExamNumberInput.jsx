import { InputNumber } from 'antd';
import React from 'react';

const onChange = (value) => {
    console.log('changed', value);
};
const ExamNumberInput = ({ min, max, defaultValue }) => (
    <InputNumber
        min={min}
        max={max}
        defaultValue={defaultValue}
        onChange={onChange}
    />
);
export default ExamNumberInput;
