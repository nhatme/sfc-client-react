import { FC } from "react";
import { ControlTabs } from "../components/ControlTabs";
import { Board } from "../components/Board";
import { CircleStackIcon } from "@heroicons/react/24/outline";
import { BoltIcon, CheckIcon, ClipboardDocumentListIcon, QuestionMarkCircleIcon } from "@heroicons/react/16/solid";
import { ButtonBuilder } from "../components/Button";
import { InputQuantity } from "../components/Inputs";
import { StatusStProps } from "../interfaces/CustomProps";
import { GetBalance } from "../utils/Utilities";

const ContentBoard1: FC = () => {
    return (
        <div className="flex">
            <div className="mx-16px">
                <div className="flex flex-col gap-4px">
                    <div className="text-fs-14 italic font-bold text-purple-500">Open & Close Asset</div>
                    <div className="flex gap-6px">
                        <ButtonBuilder border="gray-border" btnType="circle" cursor="pointer" paddingSize="Medium" sizeVariant="medium" btnName="Open" classNameCustom="text-purple-500" />
                        <ButtonBuilder border="gray-border" btnType="circle" cursor="pointer" paddingSize="Medium" sizeVariant="medium" btnName="Close" classNameCustom="text-purple-500" />
                    </div>
                </div>
                <div className="flex flex-col gap-4px mt-12px">
                    <div className="text-fs-14 italic font-bold text-purple-500">Mint & Burn SFC token</div>

                    <div className="flex items-center gap-6px">
                        <ButtonBuilder border="gray-border" btnType="circle" cursor="pointer" paddingSize="Medium" sizeVariant="medium" btnName="Mint" classNameCustom="text-purple-500" />
                        <ButtonBuilder border="gray-border" btnType="circle" cursor="pointer" paddingSize="Medium" sizeVariant="medium" btnName="Burn" classNameCustom="text-purple-500" />
                        <CircleStackIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                        <InputQuantity />
                    </div>
                </div>
            </div>
            <div className="border-r-1 border-gray-border"></div>
            <div className="mx-16px ">
                <div className="flex mb-4px">
                    <ButtonBuilder border="gray-border" btnType="circle" paddingSize="Medium" sizeVariant="medium" btnName="Transfer" cursor="pointer"
                        classNameCustom="text-purple-500 flex gap-4px" icon={<BoltIcon className="h-5 w-5 text-purple-500" />} />
                </div>
                <div>
                    <InputQuantity />
                </div>
            </div>
        </div>
    )
}

const StatusOfSt: FC<StatusStProps> = ({ name, value, unit, icon }) => {
    return (
        <div className="flex justify-between text-purple-500 font-bold text-fs-sm">
            <div className="flex items-center gap-2px">{name}{icon}</div>
            <div>{value + " " + unit}</div>
        </div>
    )
}

const ContentBoard2: FC = () => {
    return (
        <div>
            <div className="mx-16px flex flex-col gap-8px">
                <StatusOfSt name="Tokenomics" value="100" unit="SFC" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
                <StatusOfSt name="SOL Balance" value="100" unit="SOL" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
                <StatusOfSt name="Asset Balance" value="100" unit="VND" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
            </div>
            <div className="border-b-1 border-gray-border my-16px"></div>
            <div className="mx-16px flex justify-between">
                <div className="flex flex-col gap-6px">
                    <ButtonBuilder border="gray-border" btnName="Open Asset" btnType="circle" paddingSize="Small" sizeVariant="small"
                        classNameCustom="flex items-center gap-4px text-purple-500"
                        icon={<CheckIcon className="h-4 w-4 text-success-500" />}
                    />
                    <ButtonBuilder border="gray-border" btnName="open Asset" btnType="circle" paddingSize="Small" sizeVariant="small"
                        classNameCustom="flex items-center gap-4px text-purple-500"
                        icon={<CheckIcon className="h-4 w-4 text-success-500" />}
                    />
                    <ButtonBuilder border="gray-border" btnName="Open SFC" btnType="circle" paddingSize="Small" sizeVariant="small"
                        classNameCustom="flex items-center gap-4px text-purple-500"
                        icon={<CheckIcon className="h-4 w-4 text-success-500" />}
                    />
                </div>
                <div className="border-r-1 border-gray-border mx-16px"></div>
                <div className="flex flex-col gap-4px">
                    <StatusOfSt name="Account name: " value="Phan Minh Nhật" unit="" />
                    <ButtonBuilder border="gray-border" btnName="AMiZ3mSZVs.....uUsgFaUqg1QZ" btnType="circle" paddingSize="Medium" sizeVariant="small"
                        classNameCustom="flex items-center gap-16px text-purple-500" icon={<ClipboardDocumentListIcon className="h-6 w-6 text-purple-500 cursor-pointer" />}
                    />
                    <div className="flex gap-4px">
                        <img
                            className="h-48px w-48px rounded-full object-cover object-center shadow-xl"
                            src="https://www.economywatch.com/wp-content/uploads/2021/06/solana-1.jpg"
                            alt="nature image"
                        />
                        <img
                            className="h-48px w-48px rounded-full object-cover object-center shadow-xl"
                            src="https://www.economywatch.com/wp-content/uploads/2021/06/solana-1.jpg"
                            alt="nature image"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

const ContentBoard3: FC = () => {
    return (
        <div className="flex mx-16px">
            <div className="flex flex-col w-1/2">
                <StatusOfSt name="SFC TOKEN" value="100" unit="SFC" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
                <StatusOfSt name="Market Cap" value="100" unit="SOL" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
                <StatusOfSt name="Circulating" value="100" unit="VND" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
                <StatusOfSt name="Total Supply" value="100" unit="VND" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
                <StatusOfSt name="Max Supply" value="100" unit="VND" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
            </div>
            <div className="border-r-1 border-gray-border mx-16px"></div>
            <div className="flex flex-col w-1/2">
                <StatusOfSt name="SOL TOKEN" value="100" unit="SFC" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
                <StatusOfSt name="Market Cap" value="100" unit="SOL" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
                <StatusOfSt name="Circulating" value="100" unit="VND" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
                <StatusOfSt name="Total Supply" value="100" unit="VND" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
                <StatusOfSt name="Max Supply" value="100" unit="VND" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
            </div>
        </div>
    )
}

const TabsHandle: FC = () => {
    return (
        <div className="flex items-start pt-10 h-full">
            <div className="flex flex-col gap-10px">
                <ControlTabs />
                <GetBalance />
                <div className="flex flex-col gap-8px">
                    <div className="flex gap-8px">
                        <Board nameBoard="Settings" gradientType="bg-gradient-117-to-l" content={<ContentBoard1 />} width="w-[572px]" />
                        <Board nameBoard="Status" content={<ContentBoard2 />} width="w-[572px]" />
                    </div>
                    <Board nameBoard="Circulating Supply?" width="" content={<ContentBoard3 />} />
                </div>
            </div>
        </div>
    )
}

export { TabsHandle };