"use client"

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Editor from '@monaco-editor/react';
import $ from 'jquery';

const initialvalue = {
  'cpp' : `#include<iostream>\nusing namespace std;\n\nint main(){\n\t\n\treturn 0;\n}`,
  'c': `#include <stdio.h>\n\nint main(void) {\n\t\n\treturn 0;\n}`,
  'python' : `#Your code goes here...\n`,
  'java' : `import java.util.Scanner;\n\npublic class Main{\n\tpublic static void main(String[] args){\n\t\t\n\t}\n}`
}

const initialFilesdummy = {
  "script.py": {
    name: "script.py",
    language: "python",
    value: "# Your codes here...\n",
  },
  "script.cpp": {
    name: "script.cpp",
    language: "cpp",
    value: initialvalue['cpp'],
  },
};
const IDE = ({url}) => {
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [theme, setTheme] = useState();
  const [isConsole, setisConsole] = useState();
  const [executionTime, setexecutionTime] = useState();
  const [passed, setpassed] = useState();
  const editorRef = useRef();

  function handleMount(editor, monaco) {
    editorRef.current = editor;
  }

  useEffect(() => {
    setSelectedLanguage("cpp");
    $(".codepan").css({minHeight:"100%"})
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setTheme('vs-dark')
        } else {
          setTheme('vs-light')
        }
      }
  }, []);

  useEffect(() => {
    if (isConsole) {
      $("#runcode").height("40%");
      $("#runcode #terminal").show();
      $("#showcode").text("Hide");
      $('#inputbutton').show();
      $('#outputbutton').show();
      $("#runcode #outputs").hide();
      $('#codeEditor').height("calc(100% - 40% - 35px)");
    } else {
      $('#runcode').height("34px");
      $('#runcode #terminal').hide();
      $('#showcode').text("Show");
      $('#inputbutton').hide();
      $('#outputbutton').hide();
      $('#codeEditor').height("calc(100% - 50px)");
    }
  }, [isConsole]);

  const runCode = async () => {
    setisConsole(true);
    $("#runcode #inputs").hide();
    $("#runcode #outputs").show();
    $("#runcode #outputs #output").empty().append("<span>Running...</span>");
    const language = selectedLanguage;

    $.post(
      `http://localhost:5500/run/${language}`,
      {
        code: editorRef.current.getValue(),
        input: $("#runcode #inputs #input").val(),
        language: selectedLanguage,
        filename: selectedLanguage,
      },
      function (data) {
        console.log(data);
        let res = document.createElement("pre");
        res.id = "response";
        if (data.error) {
          setpassed(false);
          res.innerHTML = data.error;
          res.className = "resultantError";
        } else {
          setpassed(true);
          setexecutionTime((data.executionTime/1000.0).toFixed(3));
          res.innerHTML = data.output;
          res.className = "resultantOutput";
        }
        console.log(res);
        $("#runcode #outputs #output").empty().append(res);
      },
    );
  };

  const submitCode = async () => {
    setisConsole(true);
    $("#runcode #inputs").hide();
    $("#runcode #outputs").show();
    $("#runcode #outputs #output").empty().append("<span>Submission Queued...</span>");
    const language = selectedLanguage;

    $.post(
      `http://localhost:5500/submit`,
      {
        code: editorRef.current.getValue(),
        input: $("#runcode #inputs #input").val(),
        language: selectedLanguage,
        filename: selectedLanguage,
      },
      function (data) {
        console.log(data);
        let res = document.createElement("pre");
        res.id = "response";
        if (data.error) {
          setpassed(false);
          res.innerHTML = data.error;
          res.className = "resultantError";
        } else {
          setpassed(true);
          setexecutionTime((data.executionTime/1000.0).toFixed(3));
          res.innerHTML = data.output;
          res.className = "resultantOutput";
        }
        $("#runcode #outputs #output").empty().append(res);
      }
    );
  };

  return (
    <div className='codepan h-full relative bg-white rounded border dark:border-none border-gray-200 dark:bg-gray-900'>
          <div className='bar h-10 border-b-2 border-gray-200 dark:border-none flex justify-between items-center px-3'>
            
            <div className='flex items-center gap-2'>
              <select
                id="languageSelect"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="rounded p-1 bg-slate-100 dark:bg-slate-500 focus:outline-none focus:ring-1">

                <option value="cpp">c++</option>
                <option value="c">c</option>
                <option value="python">python</option>
                <option value="java">java</option>
              </select>
              <div><button onClick={runCode} className=' flex items-center gap-2 px-1 rounded border bg-blue-200 dark:bg-blue-950'> <img src='/play.png' height={20} width={20} /> Run</button></div>
            </div>
          </div>
          <div id='codeEditor' className='codeEditor'>
            <Editor
              width="100%"
              height="100%"
              theme={theme}
              onMount={handleMount}
              path={url}
              defaultLanguage={selectedLanguage}
              defaultValue={initialvalue[selectedLanguage]}
            />
          </div>
          <div id='runcode' className='absolute bottom-0 dark:bg-gray-900 dark:text-white border-r border-gray-300 dark:border-gray-700' style={{width: "calc(100% - 13px)"}}>
            <div id='terminal' className='terminal flex gap-1 px-2 bg-slate-100 dark:bg-gray-900  border-t border-gray-100 dark:border-gray-700 overflow-y-auto overflow-x-auto' style={{"height":"calc(100% - 36px)"}}>
              <div id='inputs' className='flex-1'>
                Input
                <textarea
                  id='input'
                  name='input'
                  placeholder='Custom inputs...'
                  rows='7'
                  cols='10'
                  className='w-full p-2 dark:bg-gray-700'
                ></textarea>
              </div>
              <div id='outputs' className='output flex-1 dark:bg-gray-900'>
                <div className='flex flex-nowrap gap-3 items-center'>
                  <span>Outputs</span>
                  {passed===true && <><span><img src='/check.png' width={20} height={20} /></span>
                  <span>  Time : <span id='executiontimeins'>{executionTime}</span> s.</span></>}
                  {passed===false && <span><img src='/remove.png' width={20} height={20} /></span>}
                </div>
                <div id='output'
                  className=' p-2 outline-none h-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-800'
                  style={{height : "calc(100% - 30px)"}}
                ><span className=' text-gray-400'>Your outputs goes here....</span></div>
              </div>
            </div>
            <div className=' bg-white dark:bg-gray-900 h-8 flex justify-between gap-1'>
              <div className='flex'>
                <button className='p-1 border border-gray-200 dark:border-gray-700 rounded-t-lg' onClick={() => { setisConsole(!isConsole); }}><span id='showcode'></span>Console</button>
                <button id='inputbutton' className=' p-1 border border-gray-200 dark:border-gray-700 rounded-t-lg' onClick={() => { $("#runcode #outputs").hide(); $("#runcode #inputs").show(); }}>Input</button>
                <button id='outputbutton' className=' p-1 border border-gray-200 dark:border-gray-700 rounded-t-lg' onClick={() => { $("#runcode #inputs").hide(); $("#runcode #outputs").show(); }}>Output</button>
              </div>
              <div className='flex gap-4'>
                <button onClick={runCode} className=' flex items-center gap-2 px-1 rounded border bg-blue-200 dark:bg-blue-950'> <img src='/play.png' height={20} width={20} /> Run</button>
                <button onClick={submitCode} className=' flex items-center gap-2 px-1 rounded border bg-green-500  dark:bg-green-500'> Submit</button>
              </div>
            </div>
          </div>
        </div>
  )
}

export default IDE