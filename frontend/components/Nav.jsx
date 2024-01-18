"use client"

import React from 'react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const Nav = () => {
  const [isDark, setisDark] = useState();
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark' || !localStorage.getItem('theme')) {
      document.documentElement.classList.add('dark')
      setisDark(true)
    } else {
      setisDark(false)
      document.documentElement.classList.remove('dark')
    }
  },[])
  
  const setTheme = () =>{
    setisDark(!isDark);
    if (!isDark){
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add('dark')
    } else {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove('dark')
    }
  }
  return (
    <header className='p-1 w-full align-middle bg-slate-50 dark:bg-slate-950 dark:text-white'>
        <nav className="flex justify-between items-center flex-nowrap px-5 py-2 ">
            <Link href="/"><div className='logo  rounded bg-gradient-to-r from-violet-500 to-fuchsia-500 p-1 whitespace-nowrap text-white'>Crudcy</div></Link>
            <div className='navitems flex flex-nowrap gap-x-4'>
                <button onClick={() => setTheme('light')}>{isDark?<img src='/themes.png' width={30}/>:<img src='/theme.png' width={30}/>}</button>
                <Link href="/">Home</Link>
                <Link href="/practice">Practice</Link>
                <Link href="/compete">Compete</Link>
                <Link href="/ide">IDE</Link>
                <Link href="/auth/login">Login</Link>
                <Link href="/user">User</Link>
            </div>
        </nav>
    </header>
  )
}

export default Nav