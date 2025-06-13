// import React, { useState } from "react";
// import styles from "./ForgotPassword.module.css";
// import asset1 from "../../assets/images/asset1.png";
// import asset2 from "../../assets/images/asset2.png";
// import asset3 from "../../assets/images/asset3.png";
// import asset4 from "../../assets/images/asset4.png";
// import KodvixLogo from "../../assets/images/Kodvixlogo.png";
// import logo from "../../assets/logos/kodvix-logo.png"; 

// import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";
// import { FaLock } from 'react-icons/fa';

// const ForgotPassword = () => {
//   const [step, setStep] = useState(1);
//   const [email, setEmail] = useState("");

//   const navigate = useNavigate();

//   return (
//     <div className={styles.container}>
//       <div className={styles.split}>
//         <div className={styles.left}>
//           <div className={styles.formWrapper}>
//             {step === 1 && (
//               <>
//                 <h2>Forgot your password?</h2>
//                 <p>Enter your Email and get OTP to verification.</p>

//                 <div className={styles.inputWrapper}>
//                   <AiOutlineMail className={styles.icon} />
//                   <input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className={styles.input}
//                   />
//                 </div>

//                 <div className={styles.inputWrapper}>
//                   <AiOutlineMail className={styles.icon} />
//                   <input
//                     type="email"
//                     placeholder="Repeat Email"
//                     className={styles.input}
//                   />
//                 </div>

//                 <button className={styles.button} onClick={() => setStep(2)}>
//                   GET OTP
//                 </button>
//               </>
//             )}

//             {step === 2 && (
//               <>
//                 <h2>Enter OTP</h2>
//                 <p>
//                   Sent OTP on{" "}
//                   <span className={styles.link}>
//                     {email || "johndoe@gmail.com"}
//                   </span>
//                 </p>
//                 <div className={styles.otpBox}>
//                   {Array.from({ length: 6 }).map((_, i) => (
//                     <input
//                       key={i}
//                       type="text"
//                       maxLength="1"
//                       placeholder="-"
//                       className={styles.otpInput}
//                     />
//                   ))}
//                 </div>
//                 <button className={styles.button} onClick={() => setStep(3)}>
//                   SUBMIT
//                 </button>
//                 <p className={styles.resend}>Resend OTP</p>
//               </>
//             )}

//             {step === 3 && (
//               <>
//                 <h2>Enter your new password</h2>
//                 <p>This is the last step in recovering your password.</p>
//                 <div className={styles.inputWrapper}>
//                   <FaLock className={styles.icon} />
//                   <input
//                     type="password"
//                     placeholder="Password"
//                     className={styles.input}
//                   />
//                 </div>
//                 <div className={styles.inputWrapper}>
//                   <FaLock className={styles.icon} />
//                   <input
//                     type="password"
//                     placeholder="Confirm Password"
//                     className={styles.input}
//                   />
//                 </div>
//                 <button className={styles.button} onClick={() => navigate("/")}>
//                   SUBMIT
//                 </button>
//               </>
//             )}
//           </div>
//         </div>

//         <div className={styles.right}>
//   <img src={logo} alt="KodVix Logo" className={styles.logo} />
//   <div className={styles.circleContainer}>
//     <div className={styles.outerCircle}>
//       <div className={styles.innerCircle}>
//         <img
//           src={step === 1 ? KodvixLogo : step === 2 ? asset2 : asset3}
//           alt="Illustration"
//           className={styles.circleImage}
//         />
//       </div>
//     </div>
//   </div>

//   {step === 1 && (
//     <div className={styles.rightText}>
//     <h3>Forgot your password?</h3>
//     <p>You can easily recover it.</p>
//   </div>
  
//   )}
//   {step === 2 && <div className={styles.rightText}>
//   <h3>It's just OTP verification</h3>
//   <p>You are one step away from recovering your password.</p>
// </div>}
//   {step === 3 && <div className={styles.rightText}>
//   <h3>This is the end!</h3>
//   <p>After entering the new password you will gain access to your account.</p>
// </div>}
// </div>

//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;




import React, { useState } from "react";
import styles from "./ForgotPassword.module.css";
import asset1 from "../../assets/images/asset1.png";
import asset2 from "../../assets/images/asset2.png";
import asset3 from "../../assets/images/asset3.png";
import asset4 from "../../assets/images/asset4.png";
import KodvixLogo from "../../assets/images/Kodvixlogo.png";
import logo from "../../assets/logos/kodvix-logo.png"; 

