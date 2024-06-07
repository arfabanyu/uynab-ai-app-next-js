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
    alert(`
      UynabAI hanyalah situs tiruan ChatGPT, situs ini masih dalam tahap pengembangan dan banyak kekurangannya, jadi mohon dimaklumi jika terdapat typo atau keabsurdan jawaban UynabAI. Jika kamu menemukan bug, silahkan laporkan kepada Developer melalui direct message instagram atau melalui whatsapp. Untuk menghapus chat kamu dengan UynabAI, silahkan refresh/reload situs ini.
      Peringatan: Jika kamu keluar dari situs ini, chat kamu akan hilang!
      `);
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
