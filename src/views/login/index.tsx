import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from 'store/slice/userReducer';
import { paramToObj } from 'utils';
import './login.scss';

const Login: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handlePasswordFocus = () => {
    !passwordVisible && setPasswordVisible(false);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleLogin = async () => {
    const data = {
      username,
      password
    };

    await loginUser(data);
    const { redirect } = paramToObj() as any;
    console.log('🚀 >> handleLogin >> redirect:', redirect);
    navigate(redirect || '/');
  };

  return (
    <div className="container">
      <div className="center">
        <div className="ear ear--left"></div>
        <div className="ear ear--right"></div>
        <div className="face">
          <div className="eyes">
            <div className="eye eye--left">
              <div className="glow"></div>
            </div>
            <div className="eye eye--right">
              <div className="glow"></div>
            </div>
          </div>
          <div className="nose">
            <svg width="38.161" height="22.03">
              <path
                d="M2.017 10.987Q-.563 7.513.157 4.754C.877 1.994 2.976.135 6.164.093 16.4-.04 22.293-.022 32.048.093c3.501.042 5.48 2.081 6.02 4.661q.54 2.579-2.051 6.233-8.612 10.979-16.664 11.043-8.053.063-17.336-11.043z"
                fill="#243946"
              ></path>
            </svg>
            <div className="glow"></div>
          </div>
          <div className="mouth">
            <svg className="smile" viewBox="-2 -2 84 23" width="84" height="23">
              <path
                d="M0 0c3.76 9.279 9.69 18.98 26.712 19.238 17.022.258 10.72.258 28 0S75.959 9.182 79.987.161"
                fill="none"
                strokeWidth="3"
                strokeLinecap="square"
                strokeMiterlimit="3"
              ></path>
            </svg>
            <div className="mouth-hole"></div>
            <div className={`tongue ${isPasswordFocused ? '' : 'breath'}`}>
              <div className="tongue-top"></div>
              <div className="line"></div>
              <div className="median"></div>
            </div>
          </div>
        </div>
        <div className="hands">
          <div className={`hand hand--left ${!passwordVisible ? 'hide' : ''}`}>
            <div className="finger">
              <div className="bone"></div>
              <div className="nail"></div>
            </div>
            <div className="finger">
              <div className="bone"></div>
              <div className="nail"></div>
            </div>
            <div className="finger">
              <div className="bone"></div>
              <div className="nail"></div>
            </div>
          </div>
          <div className={`hand hand--right ${!passwordVisible ? 'hide' : ''}`}>
            <div className="finger">
              <div className="bone"></div>
              <div className="nail"></div>
            </div>
            <div className="finger">
              <div className="bone"></div>
              <div className="nail"></div>
            </div>
            <div className="finger">
              <div className="bone"></div>
              <div className="nail"></div>
            </div>
          </div>
        </div>
        <div className="login">
          <label>
            <div className="fa fa-phone"></div>
            <input
              className="username"
              type="text"
              autoComplete="on"
              placeholder="手机号码"
              value={username}
              onChange={handleUsernameChange}
              onFocus={() => setIsPasswordFocused(false)}
            />
          </label>
          <label>
            <div className="fa fa-commenting"></div>
            <input
              className="password"
              type={passwordVisible ? 'text' : 'password'}
              autoComplete="on"
              placeholder="密码"
              value={password}
              onChange={handlePasswordChange}
              onFocus={handlePasswordFocus}
            />
            <button className="password-button" type="button" onClick={togglePasswordVisibility}>
              {passwordVisible ? '隐藏密码' : '显示密码'}
            </button>
          </label>
          <button className="login-button" onClick={handleLogin}>
            登录
          </button>
        </div>
        <div className="social-buttons">
          <div className="social">
            <div className="fa fa-wechat"></div>
          </div>
          <div className="social">
            <div className="fa fa-weibo"></div>
          </div>
          <div className="social">
            <div className="fa fa-paw"></div>
          </div>
        </div>
        <div className="footer">
          测试账号：{username} {password}
        </div>
      </div>
    </div>
  );
};

export default Login;
