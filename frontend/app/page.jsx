import Image from 'next/image'
import Link from 'next/link'


export default function Home() {
  return (
    <main className=' min-h-screen flex justify-center w-full bg-slate-200 dark:bg-slate-900'>
      <div className=" flex-col items-center justify-center text-center pt-9 w-10/12">
        <h1 className="text-9xl font-bold orange_gradient leading-tight">
          Crudcy
        </h1>
        <p className="text-2xl font-semibold text-gray-600 dark:text-gray-400">Test Your Coding Skills today in a fun way with Crudcy.</p>
        <div className='flex m-5 mt-16 justify-center gap-6 text-white'>
          <div><Link href="/ide" className='button '>Try IDE →</Link></div>
          <div><Link className='button' href="/practice">Practice →</Link></div>
        </div>

      </div>
    </main>
  )
}
