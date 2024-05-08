import { FC } from 'react'
import { Button } from '@material-tailwind/react'
import { Link } from 'react-router-dom'
import { ButtonBuilderProps, ButtonHeaderProps, SizeButton, updateButtonPaddingAndRounded } from '../interfaces/CustomProps'

const ButtonHeader: FC<ButtonHeaderProps> = ({ buttonName, url }) => {
  return (
    <Link to={url}>
      <Button variant="text" size='sm' className="text-black text-sm font-bold">{buttonName}</Button>
    </Link>
  )
}

const ButtonBuilder: FC<ButtonBuilderProps> = ({ btnName, classNameCustom, sizeVariant, paddingSize, btnType, icon, cursor }) => {
  const classNames: string[] = ["border-gray-border", "border-1", "leading-lh-100"];

  const buttonPaddingAndRounded: SizeButton = updateButtonPaddingAndRounded(btnType)[`sizeButtonPadding${paddingSize}`];
  const buttonClasses = buttonPaddingAndRounded[sizeVariant];
  classNames.push(buttonClasses);
  if (cursor) classNames.push(`hover:cursor-${cursor}`);

  return (
    <div className={classNames.join(" ") + ` ${classNameCustom}`}>
      <div>{btnName}</div>
      <div>{icon}</div>
    </div>
  )
}

export { ButtonHeader, ButtonBuilder }