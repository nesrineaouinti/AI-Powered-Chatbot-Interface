import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

interface GoogleLoginButtonProps {
  onSuccess: (token: string) => void;
  onError: () => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
}

export const GoogleLoginButton = ({ 
  onSuccess, 
  onError,
  text = 'signin_with' 
}: GoogleLoginButtonProps) => {
  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      onSuccess(credentialResponse.credential);
    } else {
      onError();
    }
  };

  const handleError = () => {
    console.error('Google Login Failed');
    onError();
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        text={text}
        size="large"
        width="100%"
        theme="outline"
        shape="rectangular"
      />
    </div>
  );
};

export default GoogleLoginButton;
