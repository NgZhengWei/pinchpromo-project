import React from 'react'
import { Typography } from 'antd'


const AppFooter = () => {
  return (
    <div className='AppFooter'>
        <Typography.Link href="tel:+1234567879">+1234567879</Typography.Link>
        <Typography.Link href="https://google.com" target={"_blank"}>Privacy Policy</Typography.Link>
        <Typography.Link href="https://google.com" target={"_blank"}>Terms of Use</Typography.Link>
    </div>
  )
}

export default AppFooter