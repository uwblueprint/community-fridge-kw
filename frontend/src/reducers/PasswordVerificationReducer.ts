export interface State {
  isTwelveChars: boolean;
  isUpperCase: boolean;
  isLowerCase: boolean;
  isNumber: boolean;
  isSpecialChar: boolean;
}

export type Action = {
  type: "CHECK_PASSWORD_REQUIREMENTS";
  isTwelveChars: boolean;
  isUpperCase: boolean;
  isLowerCase: boolean;
  isNumber: boolean;
  isSpecialChar: boolean;
};

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
    case "CHECK_PASSWORD_REQUIREMENTS":
      return {
        ...state,
        isTwelveChars: action.isTwelveChars,
        isUpperCase: action.isUpperCase,
        isLowerCase: action.isLowerCase,
        isNumber: action.isNumber,
        isSpecialChar: action.isSpecialChar,
      };
    default:
      return state;
  }
}
