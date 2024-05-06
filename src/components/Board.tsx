import { FC } from "react"

const Board: FC = () => {
    return (
        <div className="pb-16px bg-white">
            <div className="text-fs-22 font-semibold py-16px ps-16px">
                Settings
            </div>
            <hr className="pb-16px" />
            <div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export { Board }