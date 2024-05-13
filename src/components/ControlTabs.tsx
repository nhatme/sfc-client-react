import { FC } from 'react'
import { ButtonBuilder } from './Button';
import { InputTargetAddress } from './Inputs';

const ControlTabs: FC = () => {
    return (
        <div className='flex flex-col gap-10px'>
            <div className="flex gap-8px">
                <ButtonBuilder btnType='circle' cursor='pointer' paddingSize='Large' sizeVariant='large' classNameCustom='bg-purple-500 text-white' btnName='TARGET' border='gray-border' />
                <ButtonBuilder btnType='circle' cursor='pointer' paddingSize='Large' sizeVariant='large' classNameCustom='bg-white text-purple-500' btnName='MINE' border='gray-border' />
            </div>
            <InputTargetAddress />
        </div>
    )
}

export { ControlTabs };