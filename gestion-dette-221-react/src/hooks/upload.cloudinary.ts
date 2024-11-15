import axios from 'axios';

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'your_upload_preset'); // Use your Cloudinary preset here

  try {
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data.secure_url;  // Return the secure Cloudinary URL
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Error uploading image to Cloudinary');
  }
};
