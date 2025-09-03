export function getOrgRegistrationApprovedEmailTemplate() {
    return `
     <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Organization Registration Approved</title>
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
              We are pleased to inform you that your organization registration for <b>{{organizationName}}</b> on Herani Sunday School Management System has been approved. You can now manage your organization's profile and post job openings.
            </p>
            
            <div>
              <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; margin:5px, 0;  ">
               You can view your organization's profile here:
                 <a 
                href=" https://office.shega.heranitech.com/" 
                target="_blank" 
                style="color: #2754C5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px; text-decoration: underline; display: inline;"
              >
                https://office.shega.heranitech.com/
              </a>
 
              </p>
              <p style="color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 14px;  margin: 10px 0; display: inline;">
               Thank you for joining Herani Sunday School Management System. We look forward to helping you connect with top talent.
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
