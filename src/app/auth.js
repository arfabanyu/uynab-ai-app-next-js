import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";

export default function Auth({ user, setUser }) {
  const [cookie, setCookie] = useCookies(["user"]);
  return (
    <GoogleLogin
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
