import { useEffect, useRef, useState, useContext } from "react";
import { requestAnswer } from "./Utils/request_anwer.js";
import Image from "next/image.js";
import { userContext } from "./Utils/context";
import defaultpicture from "../assets/defaultuserpicture.png";
import UynabAI from "../assets/UynabAI.jpg";

function Navbar() {
  const { user } = useContext(userContext);

  return (
    <header className="bg-slate-700 p-3 flex justify-between items-center">
      <h1 className="text-white text-3xl">UynabAI</h1>
      <div className="flex flex-row-reverse gap-2 justify-center items-center cursor-pointer">
        <Image
          alt="user"
          width={40}
          height={40}
          src={user.picture || defaultpicture}
          className="rounded-full"
        />
        <p className="text-white">{user.name || "user"}</p>
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
        className="text-white text-wrap bg-slate-800 w-fit p-2 rounded-2xl rounded-tl-none"
      ></div>
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
          src={user.picture || defaultpicture}
          alt={user.name}
          className="rounded-full"
        />
        <p className="text-white">{user.name || "user"}</p>
      </div>
      <p className="text-white text-wrap bg-slate-800 w-fit p-2 rounded-2xl rounded-tr-none">
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
    requestAnswer(input.current.value, user.name, answer).then((res) =>
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
  useEffect(() => {
    alert(`
    UynabAI hanyalah situs tiruan ChatGPT, situs ini masih dalam tahap pengembangan dan banyak kekurangannya, jadi mohon dimaklumi jika terdapat typo atau keabsurdan jawaban UynabAI. Jika kamu menemukan bug, silahkan laporkan kepada Developer melalui direct message instagram atau melalui whatsapp.
    Untuk menghapus chat kamu dengan UynabAI, silahkan refresh/reload situs ini.
    Peringatan: Jika kamu keluar dari situs ini, chat kamu akan hilang!
    `);
  }, []);
  return (
    <main className="bg-slate-600 h-screen flex flex-col">
      <Navbar />
      <section
        ref={output}
        id="top"
        className="h-full overflow-y-scroll scroll-smooth"
      >
        {children.map((child) => child)}
        {children.length === 0 && (
          <h1 className="text-3xl text-opacity-25 text-white grid place-content-center h-full">
            UynabAI
          </h1>
        )}
      </section>
      <section
        id="bottom"
        className="grid w-screen max-h-64 bg-slate-700 p-2 gap-2"
      >
        <div className="flex gap-2 items-end">
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
            className="w-full rounded p-1 focus:outline-none max-h-52 overflow-y-scroll"
          />
          <button
            onClick={(e) => submit(e)}
            id="submit"
            className="bg-cyan-500 rounded p-1 text-white hover:bg-cyan-600 h-fit"
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
