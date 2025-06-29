import React, { useContext } from "react";
import { Modal, Form, Input, Button } from "antd";
import { AllStateContext } from "../App";

const CommentModal = ({ visible, onCancel, onSubmit }) => {
  const { dataComentar, setDataComentar } = useContext(AllStateContext);

  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      // Update dataComentar dengan commentar baru
      setDataComentar({
        ...dataComentar,
        commentar: values.commentar,
      });

      // Submit komentar ke server
      await onSubmit();

      // Reset data komentar
      setDataComentar({
        ...dataComentar,
        commentar: "", // Kosongkan nilai commentar setelah submit
      });

      // Reset form fields
      form.resetFields();
    } catch (error) {
      console.error("Error in commenting:", error);
    }
  };


  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={450}
      style={{
        borderRadius: "8px",
        overflow: "hidden",
      }}
      bodyStyle={{
        padding: "20px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>
          Komentar untuk {dataComentar.name}
        </h2>
      </div>

      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={{ commentar: dataComentar.commentar }} // Initial value for textarea
        layout="vertical"
      >
        <div className="mb-3 text-sm text-gray-600">Email&nbsp;&nbsp;&nbsp; :  {dataComentar.email}</div>
        <div className="mb-4 text-gray-600">Konten :  {dataComentar.content}</div>

        {/* Comment Input */}
        <Form.Item
          label="Komentar elu!"
          name="commentar"
          rules={[{ required: true, message: "Wajib di isi woii!" }]}
        >
          <Input.TextArea
            rows={5}
            placeholder="Isi di sini yahhh"
            maxLength={153}
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1px solid #d9d9d9",
              fontSize: "14px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
            onChange={(e) =>
              setDataComentar({ ...dataComentar, commentar: e.target.value })
            }
          />
        </Form.Item>

        {/* Custom buttons for the modal */}
        <div className="flex justify-end gap-3 mt-3">
          <Button
            onClick={onCancel}
            type="default"
            style={{
              borderRadius: "8px",
              borderColor: "#d9d9d9",
              color: "#fff", // Red color for Cancel button
              padding: "6px 16px",
              fontSize: "14px",
              backgroundColor:"#f44336"
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              backgroundColor: "#52c41a", // Green color for Retweet button
              borderRadius: "8px",
              padding: "6px 16px",
              fontSize: "14px",
            }}
          >
            Submit
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CommentModal;
