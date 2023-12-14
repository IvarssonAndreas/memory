export const assert = (condition: boolean, message: string) => {
  if (condition) throw new Error(message);
};

export const shuffle = <T>(array: T[]): T[] => [...array].sort(() => 0.5 - Math.random());
