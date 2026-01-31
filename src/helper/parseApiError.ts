const parseApiError = (errorData: any): string => {
  if (!errorData) return "Terjadi kesalahan";

  // 1️⃣ Validation error per field
  if (errorData.data && typeof errorData.data === "object") {
    const firstField = Object.keys(errorData.data)[0];
    const messages = errorData.data[firstField];

    if (Array.isArray(messages) && messages.length > 0) {
      return messages[0];
    }
  }

  // 2️⃣ General message
  if (errorData.message) {
    return errorData.message;
  }

  return "Terjadi kesalahan";
};
