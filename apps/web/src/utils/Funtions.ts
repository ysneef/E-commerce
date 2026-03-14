import axios from "axios";

/**
 * Mask phone number
 * Example: 098****123
 */
export const maskPhone = (
  phone: string,
  visibleStart = 3,
  visibleEnd = 3
): string => {
  if (!phone || phone.length <= visibleStart + visibleEnd) return phone;

  const maskLength = phone.length - (visibleStart + visibleEnd);

  return (
    phone.slice(0, visibleStart) +
    "*".repeat(maskLength) +
    phone.slice(-visibleEnd)
  );
};


/**
 * Capitalize each word
 * Example: "john doe" -> "John Doe"
 */
export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return "";

  return str
    .trim()
    .split(" ")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
};


/**
 * Upload image to Cloudinary
 */
export const uploadImageToCloudinary = async (
  file: File
): Promise<string> => {

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      import.meta.env.VITE_CLOUDINARY_URL,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.secure_url;

  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Image upload failed");
  }
};
