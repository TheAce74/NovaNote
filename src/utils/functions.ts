export const getKeys = (obj: Record<string, unknown>): string[] => {
  return Object.keys(obj);
};

export const removeKey = <T extends object, K extends keyof T>(
  obj: T,
  key: K
): Partial<T> => {
  const newObj = { ...obj };
  if (key in newObj) {
    delete newObj[key];
  }
  return newObj;
};

export const validateFile = (file: File): [boolean, string] => {
  const allowedExtensions = /(\.txt|\.docx)$/i;
  const maxFileSize = 5 * 1024 * 1024;

  if (!allowedExtensions.exec(file.name)) {
    return [false, "Invalid file type. Only .txt and .docx files are allowed."];
  }

  if (file.size > maxFileSize) {
    return [false, "File size exceeds 5MB."];
  }
  return [true, ""];
};

export const validateImage = (file: File): [boolean, string] => {
  const allowedExtensions = /(\.jpg|\.png)$/i;
  const maxFileSize = 5 * 1024 * 1024;

  if (!allowedExtensions.exec(file.name)) {
    return [false, "Invalid file type. Only .jpg and .png files are allowed."];
  }

  if (file.size > maxFileSize) {
    return [false, "File size exceeds 5MB."];
  }
  return [true, ""];
};
