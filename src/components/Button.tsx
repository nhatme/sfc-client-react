import { FC } from 'react'
import { Button } from '@material-tailwind/react'
import { Link } from 'react-router-dom'
import { ButtonBuilderProps, ButtonHeaderProps, SizeButton, updateButtonPaddingAndRounded } from '../interfaces/CustomProps'

const ButtonHeader: FC<ButtonHeaderProps> = ({ buttonName, url }) => {
  return (
    <Link to={url}>
      <Button color='purple' variant="text" size='sm' className="text-sm font-bold">{buttonName}</Button>
    </Link>
  )
}

const ButtonBuilder: FC<ButtonBuilderProps> = ({ btnName, classNameCustom, sizeVariant, paddingSize, btnType, icon, cursor, onClick, border }) => {
  const classNames: string[] = ["leading-lh-100", "select-none"];
  const buttonPaddingAndRounded: SizeButton = updateButtonPaddingAndRounded(btnType)[`sizeButtonPadding${paddingSize}`];
  const buttonClasses = buttonPaddingAndRounded[sizeVariant];
  classNames.push(buttonClasses);
  if (cursor) classNames.push(`hover:cursor-${cursor}`);
  if (border === 'gray-border') classNames.push("border-gray-border", "border-1");
  if (border === 'black-border') classNames.push("border-black-border", "border-1");

  return (
    <div onClick={onClick} className={classNames.join(" ") + ` ${classNameCustom}`}>
      <div className='text-center'>{btnName}</div>
      <div>{icon}</div>
    </div>
  )
}

export { ButtonHeader, ButtonBuilder }