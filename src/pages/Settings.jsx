import React, { useState } from 'react';
import axios from 'axios';

const Settings = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);

    const sendVerificationCode = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/pdf/auth-email`,
                { email: email }
            );
            setMessage(response.data.message);
            setIsCodeSent(true); // 인증 코드가 발송되었음을 표시
        } catch (error) {
            setMessage('Error sending verification code');
        }
    };

    const verifyCode = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/pdf/auth-num`, // 인증 코드 검증을 위한 엔드포인트
                { email: email, authnum: code }
            );
            setMessage(response.data.message); // 서버 응답 메시지 설정
        } catch (error) {
            setMessage('Error verifying code');
        }
    };

    return (
        <div>
            <h2>Email Verification</h2>

            {/* 이메일 입력 필드 */}
            <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email'
            />
            <button onClick={sendVerificationCode}>
                Send Verification Code
            </button>

            {/* 인증 코드 입력 필드 */}
            {isCodeSent && (
                <>
                    <input
                        type='text'
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder='Enter verification code'
                    />
                    <button onClick={verifyCode}>Verify Code</button>
                </>
            )}

            {message && <p>{message}</p>}
        </div>
    );
};

export default Settings;
