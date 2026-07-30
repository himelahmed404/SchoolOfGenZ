const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

export const toBn = (n) => String(n).replace(/[0-9]/g, (d) => BN_DIGITS[+d]);
export const fromBn = (s) =>
  String(s).replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));

export const priceToInt = (str) => parseInt(fromBn(str || "").replace(/[^0-9]/g, ""), 10) || 0;

export const toBnTaka = (n) => "৳" + toBn(n.toLocaleString("en-US"));
