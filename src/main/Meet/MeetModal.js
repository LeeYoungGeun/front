import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaSearch } from 'react-icons/fa';
import RecruitmentModal from './RecruitmentModal';
import ApplyModal from './ApplyModal';
import api, { setAuthToken } from './api';
import { useCookies } from 'react-cookie';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1002;
`;

const ModalContent = styled.div`
  position: relative;
  width: 70%;
  height: 80%;
  background-color: #141414;
  border-radius: 20px;
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
`;

const SearchBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #333;
  background-color: #333;
  color: white;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #e50914;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const MeetingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const MeetItem = styled.div`
  background-color: #333;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 300px;
`;

const NoPosterImage = styled.div`
  width: 100%;
  height: 150px;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const MeetInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const MeetModal = ({ onClose }) => {
  const [cookies] = useCookies(['accessToken']);
  const [meetings, setMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRecruitmentModal, setShowRecruitmentModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchMeetings();
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    if (cookies.accessToken) {
      setAuthToken(cookies.accessToken);
      try {
        const response = await api.get("/api/auth/modify");
        setIsLoggedIn(true);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    if (cookies.accessToken) {
      setAuthToken(cookies.accessToken);
    }
    fetchMeetings();
  }, [cookies.accessToken]);

  const fetchMeetings = async () => {
    try {

      const token = cookies.accessToken;
      if (token) {
        setAuthToken(token);
      }

      const response = await api.get('/api/meet/list');
      console.log("전체응답로깅API response:", response.data);  // 전체 응답 로깅
  
      if (response.data && response.data.dtoList) {
        setMeetings(response.data.dtoList);

      } else {
        console.error('이걸좀보시오Unexpected data structure:', response.data);
        setMeetings([]);
      }
      
    } catch (error) {
      console.error('여기좀보시오Error fetching meetings:', error);
      setMeetings([]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRecruitmentClick = () => {
    if (isLoggedIn) {
      setShowRecruitmentModal(true);
    } else {
      alert('로그인이 필요한 서비스입니다.');
    }
  };

  const handleRecruitmentClose = (dataChanged = false) => {
    setShowRecruitmentModal(false);
    if (dataChanged) {
      fetchMeetings();
    }
  };

  const handleApplyClick = (meeting) => {
    if (isLoggedIn) {
      setSelectedMeeting(meeting);
      setShowApplyModal(true);
    } else {
      alert('로그인이 필요한 서비스입니다.');
    }
  };

  const filteredMeetings = meetings.filter(meeting =>
    meeting.meetTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <ModalOverlay onClick={onClose}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <CloseButton onClick={onClose}><FaTimes /></CloseButton>
          
          <SearchBar>
            <SearchInput 
              type="text" 
              placeholder="검색" 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FaSearch style={{ marginRight: '10px' }} />
            <Button onClick={handleRecruitmentClick}>모집하기</Button>
          </SearchBar>

          <MeetingsGrid>
            {filteredMeetings.map(meeting => (
              <MeetItem key={meeting.meetId}>
                <h3>{meeting.meetTitle}</h3>
                <p>모집인원: {meeting.personnel}</p>
                <p>모임시간: {new Date(meeting.meetTime).toLocaleString()}</p>
                <Button onClick={() => handleApplyClick(meeting)}>신청하기</Button>
              </MeetItem>
            ))}
          </MeetingsGrid>
        </ModalContent>
      </ModalOverlay>

      {showRecruitmentModal && (
        <RecruitmentModal 
          show={showRecruitmentModal}
          onClose={handleRecruitmentClose}
          userData={userData}
        />
      )}

      {showApplyModal && selectedMeeting && (
        <ApplyModal
          meeting={selectedMeeting}
          onClose={() => setShowApplyModal(false)}
          isLoggedIn={isLoggedIn}
          userData={userData}
        />
      )}
    </>
  );
};

export default MeetModal;