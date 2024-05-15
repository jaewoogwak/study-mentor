import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.input`
    display: flex;
    width: 100%;
    height: 52px;
    border-radius: 15px;
    border: 1px;

    border: 1px solid #eaeaea;
    border-radius: 16px;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    padding-left: 20px;

    font-size: 16px;
    color: #00000057;
    font-family: 'Pretendard-Regular';
`;

const SearchBar = ({ placeholder, onSend }) => {
    const [search, setSearch] = useState('');

    // useEffect(() => {}, [search]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSend(search);
            setSearch(''); // Optionally, clear the input after sending
        }
    };
    return (
        <Wrapper
            type='text'
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
        ></Wrapper>
    );
};

export default SearchBar;
