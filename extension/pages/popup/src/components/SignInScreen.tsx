import React from 'react';
import { Button } from './button';

const GOOGLE_AUTH_URL =
  'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.readonly%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&prompt=consent&response_type=code&client_id=151365768446-n8mbnueelsr4pi71pgut141olc464ira.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fgoogle%2Fcallback&service=lso&o2v=2&flowName=GeneralOAuthFlow'; // Replace with your actual OAuth URL

const SignInScreen: React.FC = () => {
  const handleSignIn = () => {
    window.open(GOOGLE_AUTH_URL, '_blank');
  };

  return (
    <div className="flex flex-col min-h-[600px] max-h-[600px] w-full max-w-[400px] sm:max-w-[800px] items-start relative overflow-hidden">
      <div className="relative self-stretch w-full h-[50px] sm:h-[70px] bg-[#111111]" />

      <div className="flex-col flex-1 items-center gap-6 sm:gap-12 p-4 sm:p-6 bg-[#111111] flex relative self-stretch w-full overflow-y-auto">
        <img
          className="relative w-full max-w-[300px] sm:max-w-[485px] h-auto"
          alt="Jobtrax"
          src="/popup/jobtrax.png"
        />

        <img
          className="relative w-48 h-48 sm:w-64 sm:h-64 object-cover"
          alt="Image"
          src="/popup/image5.png"
        />

        <div className="relative self-stretch [font-family:'Press_Start_2P',Helvetica] font-normal text-[#b6b3b3] text-sm sm:text-xl text-center tracking-[0] leading-[18px] sm:leading-[24.0px] px-2">
          Easily track all your job applications simple like a game!
        </div>

        <div className="flex-col items-start gap-6 flex-[0_0_auto] flex relative self-stretch w-full">
          <Button onClick={handleSignIn} className="items-center justify-center gap-2.5 px-6 py-4 flex-[0_0_auto] bg-[#03e2f6] rounded-2xl flex relative self-stretch w-full h-auto hover:bg-[#03e2f6]/90">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Press_Start_2P',Helvetica] font-normal text-[#0d0404] text-base sm:text-xl tracking-[0] leading-[18px] sm:leading-[21.6px] whitespace-nowrap">
              Connect to Gmail
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignInScreen;
