/** Single source of truth for Sunrise Roofers contact phone number. */
export const PHONE_DISPLAY = '520-753-1758';
export const PHONE_DISPLAY_PARENS = '(520) 753-1758';
export const PHONE_DIGITS = '5207531758';
export const PHONE_E164 = '+15207531758';
// Schema / NAP number: the CallRail number on Google Business Profile, so a call
// from a rich result or directory is tracked. The display numbers above stay the
// direct line because that is CallRail's swap target - swap.js replaces them.
export const PHONE_JSON_LD = '+1-520-783-3976';
export const PHONE_TEL_HYPHENATED = `tel:${PHONE_DISPLAY}`;
export const PHONE_TEL_E164 = `tel:${PHONE_E164}`;
