import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }

    async comparePasswords(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    }

    generatePassword(length = 12): string {
        const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';
        
        const allChars = upperCase + lowerCase + numbers + specialChars;
      
        function getRandomChar(charSet: string): string {
          return charSet[Math.floor(Math.random() * charSet.length)];
        }
      
        const password = [
          getRandomChar(upperCase), // At least one uppercase letter
          getRandomChar(lowerCase), // At least one lowercase letter
          getRandomChar(numbers),   // At least one number
          getRandomChar(specialChars) // At least one special char
        ];
      
        // Fill the rest of the password length randomly
        for (let i = 4; i < length; i++) {
          password.push(getRandomChar(allChars));
        }
      
        // Shuffle to prevent predictable patterns
        return password.sort(() => Math.random() - 0.5).join('');
      }
}
