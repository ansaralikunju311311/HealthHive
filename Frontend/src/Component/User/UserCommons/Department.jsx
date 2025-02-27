
import React from 'react'
import Datadpt from '../Appoiment/Datadpt'
import Heading from '../Appoiment/Heading'
import Schedulebtn from '../Appoiment/Schedulebtn'
const Department = () => {
  return (
    <div>
        
        <Heading/>
        <Schedulebtn/>
        <Datadpt limit={4}/>
         
    </div>
  )
}

export default Department;





