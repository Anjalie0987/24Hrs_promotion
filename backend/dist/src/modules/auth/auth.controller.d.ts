import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { SendOtpDto, VerifyOtpDto, ResetPasswordDto } from './dto/otp.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    sendSignupOtp(dto: SendOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    verifySignupOtp(dto: VerifyOtpDto): Promise<{
        verified: boolean;
    }>;
    signup(signupDto: SignupDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            isEmailVerified: boolean;
        };
    }>;
    forgotPassword(dto: SendOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            isEmailVerified: true;
            business: ({
                banners: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    originalImageUrl: string;
                    watermarkedImageUrl: string | null;
                    title: string | null;
                    businessId: string;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                category: string;
                description: string | null;
                location: string | null;
                instagram: string | null;
                whatsapp: string | null;
                logoUrl: string | null;
                bannerUrl: string | null;
                trustScore: number;
                website: string | null;
                isVerified: boolean;
                city: string | null;
                state: string | null;
                isAvailable: boolean;
                userId: string;
            }) | null;
        };
    }>;
}
