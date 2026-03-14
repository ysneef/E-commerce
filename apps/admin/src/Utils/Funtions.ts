import axios from "axios";

export const maskPhone = (
  phone: string,
  visibleStart = 3,
  visibleEnd = 3
): string => {
  if (!phone || phone.length < visibleStart + visibleEnd) return phone

  const maskLength = phone.length - (visibleStart + visibleEnd)
  return (
    phone.slice(0, visibleStart) +
    "*".repeat(maskLength) +
    phone.slice(-visibleEnd)
  )
}

export const capitalizeFirstLetter = (str: string) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};


export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed!");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(import.meta.env.VITE_CLOUDINARY_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.secure_url;
};
