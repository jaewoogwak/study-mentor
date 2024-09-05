import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { getDocs, collection } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const ReadGuestBook = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 15;

    useEffect(() => {
        const fetchGuestbookEntries = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'guestbook'));
                const entriesList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    const date = data.timestamp.toDate();
                    const formattedDate = date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short'
                    });
    
                    return {
                        id: doc.id,
                        ...data,
                        timestamp: {
                            original: date,      // Keep the original date object for sorting
                            formatted: formattedDate // Formatted date for display
                        }
                    };
                });
    
                // Sort using the original date object
                entriesList.sort((a, b) => b.timestamp.original - a.timestamp.original);
    
                setEntries(entriesList);
            } catch (error) {
                console.error('방명록 목록 가져오기 오류:', error);
                setError('방명록을 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchGuestbookEntries();
    }, []);
    
    

    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>{error}</h2>;

    const totalPages = Math.ceil(entries.length / entriesPerPage);

    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    const currentEntries = entries.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <Wrapper>
            <h2 style={{ margin: "10px 0px 30px 0px" }}>🗣 방명록 목록</h2>
            {entries.length === 0 ? (
                <p style={{ fontSize: "20px" }}>현재 작성된 방명록이 없습니다. <br /> 방명록을 작성해보세요.</p>
            ) : (
                <>
                    <BookTable>
                        <BookThead>
                            <tr>
                                <BookTh width="90px">이름</BookTh>
                                <BookTh>메시지</BookTh>
                                <BookTh width="110px">날짜</BookTh>
                            </tr>
                        </BookThead>
                        <tbody>
                            {currentEntries.map(entry => (
                                <tr key={entry.id}>
                                    <BookTd>{entry.name || '익명'}</BookTd>
                                    <BookTd>{entry.message}</BookTd>
                                    <BookTd>{entry.timestamp.formatted}</BookTd>
                                </tr>
                            ))}
                        </tbody>
                    </BookTable>

                    <Pagination>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <PageButton
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                style={{ backgroundColor: currentPage === index + 1 ? '#ddd' : 'white' }}
                            >
                                {index + 1}
                            </PageButton>
                        ))}
                    </Pagination>
                </>
            )}
        </Wrapper>
    );
};

export default ReadGuestBook;

const Wrapper = styled.div`
    padding: 10px 35px;
`;

const BookTable = styled.table`
    width: 850px;
    border-collapse: collapse;
`;

const BookThead = styled.thead`
    background-color: #FFF6DD; 
`;

const BookTh = styled.th`
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center; 
    font-size: 18px;
    width: ${(props) => props.width || 'auto'}; 
`;

const BookTd = styled.td`
    border: 1px solid #ddd;
    padding: 15px;
    text-align: center; 
    font-size: 17px;
`;

const Pagination = styled.div`
    margin: 30px;
    text-align: center;
`;

const PageButton = styled.button`
    padding: 5px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    margin-right: 10px;
    border-radius: 4px;
`;