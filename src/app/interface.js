"use client";
import { useEffect, useRef, useState, useContext } from "react";
import { requestAnswer } from "./Utils/request_anwer.js";
import { userContext } from "./Utils/context";
import defaultpicture from "../assets/defaultuserpicture.png";
import UynabAI from "../assets/UynabAI.jpg";
import Image from "next/image.js";
import Auth from "./auth.js";
import { useCookies } from "react-cookie";

function Navbar() {
  const [cookies, setCookie, removeCookies] = useCookies(["user"]);
  const { user, setUser } = useContext(userContext);

  function logout() {
    removeCookies("user");
    setUser(null);
  }

  return (
    <header className="bg-[#222831] p-3 flex justify-between items-center">
      <h1 className="text-[#eeeeee] text-3xl">UynabAI</h1>
      <div className="flex gap-2">
        <div className="flex flex-row-reverse gap-2 justify-center items-center cursor-pointer">
          <Image
            alt="user"
            width={40}
            height={40}
            src={user?.picture || defaultpicture}
            className="rounded-full"
          />
          <p className="text-white">{user?.name || "user"}</p>
        </div>
        {user?.name ? (
          <button className="text-white" onClick={logout}>
            Logout
          </button>
        ) : (
          <Auth user={user} setUser={setUser} />
        )}
      </div>
    </header>
  );
}

function TextAnswer({ answer }) {
  const bubbleAnswer = useRef(null);

  useEffect(() => {
    bubbleAnswer.current.innerHTML = answer
      .replace(/\n/g, "<br />")
      .replace(/```(.*?)```/gs, (_, code) => {
        return `<pre style="background-color: #000; padding: 10px; border-radius: 5px; border: 1px solid #000; overflow: auto"><code style="font-family: monospace; color: #fff; padding: 2px 4px; border-radius: 3px;">${code}</code></pre>`;
      })
      .replace(/\*\*(.*?)\*\*/gs, (_, bold) => {
        return `<strong>${bold}</strong>`;
      })
      .replace(/\*(.*?)\*/gs, (_, italic) => {
        return `<em>${italic}</em>`;
      });
  }, [bubbleAnswer]);

  return (
    <div className="p-5 grid gap-2 h-fit w-full overflow-hidden pr-16">
      <div className="flex gap-2 items-center">
        <Image
          width={40}
          height={40}
          src={UynabAI}
          alt="UynabAI"
          className="rounded-full"
        />
        <p className="text-white">UynabAI</p>
      </div>
      <div
        ref={bubbleAnswer}
        className="text-white text-wrap bg-[#222831] w-fit p-2 rounded rounded-tl-none"
      ></div>
      <button
        onClick={() =>
          navigator.clipboard.writeText(answer).then(() => alert("Text copied"))
        }
        className="bg-[#00adb5] text-white w-fit p-2 rounded rounded-tl-none hover:bg-slate-300"
      >
        copy
      </button>
    </div>
  );
}

function TextQuestion({ question }) {
  const { user } = useContext(userContext);

  return (
    <div className="p-5 pl-16 grid gap-2 h-fit w-full overflow-hidden break-words place-items-end">
      <div className="flex flex-row-reverse gap-2 items-center">
        <Image
          width={40}
          height={40}
          src={user?.picture || defaultpicture}
          alt={user?.name}
          className="rounded-full"
        />
        <p className="text-white">{user?.name || "user"}</p>
      </div>
      <p className="text-white text-wrap bg-[#222831] w-fit p-2 rounded rounded-tr-none">
        {question}
      </p>
    </div>
  );
}

export default function Interface() {
  const input = useRef(null);
  const output = useRef(null);
  const [answer, setAnswer] = useState(null);
  const [children, setChildren] = useState([]);
  const { user } = useContext(userContext);
  function submit(e) {
    e.preventDefault();

    if (input.current.value === "") return;
    setChildren((children) => [
      ...children,
      <TextQuestion key={input.current.value} question={input.current.value} />,
    ]);
    requestAnswer(input.current.value).then((res) =>
      setAnswer(res)
    );
  }

  useEffect(() => {
    input.current.value = "";
    if (answer === null) return;

    setChildren((children) => [
      ...children,
      <TextAnswer key={answer} answer={answer} />,
    ]);
    setTimeout(() => {
      output.current.scrollTop = output.current.scrollHeight;
    }, 1000);
  }, [answer]);

  return (
    <main className="bg-[#393e46] h-screen flex flex-col">
      <Navbar />
      <section
        ref={output}
        id="top"
        className="h-full overflow-y-scroll scroll-smooth"
      >
        {children.map((child) => child)}
        {children.length === 0 && (
          <div className="flex items-center justify-center flex-col h-full opacity-50">
            <Image
              src={UynabAI}
              alt="UynabAI"
              width={100}
              height={100}
              className="rounded-full border"
            />
            <h1 className="text-3xl text-opacity-50 text-white">UynabAI</h1>
          </div>
        )}
      </section>
      <section
        id="bottom"
        className="grid w-screen max-h-64 bg-[#222831] p-2 gap-2"
      >
        <div className="flex gap-2 items-center">
          <textarea
            ref={input}
            id="content"
            rows={1}
            onKeyDown={(e) => {
              setTimeout(() => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }, 0);
            }}
            placeholder="Tanya UynabAI"
            className="w-full rounded p-2 focus:outline-none max-h-52 overflow-y-scroll"
          />
          <button
            onClick={(e) => submit(e)}
            id="submit"
            className="bg-[#00adb5] rounded p-2 text-[#eeeeee] hover:bg-cyan-600 h-fit"
          >
            Submit
          </button>
        </div>
        <footer className="text-white text-center">
          made with 💖 by <a href="https://www.instagram.com/nyu_arfx">Dev</a>
        </footer>
      </section>
    </main>
  );
}
