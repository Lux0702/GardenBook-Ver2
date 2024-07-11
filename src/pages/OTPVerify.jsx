import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../assets/css/verifyOTP.css'
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useVerifyOtp ,useSendOTP, useResetPassword} from "../utils/api";
import logo from "../assets/images/logo-home.png"
import {Modal, Spin, Button} from "antd";
const OTPInput = () => {
  const [modal, contextHolder] = Modal.useModal();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [spinning, setSpinning] = useState(false);
  const {flagOTP, fetchSendOTP}= useSendOTP()
  const [urlVerfile, setUrl] = useState();
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [resendOTPStatus, setResendOTPStatus] = useState(false);
  const {fetchVerifyOtp}= useVerifyOtp();
  const {fetchResetPassword} = useResetPassword();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const emailParam = searchParams.get("email");
  const navigate = useNavigate();
  const[open,setOpen]= useState(false);
  const [isLoading, setLoading] = useState(false);
  const [passWord, setPassword] = useState('');
  const sendOTPRegister = 'send-register-otp';
  const sendOTPForgotPass ='send-forgot-password-otp';
  const [errors, setErrors] = useState({}); // State để lưu thông báo lỗi
  const [confirmPassWord, setConfirmPassword] = useState("");
  const validateForm = () => {
    // Kiểm tra các trường dữ liệu và cập nhật thông báo lỗi
    const newErrors = {};
  
    if (!passWord.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    }else if (passWord.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự.";
    }
  
    if (!confirmPassWord.trim()) {
      newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu.";
    } else if (passWord.trim() !== confirmPassWord.trim()) {
      newErrors.confirmPassword = "Mật khẩu không khớp.";
    }
  
    setErrors(newErrors);
  
    // Kiểm tra xem có lỗi hay không
    return Object.keys(newErrors).length === 0;
  };
  // const handleOk = () => {
  //   setTimeout(() => {
  //   setOpen(false);
  //   }, 200);
  // };
  // const handleCancel = () => {
  //   setOpen(false);

  // };
  const handleInputChange = (index, value) => {
    if (isNaN(value)) return;
    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
      newOtp[index] = value;
      return newOtp;
    });
    if (value !== '' && index < otp.length - 1) {
      document.querySelector(`#otp-input-${index + 2}`).focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData('text').slice(0, otp.length).split('');
    if (pasteData.length === otp.length) {
      setOtp(pasteData);
    } else {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        pasteData.forEach((value, index) => {
          newOtp[index] = value;
        });
        return newOtp;
      });
    }
  };

  const handleResendOTP = async () => {
    try{
        setSpinning(true)
        const success= await fetchSendOTP(email,urlVerfile)
        if(success){
          setResendOTPStatus(true);
          setOtp(['', '', '', '', '', '']);
            let secondsToGo = 5;
            const instance = modal.success({
              title: 'Thông báo',
              content: `OTP đã được gửi đến Email.Vui lòng kiểm tra. Thông báo sẽ đóng sau ${secondsToGo} giây.`,
              className: 'custom-modal'
            });
            const timer = setInterval(() => {
              secondsToGo -= 1;
              instance.update({
                content: `OTP đã được gửi đến Email.Vui lòng kiểm tra. Thông báo sẽ đóng sau ${secondsToGo} giây.`,
              });
            }, 1000);
            setTimeout(() => {
              clearInterval(timer);
              instance.destroy();
            }, secondsToGo * 1000);
        }else{setLoading(false)}
      }catch(error){
        console.log(error)
      }finally{
        setSpinning(false)
      }

  };

  const handleConfirm = async () => {
    setLoading(true);
    const otpCode = otp.join('');
    try {
        setSpinning(true)
      const success = await fetchVerifyOtp(otpCode,email)
      if(success && urlVerfile==='send-register-otp')
        {
            toast.success( "Xác nhận mã OTP thành công.")
            setTimeout(() => {
              navigate('/login');
            }, 3000);
        }else if(success && urlVerfile !=='send-register-otp'){
            toast.success( "Xác nhận mã OTP thành công.");
            setOpen(true)
        }else{setLoading(false)}
    } catch (error) {
      console.error("Lỗi trong quá trình xác nhận:", error);
      toast.error("Đã xảy ra lỗi trong quá trình xác nhận. Vui lòng thử lại.");
    } finally{       
         setSpinning(false)
    }
  };

  useEffect(() => {
    if (emailParam) {
        setEmail(emailParam);
    }
    const currentPath = window.location.pathname;
    console.log('current',currentPath)
    if(currentPath === '/email/forgotpassword/verify'){
        console.log('True')
        setUrl(sendOTPForgotPass)
    }else{setUrl(sendOTPRegister)}
  }, [emailParam]);
  const handleResetForgotPassword= async()=>{
    if(validateForm()){
        try{
            setSpinning(true)
            setOpen(false)
            const success = await fetchResetPassword(passWord,confirmPassWord,email);
            if(success){
              toast.success('Cập nhật mật khẩu thành công')
              setTimeout(() => {
                navigate('/login');
              }, 3000);
            } else {setOpen(true)}
        }catch(error){
            console.log(error)
        }finally{
            setSpinning(false)

        }
    }

  }
  return (
    <div style={{ backgroundColor: '#ccc' }}>
      <Header />
      <div className="otp-container">
        <h1 style={{ fontFamily: 'Arial, Helvetica, sans-serif',fontWeight:'bold' }}>Mã xác nhận OTP</h1>
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index + 1}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Backspace" && index > 0 && !otp[index]) {
                  document.querySelector(`#otp-input-${index}`).focus();
                }
              }}
              onPaste={handlePaste}
            />
          ))}
        </div>
        <button onClick={handleConfirm} disabled={isLoading} style={{ backgroundColor: isLoading ? 'gray' : '#3697a6' }}>Xác nhận</button>
        {verificationStatus && <p>{verificationStatus}</p>}
        <a style={{ marginTop: '10px' }} href="#" onClick={handleResendOTP}>
          Gửi lại mã OTP
        </a>
      </div>
      <Footer />
      <Modal
        open={open}
        // onOk={handleOk}
        onCancel={null}
        centered={true}
        className="custom-modal"
        footer={null}
        styles={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        closable ={false}
        >
        <div className='login'>
          <img className="login-img" src={logo} alt='logo' style={{top: '45%'}} />
          <div >

            <h2>Đổi mật khẩu</h2>
            <form>
              <label className="otp-label">
                Mật khẩu:
                <input
                  type="password"
                  id ='passwpord'
                  name='password'
                  value={passWord}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                /> 
            {errors.password && <p className="error-message" style={{color:"red"}}>{errors.password}</p>}

              </label>
              <label className="otp-label">
                Nhập lại mật khẩu:
                <input
                  type="password"
                  id="confirmPassWord"
                  name="confirmPassWord"
                  value={confirmPassWord}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                /> 
            {errors.confirmPassword && <p className="error-message" style={{color:"red"}}>{errors.confirmPassword}</p>}

              </label>
              <button type="button" onClick={handleResetForgotPassword} className="otp-button" >
                Xác nhận
              </button>
            
            </form>
          </div>
      </div>
      </Modal>
      <Spin spinning={spinning} fullscreen style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} size="large" />
      {contextHolder}

    </div>
  );
};

export default OTPInput;
