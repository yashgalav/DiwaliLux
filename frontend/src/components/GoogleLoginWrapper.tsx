import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { useRecoilState } from 'recoil';
import { isAuthenticatedAtom, loggedInUserNameAtom } from '../store/Atom';
import { useState } from 'react';
import { Spinner } from './Spinner';

export default function GoogleLoginWrapper() {
  const navigate = useNavigate();
  const [, setIsAuthenticated] = useRecoilState(isAuthenticatedAtom);
  const [, setLoggedInUserName] = useRecoilState(loggedInUserNameAtom);
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential ?? "";
    if (!token) {
      console.error("Token missing");
      return;
    }

    

    try {
      setLoading(true)
      const res = await axios.post(`${BACKEND_URL}/api/v1/user/auth/google-login`, { token });

      if (res.status === 200) {
        navigate("/");
        const backendToken = res.data.jwt;
        const userId = res.data.userId;
        const name = res.data.name ?? "Guest User";
        localStorage.setItem("authToken", backendToken);
        localStorage.setItem("userId", userId)
        setLoggedInUserName(name);

        setIsAuthenticated(true);
        // Example redirect
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Login request failed:", error);
      setIsAuthenticated(false);
    }
  };

  return (
    <div className='mt-5'>
      
      {loading ? <Spinner/> : <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          console.log('Login Failed');
          setIsAuthenticated(false);
        }}
        useOneTap={false}
      />}

    </div>
  );
}
