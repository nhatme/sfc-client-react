import { FC } from 'react'
import { Button } from '@material-tailwind/react'
import { Link } from 'react-router-dom'
import { ButtonBuilderProps, ButtonCOnfirmProps, ButtonHeaderProps } from '../interfaces/CustomProps'

const ButtonHeader: FC<ButtonHeaderProps> = ({ buttonName, url }) => {
  return (
    <Link to={url}>
      <Button variant="text" size='sm' className="text-black text-sm font-bold">{buttonName}</Button>
    </Link>
  )
}

const ButtonBuilder: FC<ButtonBuilderProps> = ({ btnName, classNameCustom }) => {
  return (
    <div className={`rounded-custom-xxl border-gray-border ${classNameCustom} border-1 px-16px py-8px font-bold text-fs-28 leading-lh-100 hover:cursor-pointer`}>{btnName}</div>
  )
}

const ButtonConfirm: FC<ButtonCOnfirmProps> = ({ btnName }) => {
  return (
    <div>
      <div className={`rounded-custom-xxl border-gray-border border-1 px-8px py-4px font-bold text-fs-16 leading-lh-100 text-white bg-primary-color hover:cursor-pointer`}>{btnName}</div>
    </div>
  )
}

export { ButtonHeader, ButtonBuilder, ButtonConfirm }