// Json 파일 
// 이건 일단 ... json파일 받아올 곳이 없어서 필요 없는 코드..
// JsonUpload의 부모 : DataUpload
import React, { useState } from 'react';

const JsonUpload = ({ onJsonLoaded }) => {
    // 파일 입력 상태가 변경되었을 때 호출되는 event handler
    const handleFileChange = (event) => {
        // 사용자가 선택한 파일을 가져온다. (여기서는 원래 있던 json 파일로 정의)
        const file =  event.target.files[0];
        if (!file) return; // 파일이 없으면 종료
        
        const reader = new FileReader(); // 파일 읽기
        reader.onload = (e) => {
            // 읽은 결과를 json으로 파싱한다.
            const json = JSON.parse(e.target.result);
            onJsonLoaded(json); // JSON 데이터 전달
        };
        reader.readAsText(file);
    };
    
    // 파일은 json 형식만 받도록 한다.
    return <input type="file" accept="application/json" onChange={handleFileChange} />;
};

export default JsonUpload;
