import React from 'react';
import {Meta, Story} from "@storybook/react";
import {AddItemForm, PropsType} from "./AddItemForm";
import {action} from "@storybook/addon-actions";


export default {
    title: 'AddItemForm',
    component: AddItemForm,
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as Meta;

const Template: Story<PropsType> = (args) => <AddItemForm {...args} />;
const addItemCallBack = action('Add item')
export const Primary = Template.bind({});
Primary.args = {
   addNewItem:addItemCallBack
};
