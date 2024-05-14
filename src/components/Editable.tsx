import { ButtonGroup, Editable, EditableInput, EditablePreview, Flex, IconButton, Input, useEditableControls } from "@chakra-ui/react"
import { CheckIcon, LockClosedIcon, PencilSquareIcon } from "@heroicons/react/16/solid"

function EditableControl() {
    /* Here's a custom control */
    return (
        <div className="bg-purple-500">
            <Editable defaultValue='Take some chakra'>
                <EditablePreview />
                <EditableInput />
            </Editable>
        </div>
    )
}

export { EditableControl }