import React from 'react'
import Link from 'next/link'
import { space } from 'postcss/lib/list'

const Practice = () => {
  
  return (
    <div className='practice-container w-full flex justify-center dark:bg-gray-900 dark:text-white  min-h-screen '>
      <div className=' w-11/12 md:w-10/12 lg:w-9/12 max-w-7xl'>
        <div className=" practice-links grid gap-2 lg:max-w-5xl p-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div href="/" className=' dark:bg-slate-800'>
            <div className='boxes'>
              Backend Apis
            </div>
          </div>
          <div href="/">
            <div className='boxes'>
              Devops
            </div>
          </div>
          <Link href="/practice/problems" className=' dark:bg-slate-800'>
            <div className='boxes'>
              DSA
            </div>
          </Link>
          <div href="/">
            <div className='boxes'>
              Data Science
            </div>
          </div>
          <div href="/">
            <div className='boxes'>
              ML/AI
            </div>
          </div>
          <div href="/">
            <div className='boxes'>
              DBMS(SQL)
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Practice