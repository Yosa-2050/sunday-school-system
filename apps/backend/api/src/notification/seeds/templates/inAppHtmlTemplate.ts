export function getInAppHtmlTemplate(paragraphContent: string) {
    return `
     <!DOCTYPE html>
     <html>
     <body>
            <p>${paragraphContent}</p>
    </body>
    </html> `.trim();
}
