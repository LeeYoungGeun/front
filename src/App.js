import './App.css';
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MainContainer } from './main/Main';
import Header from './main/header/Header';
import Body from './main/body/Body';
import SearchResultList from './main/body/SeachResultList';
import Footer from './main/footer/Footer';
import Login from './Member/Login';
import SignUp from './Member/SignUp';
import Mypage from './Member/Mypage';
import { Modify, ModifyCheck} from './Member/Modify'; 
import Remove from './Member/Remove';
import { useCookies } from 'react-cookie';
import { setAuthToken } from './Member/api';

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);

  useEffect(() => {
    const accessToken = cookies.accessToken;
    if (accessToken) {
      setAuthToken(accessToken);
    }
  }, [cookies]);
  return (
    <MainContainer color='black'>
      <Header/>
      <Routes>
        <Route path='/' element={<Body />} /> 
        <Route path='/search' element={<SearchResultList />} /> 
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/modify' element={<Modify />} />
        <Route path='/modifycheck' element={<ModifyCheck />} />
        <Route path='/mypage' element={<Mypage />} />
        <Route path='/checkpw' element={<Remove />} />
      </Routes>
      <Footer/>
    </MainContainer>
  );
}

export default App;
