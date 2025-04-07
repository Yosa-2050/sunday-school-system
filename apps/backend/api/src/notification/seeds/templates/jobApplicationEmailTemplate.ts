export function getJobApplicationEmailTemplate() {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Job Application</title>
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
          Dear {{jobSeekerName}},
        </p>
        <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; ">
          We appreciate your interest in the {{jobTitle}} position at {{companyName}} and for submitting your application on {{applicationDate}}.      
        </p>
        
        <div style="display: flex; flex-direction: column;">
          <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 15px;">
            <b>What happens next?</b>
          </p>

          <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin: 5px 0;">
           The hiring team at the company will review your application. If your qualifications align with their needs, they may reach out to you for the next steps, such as an interview.          
         </p>
                                 
          <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin: 0;">
            In the meantime, you can log in to your Shega Jobs account to check the status of your application or explore more opportunities.       
         </p>
         
           <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin: 5px 0;">
            We’re excited to assist you in your job search, and we’ll keep you updated on any further progress.
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
