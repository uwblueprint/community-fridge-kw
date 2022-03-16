export const checkLength = (val: string) => val.length >= 12;

export const checkForNumbers = (val: string) => !!val.match(/\d+/g);

export const checkForUpperCase = (val: string) => !!val.match(/[A-Z]/g);

export const checkForLowerCase = (val: string) => !!val.match(/[a-z]/g);

/* eslint-disable no-useless-escape */
export const checkForSpecialCharacters = (val: string) =>
  !!val.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g);
