export function getJobPostApprovedEmailTemplate() {
    return `
     <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Job Application Approved</title>
    </head>
    <body style="background-color: #fff; color: #212121; margin: 0; padding: 0;">
      <div style="padding: 20px; margin: 0 auto; background-color: #eee;">
         
        <div style="background-color: #fff;">
          <div style="background-color: #3496aa; display: flex; padding: 20px 0; align-items: center; justify-content: center;">
            <h1 style="color: #FFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 30px; font-weight: bold;">
              Shega Jobs
            </h1>
          </div>
    
          <div style="padding: 25px 35px;">
            <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin: 0 0 14px;">
              Dear {{employerName}},
            </p>
            <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin: 0 0 14px;">
              We are pleased to inform you that your job posting for the position of <b>{{jobTitle}}</b> at <b>{{organizationName}}</b> has been approved and is now live on Shega Jobs.
            </p>
            
            <div>
              <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin:5px, 0;  ">
               You can view your job posting here:
                 <a 
                href="https://office.shega.heranitech.com/" 
                target="_blank" 
                style="color: #2754C5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; text-decoration: underline; display: inline;"
              >
               https://office.shega.heranitech.com/
              </a>
 
              </p>
              <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px;  margin: 10px 0; display: inline;">
               Thank you for using Shega Jobs to find your next great hire. We wish you success in your recruitment efforts.
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
