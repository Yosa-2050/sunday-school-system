import { BadRequestException, Injectable } from "@nestjs/common";
import { IDocumentService } from "../document-service.interface";
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryImpl implements IDocumentService{

    constructor(){
      // Configuration
      cloudinary.config({ 
          cloud_name: 'duqvkhzpn', 
          api_key: '832385252238576', 
          api_secret: 'lK8JKKtDE5ymKM-n6DBUOKloAgA' // Click 'View API Keys' above to copy your API secret
      });
    }
  
    async upload(content: string): Promise<string> {
      const uploadResult = await cloudinary.uploader
        .upload(
            content, {
                resource_type: 'auto'
            }
        )
        .catch((error) => {
            throw new BadRequestException("Unable to upload your file at the moment");
        });

      return uploadResult.secure_url;
    }
  
    download(reference: string): string {
      throw new Error("Method not implemented.");
  
    }

}