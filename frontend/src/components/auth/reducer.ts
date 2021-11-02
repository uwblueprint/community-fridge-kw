import React from "react";

export interface State {
  isTwelveChars: boolean;
  isUpperCase: boolean;
  isLowerCase: boolean;
  isNumber: boolean;
  isSpecialChar: boolean;
}

export type Action =
  | { type: "SET_IS_TWELVE_CHARS"; isTwelveChars: boolean }
  | { type: "SET_IS_UPPER_CASE"; isUpperCase: boolean }
  | { type: "SET_IS_LOWER_CASE"; isLowerCase: boolean }
  | { type: "SET_IS_NUMBER"; isNumber: boolean }
  | { type: "SET_IS_SPECIAL_CHAR"; isSpecialChar: boolean };

export function initialState() {
  return {
    isTwelveChars: false,
    isUpperCase: false,
    isLowerCase: false,
    isNumber: false,
    isSpecialChar: false,
  };
}

export function passwordVerificationReducer(state: State, action: Action) {
  switch (action.type) {
    case "SET_IS_TWELVE_CHARS":
      return {
        ...state,
        isTwelveChars: action.isTwelveChars,
      };
    case "SET_IS_UPPER_CASE":
      return {
        ...state,
        isUpperCase: action.isUpperCase,
      };
    case "SET_IS_LOWER_CASE":
      return {
        ...state,
        isLowerCase: action.isLowerCase,
      };
    case "SET_IS_NUMBER":
      return {
        ...state,
        isNumber: action.isNumber,
      };
    case "SET_IS_SPECIAL_CHAR":
      return {
        ...state,
        isSpecialChar: action.isSpecialChar,
      };
    default:
      return state;
  }
}
