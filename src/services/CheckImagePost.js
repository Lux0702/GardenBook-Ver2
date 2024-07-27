import React, { useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ImageModeration = ({ url, onCheckComplete }) => {
  useEffect(() => {
    if (url) {
      handleSubmit();
    }
  }, [url]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('media', url);
    formData.append('workflow', 'wfl_gE5EBpgnMkUx5gUtx170J');
    formData.append('api_user', '1182660997');
    formData.append('api_secret', 'PF9hTPxGkTQB6Lvw4rhwPkiviNb3fEre');

    try {
      const response = await axios.post(
        'https://api.sightengine.com/1.0/check-workflow.json',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    //   toast.info(response.data);
      onCheckComplete(response.data);
      console.log('onCheckComplete',response.data) // Callback to handle result
    } catch (error) {
      console.error('Lỗi không kiêm tra ảnh được:');
    }
  };

  return (
    <div>
      {/* <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      /> */}
    </div>
  );
};

export default ImageModeration;
