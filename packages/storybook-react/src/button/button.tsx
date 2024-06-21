import "./base.css";
import { Context, defaultValues, keyOrder } from "./button.generated";
import { useStyledClass } from "../context";
import React from "react";

export type ButtonProps = {
  children: React.ReactNode;
} & Context;

export const Button = (props: ButtonProps) => {
  const styledClass = useStyledClass("button", keyOrder, defaultValues);
  return <button className={styledClass} {...props} />;
};
