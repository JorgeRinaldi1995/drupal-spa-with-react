import React, { useState } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
import { fetchWithCSRFToken } from '../../utils/fetch';

function ImageUploader({ onImageUpload }) {
    const handleImageChange = (e) => {
      const selectedImage = e.target.files[0];
      console.log("Uploaded image", selectedImage);
      
      if(selectedImage) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result;
          onImageUpload(selectedImage, base64Image);
        };
        reader.readAsDataURL(selectedImage);
      }
      /* // Read the image file as an ArrayBuffer
      const reader = new FileReader();
      reader.onload = async (event) => {
        const buffer = event.target.result; // ArrayBuffer containing the image data
        const csrfUrl = `session/token?format=json`;
        const fetchUrl = '/jsonapi/node/recipe/field_image';
  
        console.log("Buffered image", buffer);
  
        const fetchOptions = {
          method: 'POST',
          headers: new Headers({
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `file; filename="${selectedImage.name}"`,
          }),
          body: Buffer.from(buffer), // Convert ArrayBuffer to Buffer using the polyfill
        };
  
        try {
          
          const response = await fetchWithCSRFToken(csrfUrl, fetchUrl, fetchOptions);
          console.log('responsem', response);
          if (!response.ok) {
            throw new Error(`Error uploading image: ${response.statusText}`);
          }
  
          const data = await response.json();
          console.log('Image uploaded successfully:', data);
  
          // You can handle the response here, e.g., update state or show a success message
        } catch (error) {
          console.error(error);
          // Handle error, e.g., show an error message
        }
      };
  
      reader.readAsArrayBuffer(selectedImage); // Read the image file as an ArrayBuffer */
    };
  
    return (
      <div>
        <h2>Upload Image</h2>
        {/* File input */}
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
    );
  }
  
  export default ImageUploader;
