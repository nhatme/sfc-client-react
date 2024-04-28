import { FC } from 'react'
import { Button } from '@material-tailwind/react'

interface ButtonHeaderProps {
  buttonText: String
}

const ButtonHeader: FC<ButtonHeaderProps> = ({ buttonText }) => {
  return (
    <Button variant="text" size='sm' className="text-black text-sm font-bold font-['Inter']">{buttonText}</Button>
  )
}

export { ButtonHeader }