import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const Login = () => {
  return (
    <div style={{ margin: "20px" }}>
      <h3>Login with Google</h3>

      <GoogleLogin
        onSuccess={(credentialResponse) => {
          const user = jwtDecode(credentialResponse.credential);

          localStorage.setItem("user", JSON.stringify(user));

          alert("Login Successful");
          window.location.reload();
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
};

export default Login;