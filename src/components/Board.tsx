import { FC } from "react"

const Board: FC = () => {
    return (
        <div className="pb-16px bg-white rounded-custom-ssm overflow-hidden border-1 border-gray-border">
            <div className="text-fs-22 font-semibold py-16px ps-16px bg-gradient-117-to-l">
                Settings
            </div>
            <div className="pb-16px divide-blue-500">---</div>
            <div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export { Board }