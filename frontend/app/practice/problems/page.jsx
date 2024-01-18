import React from 'react'
import '@styles/problemset.css'
import problems from '@utils/problems'
import problemlist from '@utils/database'

const page = () => {
    const htmlString = {__html: problemlist[0].list1}
  return (
    <div className=' flex justify-center min-h-screen'>
        
        <div className='flex justify-center pt-5'>
            <div>
              <ol className=' list-decimal'>
                <li><a href='/problemset/task/1'><span>Data Structures Fan</span></a></li>
                <li><a href='/problemset/task/2'><span>Sum of XOR Functions</span></a></li>
              </ol>
              <div dangerouslySetInnerHTML={htmlString}></div>
            </div>
        </div>
    </div>
  )
}

export default page