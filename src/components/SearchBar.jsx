import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.input`
    display: flex;
    width: 100%;
    height: 52px;
    border-radius: 16px;
    border: 1px solid #eaeaea;
    justify-content: center;
    align-items: center;
    padding-left: 20px;
    font-size: 16px;
    color: #00000057;
    font-family: 'Pretendard-Regular';

    @media (max-width: 768px) {
        height: 40px;
        font-size: 14px;
        padding-left: 15px;
    }
`;

const WarningText = styled.p`
    font-size: 13px;
    margin: 0px;
    color: #9E9E9E;

    @media (max-width: 768px) {
        margin-top: 5px;
        font-size: 11px;
    }
`;

const SearchBar = ({ placeholder, onSend }) => {
    const [search, setSearch] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSend(search);
            setSearch(''); // Optionally, clear the input after sending
        }
    };

    return (
        <>
            <Wrapper
                type='text'
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <WarningText>
                채팅에 있어, 실수가 발생할 가능성이 있습니다.
            </WarningText>
        </>
    );
};

export default SearchBar;
