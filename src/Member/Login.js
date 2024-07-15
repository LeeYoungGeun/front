import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import api, { setAuthToken } from './api';
import './Login.css';

function Login() {
  const [loginData, setLoginData] = useState({
    mid: '',
    mpw: ''
  });

  
  const [cookies, setCookie] = useCookies(['accessToken', 'refreshToken']);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = cookies.accessToken;
    if (accessToken) {
      setAuthToken(accessToken);
    }
  }, [cookies]);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/auth/login', loginData);
      console.log(response.data);

      const { accessToken, refreshToken } = response.data;

      // 쿠키에 저장
      setCookie('accessToken', accessToken, { path: '/', sameSite: 'Lax' });
      setCookie('refreshToken', refreshToken, { path: '/', sameSite: 'Lax' });


      // axios 기본 헤더에 토큰 설정
      setAuthToken(accessToken);

      navigate('/');
      alert("로그인에 성공하셨습니다.");
    } catch (error) {
      console.error('로그인 실패:', error);
      alert("아이디 또는 비밀번호가 다릅니다.");
    }
  };

  return (
    <div className="loginBackground">
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>로그인</h2>
          <input name="mid" value={loginData.mid} onChange={handleLoginChange} placeholder="아이디" />
          <input name="mpw" type="password" value={loginData.mpw} onChange={handleLoginChange} placeholder="비밀번호" />
          <button type="submit">로그인</button>
          <div className="kakao">
            <img src="img/kakao_login.png" alt="카카오 로그인" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
