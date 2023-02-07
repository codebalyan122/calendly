import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import {
  isEmailValid,
  handleErrorFromEmailLogin,
} from "../utils/HelperFunctions";

import {
  addUserInDatabase,
  createUserWithEmailPassword,
  signInWithEmailPassword,
  signInWithGoogle,
} from "../services/firebase";
import { showMessage } from "../services/message";
import { Card, Button, Input } from "antd";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignupEnabled, setIsSignupEnabled] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [isLoadingSigning, setIsLoadingSigning] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (email.length) {
      const isValidEmail = isEmailValid(email);
      setValidationError({
        ...validationError,
        emailError: isValidEmail ? "" : "Enter a valid email",
      });
    }
  }, [email]);

  useEffect(() => {
    if (isSignupEnabled && confirmPassword.length)
      setValidationError({
        ...validationError,
        confirmPassword:
          password !== confirmPassword ? "Enter above password not same" : "",
      });
  }, [confirmPassword]);

  const setUserInLocalStorage = (userInfo) => {
    const {
      user: { uid, email, picture, name, accessToken },
    } = userInfo;
    const userData = { uid, email, name, picture, accessToken };
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const onLoginClickHandler = () => {
    setIsLoadingSigning(true);

    if (isSignupEnabled) {
      createUserWithEmailPassword(email, password)
        .then((data) => {
          console.log(data);
          addUserInDatabase(data.user.uid, {
            email: data.user.email,
            auth_provider: "email",
          });
          setUserInLocalStorage(data);
          navigate("/home");
        })
        .catch((err) => {
          setIsLoadingSigning(false);
          handleErrorFromEmailLogin(err.code, err.message);
        });
    } else {
      signInWithEmailPassword(email, password)
        .then((data) => {
          setUserInLocalStorage(data);
          setIsLoadingSigning(false);
          navigate("/home");
        })
        .catch((err) => {
          if (err.code === "auth/user-not-found") {
            setIsSignupEnabled(true);
          }
          setIsLoadingSigning(false);
          handleErrorFromEmailLogin(err.code, err.message);
        });
    }
  };

  const onGoogleClickHandler = async () => {
    signInWithGoogle()
      .then((data) => {
        console.log(data.user);
        const userData = {
          user: {
            uid: data.user.uid,
            email: data.user.email,
            name: data.user.displayName,
            picture: data.user.photoURL,
            auth_provider: "google",
            accessToken: data.user.accessToken,
          },
        };
        setUserInLocalStorage(userData);
        addUserInDatabase(data.user.uid, { ...userData.user });
        navigate("/home");
      })
      .catch((err) => {
        showMessage("error", err.message);
      })
      .finally(() => {
        setIsGoogleLoading(false);
      });
  };

  return (
    <div className="LoginPageContainer">
      <Card
        style={{ flex: 0.6 }}
        className="br10 flex justifyContentCenter"
        hoverable
      >
        <h2 className="montserratBold flex justifyContentCenter">Login...</h2>
        <div className="flex justifyContentCenter">
          <div>
            <Input
              type="email"
              status={
                validationError.emailError && validationError.emailError.length
                  ? "error"
                  : ""
              }
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input.Password
              placeholder="enter password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              className="mt12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {isSignupEnabled && (
              <Input.Password
                placeholder="confirm password"
                status={
                  validationError.confirmPasswordError &&
                  validationError.confirmPasswordError.length
                    ? "error"
                    : ""
                }
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                className="mt12"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}

            <Button
              type="primary"
              className="width100"
              loading={isLoadingSigning}
              onClick={onLoginClickHandler}
              disabled={
                !email || !password || (isSignupEnabled && !confirmPassword)
              }
            >
              {isSignupEnabled ? "Create an account" : <LoginOutlined />}
            </Button>
          </div>
        </div>
        <div className="flex flexRow alignItemsCenter justifyContentCenter mv12">
          <hr style={{ flex: 0.45 }} />
          <h3>or</h3>
          <hr style={{ flex: 0.45 }} />
        </div>
        <Button
          type="primary"
          loading={isGoogleLoading}
          className="width100"
          onClick={onGoogleClickHandler}
        >
          <GoogleOutlined />
        </Button>
      </Card>
    </div>
  );
};

export default Auth;
