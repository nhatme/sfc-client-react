import { FC } from 'react'
import { Button } from '@material-tailwind/react'
import { Link } from 'react-router-dom'

interface ButtonHeaderProps {
  buttonName: string,
  url: string
}

const ButtonHeader: FC<ButtonHeaderProps> = ({ buttonName, url }) => {
  return (
    <Link to={url}>
      <Button variant="text" size='sm' className="text-black text-sm font-bold">{buttonName}</Button>
    </Link>
  )
}

export { ButtonHeader }