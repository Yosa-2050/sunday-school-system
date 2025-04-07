export function getForgotPwdEmailTemplate() {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reset Password</title>
</head>
<body style="background-color: #fff; color: #212121; margin: 0; padding: 0;">
  <div style="padding: 20px; margin: 0 auto; background-color: #eee;">
      
    <div style="background-color: #fff;">
      <div style="background-color:  #3496aa ; display: flex; padding: 20px 0; align-items: center; justify-content: center;">
          <h1 style="color: #FFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 30px; font-weight: bold;">
          Shega Jobs
        </h1>
      </div>

      <div style="padding: 25px 35px;">
        <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin: 0 0 14px;">
          Dear {{userName}},
        </p>
        <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin: 0 0 14px;">
         We have received a request to reset your password for your Shega Jobs account associated with <span style="color:#2754C5;"> {{email}}</span>.       
         </p>
        
        <div style="display: flex; flex-direction: column;">
          <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin: 0;">
            To complete the reset password process, please enter the following 6-digit verification code.
          </p>
                                 
           <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 25px; font-weight: bold; margin:20px;">
            {{verificationCode}}
          </p>
         
           <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin: 5px 0;">
            If you did not request a password reset, please disregard this email.
          </p>
          <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin: 5px 0;">
           For security reasons, please do not share this code with anyone.
          </p>
        </div>
      </div>

      <div style="padding: 25px 35px;">
        <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin: 0;">
          Best regards,<br>Shega Jobs Team
        </p>
      </div>
    </div>

    <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 12px; margin: 24px 0; padding: 0 20px;">
      This message was produced and distributed by Shega Jobs. © 2025, Shega Jobs. All rights reserved.</p>
  </div>
</body>
</html>`.trim();
}
