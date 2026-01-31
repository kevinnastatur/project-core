// src/helper/PasswordHelper.ts
export const passwordRules = {
  length: (v: string) => v.length >= 8,
  uppercase: (v: string) => /[A-Z]/.test(v),
  lowercase: (v: string) => /[a-z]/.test(v),
  number: (v: string) => /[0-9]/.test(v),
  symbol: (v: string) => /[^A-Za-z0-9]/.test(v),
};

export const getPasswordStrength = (value: string) => {
  const checks = Object.values(passwordRules).map((rule) => rule(value));
  const score = checks.filter(Boolean).length;

  if (score <= 2) return { label: "Weak", color: "bg-red-500" };
  if (score <= 4) return { label: "Medium", color: "bg-yellow-500" };

  return { label: "Strong", color: "bg-green-500" };
};
