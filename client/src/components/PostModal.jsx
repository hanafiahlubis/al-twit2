import { useState } from "react";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const PostModal = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [media, setMedia] = useState(null);
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");

  const handleMediaChange = (info) => {
    const fileObj = info?.file?.originFileObj || info?.fileList?.[0]?.originFileObj;
    if (fileObj) {
      setMedia(fileObj);
      setFileName(fileObj.name);
    } else {
      setFileName("");
      message.error("Gagal membaca file.");
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
      setFileName("");
      setContent("");
      onCancel(); 
    } catch (error) {
      console.error("Error in submitting post:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setMedia(null);
    setFileName("");
    setContent(""); 
    onCancel();
  };

  return (
    <Modal
      visible={visible} 
      title="Create a New Post"
      onCancel={handleCancel}
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
        onFinish={handlePostSubmit}
      >
        <Form.Item
          name="content"
          label="Content"
          rules={[{ required: true, message: "Please enter post content!" }]}
        >
          <Input.TextArea
            id="content" 
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
          {fileName && <span style={{ marginLeft: "10px", color: "#000" }}>{fileName}</span>} {/* Display file name */}
        </Form.Item>

        <div className="flex justify-end gap-3">
          <Button
            onClick={handleCancel} 
            type="default"
            style={{
              borderRadius: "8px",
              borderColor: "#d9d9d9",
              color: "#fff",
              padding: "6px 16px",
              fontSize: "14px",
              backgroundColor: "#f44336",
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              backgroundColor: "#52c41a",
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