import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { FaLock } from 'react-icons/fa';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [repeatEmail, setRepeatEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();


  const API_URL = "http://192.168.1.19:8080/api/auth";


  // const handleOtpChange = (index, value) => {

  //   if (value && !/^\d+$/.test(value)) return;

  //   const newOtp = [...otp];
  //   newOtp[index] = value;
  //   setOtp(newOtp);

 
  //   if (value && index < 5) {
  //     const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
  //     if (nextInput) nextInput.focus();
  //   }
  // };

  const handleOtpChange = (index, value) => {
  if (!/^[0-9]?$/.test(value)) return; // only allow 0-9 or empty string

  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);

  if (value && index < 5) {
    const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
    if (nextInput) nextInput.focus();
  }
};

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };


  const handleRequestOtp = async () => {

    setErrorMessage("");
    setSuccessMessage("");


    if (!email || !repeatEmail) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    if (email !== repeatEmail) {
      setErrorMessage("Emails do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          repeatEmail: repeatEmail.trim(),
        }),
      });

      const data = await response.text();
      
      if (response.ok) {
        setSuccessMessage("OTP sent to your email");
        setStep(2);
      } else {
        setErrorMessage(data || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error requesting OTP:", error);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleResendOtp = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.text();
      
      if (response.ok) {
        setSuccessMessage("New OTP sent to your email");
      } else {
        setErrorMessage(data || "Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

 
  const handleVerifyOtp = async () => {
    setErrorMessage("");
    setSuccessMessage("");


    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          otp: otpValue,
        }),
      });

      const data = await response.text();
      
      if (response.ok) {
        setSuccessMessage("OTP verified successfully");
        setStep(3);
      } else {
        setErrorMessage(data || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleResetPassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!newPassword || !confirmNewPassword) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          newPassword,
          confirmNewPassword,
        }),
      });

      const data = await response.text();
      
      if (response.ok) {
        setSuccessMessage("Password reset successful");
        
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setErrorMessage(data || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.split}>
        <div className={styles.left}>
          <div className={styles.formWrapper}>
            {errorMessage && (
              <div className={styles.errorMessage}>{errorMessage}</div>
            )}
            {successMessage && (
              <div className={styles.successMessage}>{successMessage}</div>
            )}

            {step === 1 && (
              <>
                <h2>Forgot your password?</h2>
                <p>Enter your Email and get OTP for verification.</p>

                <div className={styles.inputWrapper}>
                  <AiOutlineMail className={styles.icon} />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputWrapper}>
                  <AiOutlineMail className={styles.icon} />
                  <input
                    type="email"
                    placeholder="Repeat Email"
                    value={repeatEmail}
                    onChange={(e) => setRepeatEmail(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <button 
                  className={styles.button} 
                  onClick={handleRequestOtp}
                  disabled={isLoading}
                >
                  {isLoading ? "SENDING..." : "GET OTP"}
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h2>Enter OTP</h2>
                <p>
                  Sent OTP to{""}
                  <span className={styles.link}>{email}</span>
                </p>
                {/* <div className={styles.otpBox}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      type="text"
                      name={`otp-${i}`}
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      placeholder="-"
                      className={styles.otpInput}
                    />
                  ))}
                </div> */}
                <div className={styles.otpBox}>
  {otp.map((digit, index) => (
   <input
  key={index}
  type="tel" // Better for numeric input (especially on mobile)
  pattern="[0-9]*"
  inputMode="numeric"
  maxLength="1"
  name={`otp-${index}`}
  value={digit}
  onChange={(e) => handleOtpChange(index, e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        const prevInput = document.querySelector(`input[name=otp-${index - 1}]`);
        if (prevInput) prevInput.focus();
      }
    }}
  onFocus={(e) => e.target.select()}
  className={styles.otpInput}
  placeholder="-"
/>
  ))}
</div>

                <button 
                  className={styles.button} 
                  onClick={handleVerifyOtp}
                  disabled={isLoading}
                >
                  {isLoading ? "VERIFYING..." : "SUBMIT"}
                </button>
                <p 
                  className={styles.resend} 
                  onClick={isLoading ? null : handleResendOtp}
                  style={{ cursor: isLoading ? 'default' : 'pointer' }}
                >
                  Resend OTP
                </p>
              </>
            )}

            {step === 3 && (
              <>
                <h2>Enter your new password</h2>
                <p>This is the last step in recovering your password.</p>
                <div className={styles.inputWrapper}>
                  <FaLock className={styles.icon} />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputWrapper}>
                  <FaLock className={styles.icon} />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <button 
                  className={styles.button} 
                  onClick={handleResetPassword}
                  disabled={isLoading}
                >
                  {isLoading ? "SUBMITTING..." : "SUBMIT"}
                </button>
              </>
            )}
          </div>
        </div>

        <div className={styles.right}>
          <img src={logo} alt="KodVix Logo" className={styles.logo} />
          <div className={styles.circleContainer}>
            <div className={styles.outerCircle}>
              <div className={styles.innerCircle}>
                <img
                  src={step === 1 ? KodvixLogo : step === 2 ? asset2 : asset3}
                  alt="Illustration"
                  className={styles.circleImage}
                />
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className={styles.rightText}>
              <h3>Forgot your password?</h3>
              <p>You can easily recover it.</p>
            </div>
          )}
          {step === 2 && (
            <div className={styles.rightText}>
              <h3>It's just OTP verification</h3>
              <p>You are one step away from recovering your password.</p>
            </div>
          )}
          {step === 3 && (
            <div className={styles.rightText}>
              <h3>This is the end!</h3>
              <p>After entering the new password you will gain access to your account.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;