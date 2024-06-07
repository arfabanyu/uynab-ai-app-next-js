import { GoogleLogin } from "@react-oauth/google";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";

export default function Auth({ setUser }) {
  const [cookie, setCookie] = useCookies(["user"]);
  return (
    <GoogleLogin
      width={20}
      text="signin"
      onSuccess={(credentialResponse) => {
        setCookie("user", credentialResponse.credential, {
          path: "/",
          expires: new Date(
            jwtDecode(credentialResponse.credential).exp * 1000
          ),
        });
        const decoded = jwtDecode(cookie.user || credentialResponse.credential);
        setUser(decoded);
      }}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
}
