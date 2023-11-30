// UploadAvatar.js
import React, { useState } from 'react';
import { Modal, Upload, Button, Avatar } from 'antd';
import { MdOutlineEdit } from 'react-icons/md';

const UploadAvatar = ({ onUpload }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = URL.createObjectURL(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    // Notify the parent component about the uploaded file
    if (newFileList.length > 0) {
      const uploadedFile = newFileList[0].originFileObj;
      onUpload(uploadedFile);
    }
  };

  const uploadButton = (
    <div>
      <MdOutlineEdit size={20} rounded-full />
    </div>
  );

  return (
    <>
      <Upload
        showUploadList={false}
        fileList={fileList}
        onChange={handleChange}
        beforeUpload={() => false} 
        accept="image/*"
      >
        {uploadButton}
      </Upload>
      <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default UploadAvatar;
