import { FC } from 'react'
import { ButtonBuilder } from './Button';
import { InputTargetAddress } from './Inputs';

const ControlTabs: FC = () => {
    return (
        <div className='flex flex-col gap-10px'>
            <div className="flex gap-8px">
                <ButtonBuilder classNameCustom='bg-primary-color text-white' btnName='TARGET' />
                <ButtonBuilder classNameCustom='bg-white text-primary-color' btnName='MINE' />
            </div>
            <InputTargetAddress />
        </div>
    )
}

export { ControlTabs };