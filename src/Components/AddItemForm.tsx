import React, {ChangeEvent, useState} from 'react';
import IconButton from "@material-ui/core/IconButton";
import {AddBox} from "@material-ui/icons";
import {TextField} from "@material-ui/core";

type PropsType = {
    addNewItem: (title: string) => void
}

export const AddItemForm = (props: PropsType) => {
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
        setError('')
    }
    const [inputValue, setInputValue] = useState('')
    const [error, setError] = useState('')
    return <div>
        <TextField variant={'outlined'} label={'Title'} error={!!error}
                   onChange={changeInputValue}
                   onKeyPress={(e) => {
                       if (e.key === 'Enter') {
                           addItem()
                       }
                   }}
                   value={inputValue}/>
        <IconButton color={'primary'} onClick={addItem}><AddBox/></IconButton>
        <div>
            <span className={'error'}>{error}</span>
        </div>

    </div>
}