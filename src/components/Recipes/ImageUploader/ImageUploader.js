import React from 'react';

function ImageUploader({ onImageUpload }) {
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const buffer = event.target.result;
        console.log('IMAGEM SELECIONADA:', selectedImage,'formato misterioso:', buffer)
        onImageUpload(selectedImage, buffer);
      };

      reader.readAsArrayBuffer(selectedImage);
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
    </div>
  );
}

export default ImageUploader;
