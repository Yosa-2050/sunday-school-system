export function getJobPostDeclinedEmailTemplate() {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Job Application Declined</title>
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
              We regret to inform you that your job posting for the <b>{{jobTitle}}</b> position at <b>{{organizationName}}</b> has been declined.          
           </p>
            
            <div>
              <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin:5px, 0;  ">
               The reason for declining your job posting is:           
              </p>

              <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin:5px, 0;  ">
                   {{reasonForDecline}}         
              </p>
              <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px;  margin: 10px 0;">
                 Please address the above issue(s) and resubmit your job posting. If you have any questions, please contact us at <span style="color:#2754C5;">shegajobs@yopmail.com.</span>  
              </p>

              <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px;  margin: 10px 0;">
              We appreciate your interest in using Shega Jobs and hope you will be able to resolve the issue(s) and resubmit your job posting.
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
