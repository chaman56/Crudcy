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

function Page() {
  const [filename, setFilename] = useState("script.cpp");
  let [initialFiles, setinitialFiles] = useState(initialFilesdummy);
  const [isRunCode, setIsRunCode] = useState(true);
  const [filesArray, setFilesArray] = useState(Object.keys(initialFiles));
  let [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [isEditVisible, setisEditVisible] = useState(false);
  const [mousePos, setmousePos] = useState({x:0,y:0});
  const [passed, setpassed] = useState(null);
  const [issidepan, setissidepan] = useState();
  const [theme, setTheme] = useState();
  const editorRef = useRef(null);
  const [executionTime, setexecutionTime] = useState();

  function handleMount(editor, monaco) {
    editorRef.current = editor;
  }

 
  

  //The output and inputs field are hidden by default
  useEffect(() => {
    $('#terminal').hide();
    $('#inputbutton').hide();
    $('#outputbutton').hide();
    if(($("#output2").is(":visible")))
    setIsRunCode(false);
    $('#inputs').hide();
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          setTheme('vs-dark')
      } else {
        setTheme('vs-light')
      }
    }
  }, []);


  // set the height of code editor to fit perfectly
  useEffect(() => {
    const container = document.getElementById("container");
    const y = container.offsetTop;
    container.style.height = `calc(100vh - ${y}px)`;
    container.style.minHeight = `calc(100vh - ${y}px)`;
    $("#output2").css({minHeight:"100%"})
    $(".sidepan").css({minHeight:"100%"})
    $(".codepan").css({minHeight:"100%"})
    $("#filename").hide();
  }, []);

  useEffect(() => {
    setSelectedLanguage(initialFiles[filename].language);
    let filesList = document.querySelectorAll(".files");
    if (filesList.length > 0) {
        filesList.forEach(element => {
            element.classList.remove("bg-gray-200");
        });
    }
    const fileElement = document.getElementById(filename);
    if (fileElement) {
        fileElement.classList.add("bg-gray-200");
    }
  }, [filename]);


  const fileRef = useRef();
  const createfile = useRef();

  //create and save files , hide and show filename input field 
  useEffect(() => {
    const handleEnterKey = (e) => {
      let name = $('#filename').val();
      if (e.keyCode === 13 && name !== '') {
        let extension = name.split('.')[1];
        if(!extension){
          $('#output2').append(`<p style="color:red;">> Please Specify the extension!</p>`)
        }else if(!((extension==='py'?'python':extension) in initialvalue)){
          $('#output2').append(`<p style="color:red;">> The exetension is not supported!</p>`)
        }
        else{
          let lang = extension.trim();
          if(lang === 'py')lang = 'python';
          $("#output2").append(`<p style="color:blue;">> Created file '${name}'.</p>`)
          let newFile = {
            name: $('#filename').val(),
            language: lang,
            value: initialvalue[lang],
          }
          initialFiles[newFile.name] = newFile;
          setinitialFiles(initialFiles);
          setFilesArray([...filesArray, newFile.name]);
          $('#filename').hide();
          $('#filename').val('');
          setFilename(newFile.name);
        }
      }
    };

    $('#filename').on('keydown', handleEnterKey);

    const handleClickOutside = (e) => {
      if (fileRef.current && !fileRef.current.contains(e.target) && !createfile.current.contains(e.target)) {
        if ($('#filename').val() !== '') {
          let name = $('#filename').val();
          let extension = name.split('.')[1];
          if(!extension){
            $('#output2').append(`<p style="color:red;">>Please Specify the extension!</p>`)
          }else if(!(extension in initialvalue)){
            $('#output2').append(`<p style="color:red;">>The exetension is not supported!</p>`)
          }
          else{
            let lang = extension.trim();
            if(lang === 'py')lang = 'python';
            $("#output2").append(`<p style="color:blue;">>Created file '${name}'.</p>`)
            let newFile = {
              name: $('#filename').val(),
              language: lang,
              value: initialvalue[lang],
            }
            initialFiles[newFile.name] = newFile;
            setinitialFiles(initialFiles);
            setFilesArray([...filesArray, newFile.name]);
            $('#filename').val('');
            setFilename(newFile.name);
          }
        }
        $('#filename').hide();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      $('#filename').off('keydown', handleEnterKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filesArray,selectedLanguage]);


  //toggle the visibility of the input and output menu
  useEffect(() => {
    if (isRunCode) {
      $("#runcode").height("40%");
      $("#terminal").show();
      $("#showcode").text("Hide");
      $('#inputbutton').show();
      $('#outputbutton').show();
      $('#codeEditor').height("calc(100% - 40% - 35px)");
    } else {
      $('#runcode').height("34px");
      $('#terminal').hide();
      $('#showcode').text("Show");
      $('#inputbutton').hide();
      $('#outputbutton').hide();
      $('#codeEditor').height("calc(100% - 50px)");
    }
    $('#filename').on('keydown', (e) => {
      if (e.keyCode === 13 && $('#filename').val() !== '') {
        $('#filename').hide();
      }
    });
  }, [isRunCode]);


  const editFile = (e)=>{
    setisEditVisible(true);
    e.preventDefault();
    setmousePos({x:e.clientX , y:e.clientY})
  }
  useEffect(()=>{
    function handleClickOutside(e){
      if (!e.target.closest('#filename')) 
        setisEditVisible(false);  
    }
    document.addEventListener('mousedown', handleClickOutside)
    return ()=>{
      document.removeEventListener('mousedown', handleClickOutside)
    }
  },[isEditVisible])


  const runCode = async () => {
    if(!($("#output2").is(":visible")))
    setIsRunCode(true);
    $("#inputs").hide();
    $("#outputs").show();
    $("#output").empty().append("<span>Running...</span>");
    const language = selectedLanguage;

    $.post(
      `http://localhost:5500/run/${language}`,
      {
        code: editorRef.current.getValue(),
        input: $("#input").val(),
        language: selectedLanguage,
        filename: filename,
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
          $("#output2").append(`<p class="executiontime">Time : <span >${data.executionTime}</span> ms </p>`);
        }
        let resCopy = res.cloneNode(true);
        $("#output2").append(res);
        $("#output").empty().append(resCopy);
      }
    );
  };

  return (
    <div id='container' className='w-full pb-1 dark:bg-slate-900'>
      <div className='wrapper min-h-full flex w-full'>
        <div className='sidepan p-1 bg-slate-50 border dark:border-none mr-1 rounded dark:bg-zinc-800 dark:text-white'>
          <div id='options' className='flex justify-between border-b-2 border-l-amber-50 pb-1'>
            <div className='flex items-center gap-2'>
              <div><img src='arrow-down.png' width={10} /></div>
              <div>Files</div>
            </div>
            <button onClick={(e) => { 
              if(!$("filename").is(':visible')) {
              $("#filename").show().focus();}
            }} ref={createfile}
             className='px-2 rounded-sm rounded-tl-lg'>
              <img src='add.png' width={20} />
            </button>
          </div>
          <div id="files" className='max-w-full box-border relative'>
            <input
              id='filename'
              className='rounded p-1 max-w-full bg-slate-100 dark:bg-slate-600 focus:outline-none focus:ring-1'
              type='text'
              ref={fileRef}
            />
            {filesArray.map((file) => (
              <div
                onClick={(e) => {if(!$(e.target).closest($("#editbuttondots")).length)setFilename(file)}}
                key={file}
                id={file}
                className=' files flex justify-between whitespace-nowrap gap-1 items-center cursor-pointer bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-1 rounded m-1'
              >
                <div className='flex gap-1 items-center whitespace-nowrap overflow-hidden'>
                  <img src='file.png' height={10} width={13} />
                  <div>{file}</div>
                </div>
                <button id='editbuttondots' onClick={(e)=>{editFile(e)}} className='p-1 min-w-fit hover:bg-slate-100 dark:hover:bg-slate-500 rounded'><img src='dots.png' height={15} width={15} /></button>
              </div>
            ))}
          </div>
        </div>
        <div className='codepan flex-1 relative bg-white rounded border dark:border-none border-gray-200 dark:bg-gray-900'>
          <div className='bar h-10 border-b-2 border-gray-200 dark:border-none flex justify-between items-center px-3'>
            <div className='flex items-center gap-1'>
              <button onClick={()=>{setissidepan(!issidepan)}} className=' bg-blue-300 px-1 rounded mr-2'> {'>>'} </button>
              <div className=' bg-slate-200 dark:bg-slate-600 px-1'>{filename}</div>
            </div>
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
              path={initialFiles[filename].name}
              defaultLanguage={initialFiles[filename].language}
              defaultValue={initialFiles[filename].value}
            />
          </div>
          <div id='runcode' className='absolute bottom-0 dark:bg-gray-900 dark:text-white border-r border-gray-300 dark:border-gray-700' style={{width: "calc(100% - 13px)"}}>
            <div className=' bg-white dark:bg-gray-900 h-8 flex gap-1'>
              <button id='showcode' className='p-1 border border-gray-200 dark:border-gray-700 rounded-t-lg' onClick={() => { setIsRunCode(!isRunCode); }}>show</button>
              <button id='inputbutton' className=' p-1 border border-gray-200 dark:border-gray-700 rounded-t-lg' onClick={() => { $("#outputs").hide(); $("#inputs").show(); }}>Input</button>
              <button id='outputbutton' className=' p-1 border border-gray-200 dark:border-gray-700 rounded-t-lg' onClick={() => { $("#inputs").hide(); $("#outputs").show(); }}>Output</button>
            </div>
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
                  {passed===true && <><span><img src='check.png' width={20} height={20} /></span>
                  <span>  Time : <span id='executiontimeins'>{executionTime}</span> s.</span></>}
                  {passed===false && <span><img src='remove.png' width={20} height={20} /></span>}
                </div>
                <div id='output'
                  className=' p-2 outline-none h-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-800'
                  style={{height : "calc(100% - 30px)"}}
                ><span className=' text-gray-400'>Your outputs goes here....</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className=' cursor-col-resize w-2 h-full'></div>
          <div className='outpan bg-white dark:bg-zinc-950 flex-1 hidden md:block h-full flex-col border border-grau-100 rounded dark:border-none overflow-hidden'>
            <div className=' border-b px-2 border-gray-200  dark:text-white'>Output</div>
            <div style={{ height: "calc(100% - 35px)" }}>
              <div
                id='output2'
                className='w-full p-2 outline-none h-full'
                style={{ overflowY: "auto" }}
              ></div>
            </div>
          </div>
      </div>
      {isEditVisible &&
      <div id='editfile' className="absolute p-2 w-32  bg-white dark:bg-slate-500 border  border-gray-300 rounded-md shadow-xl shadow-zinc-200 dark:shadow-slate-900" style={{"top":mousePos.y+'px', "left":mousePos.x+'px'}}>
        <div className='flex flex-nowrap hover:bg-slate-200 cursor-pointer rounded p-1 gap-2 items-center'><img src='edit.png' width={20} height={20} /> Rename</div>
        <div className='flex flex-nowrap hover:bg-slate-200 cursor-pointer rounded p-1 gap-2 items-center'> <img src='delete.png' width={20} height={20} /> Delete </div>
      </div>}
    </div>
    
  );
}

export default Page;
