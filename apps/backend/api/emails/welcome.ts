function generateShegaJobsWelcomeEmail({
    userName = '',
    role = '',
    email = '',
    tempPassword = '',
    loginUrl = '',
    baseUrl = '',
} = {}) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to Herani Sunday School Management System! Your Account is Created</title>
</head>
<body style="background-color: #fff; color: #212121; margin: 0; padding: 0;">
  <div style="padding: 20px; margin: 0 auto; background-color: #eee;">
    <!-- Preview text (hidden in most email clients) -->
    <div style="display: none; max-height: 0px; overflow: hidden;">
      Welcome to Herani Sunday School Management System! Your Account is Created
    </div>

    <div style="background-color: #fff;">
      <div style="background-color: #252f3d; display: flex; padding: 20px 0; align-items: center; justify-content: center;">
        <img 
          src="${baseUrl}/static/shega-jobs-logo.png" 
          width="75" 
          height="45" 
          alt="Herani Sunday School Management System Logo"
          style="display: block;"
        >
      </div>

      <div style="padding: 25px 35px;">
        <h1 style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 20px; font-weight: bold; margin-bottom: 15px;">
          Welcome to Herani Sunday School Management System!
        </h1>
        <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin: 0 0 14px;">
          Dear ${userName},
        </p>
        <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin: 0 0 14px;">
          We're thrilled to have you join our community of ${role}. Your account has been successfully created.
        </p>
        
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin: 0; font-weight: bold; text-align: center;">
            To get started, simply log in using:
          </p>
          <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 20px; font-weight: bold; margin: 10px 0; text-align: center;">
            Login Page URL:
          </p>
          <a 
            href="${loginUrl}" 
            target="_blank" 
            style="color: #2754C5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; text-decoration: underline;"
          >
            ${loginUrl}
          </a>
          <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin: 5px 0; text-align: center;">
            Email: ${email}
          </p>
          <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin: 5px 0; text-align: center;">
            Password: Your temporary password is: ${tempPassword}. You need to change it after logging in.
          </p>
        </div>
      </div>

      <hr style="border: none; border-top: 1px solid #eee;">

      <div style="padding: 25px 35px;">
        <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin: 0;">
          Best regards,<br>Herani Sunday School Management System Team!
        </p>
      </div>
    </div>

    <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 12px; margin: 24px 0; padding: 0 20px;">
      This message was produced and distributed by Herani Sunday School Management System, Inc. © 2025, Herani Sunday School Management System, Inc. All rights reserved. View our 
      <a 
        href="https://shegajobs.com" 
        target="_blank" 
        style="color: #2754C5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 12px; text-decoration: underline;"
      >
        privacy policy
      </a>.
    </p>
  </div>
</body>
</html>
  `.trim();
}
