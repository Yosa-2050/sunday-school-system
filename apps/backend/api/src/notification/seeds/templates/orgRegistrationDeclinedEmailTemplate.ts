export function getOrgRegistrationDeclinedEmailTemplate() {
    return `
     <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Organization Registraction Declined</title>
    </head>
    <body style="background-color: #fff; color: #212121; margin: 0; padding: 0;">
      <div style="padding: 20px; margin: 0 auto; background-color: #eee;">
         
        <div style="background-color: #fff;">
          <div style="background-color: #3496aa; display: flex; padding: 20px 0; align-items: center; justify-content: center;">
            <h1 style="color: #FFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 30px; font-weight: bold;">
              Herani Sunday School Management System
            </h1>
          </div>
    
          <div style="padding: 25px 35px;">
            <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin: 0 0 14px;">
              Dear {{contactPerson}},
            </p>
            <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin: 0 0 14px;">
              We regret to inform you that your organization registration for <b>{{organizationName}}</b> on Herani Sunday School Management System has been declined.          
           </p>
            
            <div>
              <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin:5px, 0;  ">
               The reason for declining your registration is:           
              </p>

              <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin:5px, 0;  ">
                   {{reasonForDecline}}         
              </p>
              <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px;  margin: 10px 0;">
                 Please address the above issue(s) and resubmit your organization registration. If you have any questions, please contact us at <span style="color:#2754C5;">shegajobs@yopmail.com.</span>  
              </p>

              <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px;  margin: 10px 0;">
              We appreciate your interest in using Herani Sunday School Management System and hope you will be able to resolve the issue(s) and resubmit your application.
              </p>        
            </div>
          </div>
    
          <div style="padding: 25px 35px;">
            <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin: 0;">
              Best regards,<br>Herani Sunday School Management System Team
            </p>
          </div>
        </div>
    
        <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 12px; margin: 24px 0; padding: 0 20px;">
          This message was produced and distributed by Herani Sunday School Management System. © 2025, Herani Sunday School Management System. All rights reserved.</p>
      </div>
    </body>
    </html>`.trim();
}
