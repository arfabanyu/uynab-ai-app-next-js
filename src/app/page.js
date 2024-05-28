"use client";
import Interface from "./interface";
import { useState, useContext, useEffect } from "react";
import { userContext } from "./Utils/context";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Auth from "./auth";
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
import { CookiesProvider, useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";

export default function Home() {
  const [user, setUser] = useState(null);
  const [cookie, setCookie, removeCookie] = useCookies(["user"], { path: "/" });
  useEffect(() => {
    cookie.user && setUser(jwtDecode(cookie.user));
  }, []);

  if (!user) {
    return (
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
          <section className="w-screen h-screen bg-slate-500 flex items-center justify-center">
            <fieldset className="w-2/3 h-1/3 bg-slate-700 flex flex-col items-center pt-12 gap-5 rounded">
              <h1 className="text-white text-3xl">Login</h1>
              <Auth user={user} setUser={setUser} />
            </fieldset>
          </section>
        </CookiesProvider>
      </GoogleOAuthProvider>
    );
  }

  return (
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <userContext.Provider value={{ user, setUser }}>
        <Interface />
      </userContext.Provider>
    </CookiesProvider>
  );
}
