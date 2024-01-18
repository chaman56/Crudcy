"use client"

import { Suspense, useEffect } from "react"

import problems from "@utils/problems"
import { notFound } from "next/navigation";
import IDE from "@components/IDE";
import '@styles/codeforces.css';



export default function page({params}) {
  if(!problems[params.pid])
    return notFound();

  const problem = {__html: problems[params.pid].problem};
  


  useEffect(() => {
    const container = document.getElementById("container");
    const y = container.offsetTop;
    container.style.height = `calc(100vh - ${y}px)`;
    container.style.minHeight = `calc(100vh - ${y}px)`;
    const elms = document.getElementsByTagName("nobr");
        for (let i = 0; i < elms.length; i++) {
            console.log(elms[i].hidden = true)
        }
  }, []);

  return (
    <div id="container">
      <div className=" md:grid md:grid-cols-2 h-full dark:bg-zinc-800">
        <div className=" md:h-full px-1 md:overflow-y-auto border-r border-gray-200">
          <div dangerouslySetInnerHTML={problem} />
        </div>
        <div className=" h-full border md:border-none">
          <IDE />
        </div>
      </div>
    </div>
  )
}