"use client";
import { CookiesProvider, useCookies } from "react-cookie";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState, useEffect } from "react";
import { userContext } from "./Utils/context";
import { jwtDecode } from "jwt-decode";
import Interface from "./interface";
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

export default function Home() {
  const [user, setUser] = useState(null);
  const [cookie] = useCookies(["user"], { path: "/" });
  useEffect(() => {
    cookie.user && setUser(jwtDecode(cookie.user));
  }, []);

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <userContext.Provider value={{ user, setUser }}>
          <Interface />
        </userContext.Provider>
      </CookiesProvider>
    </GoogleOAuthProvider>
  );
}
