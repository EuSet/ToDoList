import React, {ChangeEvent, useState} from 'react';
import IconButton from "@material-ui/core/IconButton";
import {TextField} from "@material-ui/core";
import PlusOneIcon from '@material-ui/icons/PlusOne';

type PropsType = {
    addNewItem: (title: string) => void
}

export const AddItemForm = React.memo( (props: PropsType) => {
    // console.log('AddItemForm')
    const addItem = () => {
        if (inputValue) {
            props.addNewItem(inputValue.trim())
        } else {
            setError('Error, filed is required')
        }
        setInputValue('')
    }
    const changeInputValue = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        if(error){
            setError('')
        }
    }
    const [inputValue, setInputValue] = useState('')
    const [error, setError] = useState('')
    return <div>
        <TextField variant={'standard'} label={'Title'} error={!!error}
                   onChange={changeInputValue}
                   onBlur={() => {setError('')}}
                   onKeyPress={(e) => {
                       if (e.key === 'Enter') {
                           addItem()
                       }
                   }}
                   value={inputValue}/>
        <IconButton color={'primary'} onClick={addItem}><PlusOneIcon color={"primary"}/></IconButton>
        <div>
            <span className={'error'}>{error}</span>
        </div>

    </div>
})
