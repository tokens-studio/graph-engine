import React from 'react';
import './base.css';
import { keyOrder, defaultValues, Context } from './button.generated';
import { useStyledClass } from '../context';

export type ButtonProps = {
    children: React.ReactNode
} & Context

export const Button = (props: ButtonProps) => {
    const styledClass = useStyledClass('button', keyOrder, defaultValues);
    return <button className={styledClass} {...props} />;
}