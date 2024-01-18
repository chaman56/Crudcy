import '@styles/globals.css'
import { Inter } from 'next/font/google'
import Nav from '@components/Nav'
import Provider from '@components/Provider'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Coding Battles',
  description: '',
}


export default function RootLayout({ children }) {
  
  return (
    <html lang="en" >
      <Provider>
      <body className={`${inter.className} min-h-full min-w-full dark:bg-slate-900 dark:text-white`}>
        <Nav/>
        {children}
      </body>
      </Provider>
    </html>
  )
}
