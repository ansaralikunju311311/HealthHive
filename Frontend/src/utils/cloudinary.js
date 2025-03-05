import axios from 'axios';

const cloudinaryUpload = async (file) => {
  const cloudName = 'dliraelbo';
  const uploadPreset = 'testing'; 

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export default cloudinaryUpload;
