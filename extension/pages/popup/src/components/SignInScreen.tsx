import React from 'react';

const GOOGLE_AUTH_URL =
  'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.readonly%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&prompt=consent&response_type=code&client_id=151365768446-n8mbnueelsr4pi71pgut141olc464ira.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fgoogle%2Fcallback&service=lso&o2v=2&flowName=GeneralOAuthFlow'; // Replace with your actual OAuth URL

const SignInScreen: React.FC = () => {
  const handleSignIn = () => {
    window.open(GOOGLE_AUTH_URL, '_blank');
  };

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
      <img src="https://placehold.co/120x44" alt="Logo" className="mb-8 h-9 w-24" />
      <h2 className="mb-6 max-w-xs text-center text-xl font-bold">Sign in to track your job applications</h2>
      <button
        onClick={handleSignIn}
        className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 text-base text-white shadow hover:bg-blue-600">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
          alt="Google"
          className="h-5 w-5"
        />
        Sign in with Google
      </button>
    </div>
  );
};

export default SignInScreen;
