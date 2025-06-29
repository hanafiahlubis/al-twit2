import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const PostModal = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [media, setMedia] = useState(null);
  const [content, setContent] = useState("");

  const handleMediaChange = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      setMedia(info.file.originFileObj);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handlePostSubmit = async () => {
    const data = new FormData();
    data.append("file", media);
    data.append("content", content);

    try {
      await onSubmit(data);
      form.resetFields();
      setMedia(null);
      setContent("");
      onCancel();
    } catch (error) {
      console.error("Error in submitting post:", error);
    }
  };

  return (
    <Modal
      visible={!visible}
      title="Create a New Post"
      onCancel={onCancel}
      footer={null}
      centered
      width={500}
      style={{
        borderRadius: "8px",
        overflow: "hidden",
      }}
      bodyStyle={{
        padding: "20px",
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ content }}
        onFinish={handlePostSubmit}
      >
        <Form.Item
          name="content"
          label="Content"
          rules={[{ required: true, message: "Please enter post content!" }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              border: "1px solid #d9d9d9",
              fontSize: "14px",
            }}
          />
        </Form.Item>

        <Form.Item
          name="media"
          label="Media"
          extra="You can attach a media file"
        >
          <Upload
            accept="image/*,video/*"
            beforeUpload={() => false}
            onChange={handleMediaChange}
            showUploadList={false}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <div className="flex justify-end gap-3">
          <Button
            onClick={onCancel}
            type="default"
            style={{
              borderRadius: "8px",
              borderColor: "#d9d9d9",
              color: "#fff",
              padding: "6px 16px",
              fontSize: "14px",
              backgroundColor: "#f44336"
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              backgroundColor: "#52c41a", // Green color for Submit button
              borderRadius: "8px",
              padding: "6px 16px",
              fontSize: "14px",
            }}
          >
            Post
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default PostModal;
