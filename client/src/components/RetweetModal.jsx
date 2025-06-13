import { Modal, Button, Input } from "antd"; // Import Input untuk styling form
import { useState } from "react";
import { api } from "../utils.js";
import { AllStateContext, DataContext } from "../App";
import { useContext } from "react";

export default function RetweetModal() {
    const { openRetweet, setOpenRetweet, dataRetweet, setDataRetweet } = useContext(AllStateContext);
    const { setPostings } = useContext(DataContext);

    const handleRetweetSubmit = async () => {
        try {
            await api.post("/retweed", dataRetweet);  // Mengirim data retweet ke backend
            const updatedPostings = await api.get("/posting");
            setPostings(updatedPostings.data);  // Update postings
            setDataRetweet({});  // Reset data retweet
            setOpenRetweet(false);  // Menutup modal setelah berhasil
        } catch (error) {
            console.error("Error in retweeting:", error);
        }
    };

    const handleCancel = () => {
        setOpenRetweet(false);  // Menutup modal jika dibatalkan
    };

    return (
        <Modal
            title="Retweet"
            visible={openRetweet}  // Modal akan terbuka jika `openRetweet` true
            onOk={handleRetweetSubmit}  // Mengirim data saat klik submit
            onCancel={handleCancel}  // Menutup modal jika dibatalkan
            okText="Retweet"
            cancelText="Cancel"
            centered
            width={600}  // Menyesuaikan lebar modal
            bodyStyle={{
                padding: '20px',  // Menambah padding dalam modal untuk tampilan lebih lapang
            }}
            footer={[
                <Button key="cancel" onClick={handleCancel} style={{ width: "100px", backgroundColor: "#f44336", color: "white" }}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleRetweetSubmit} style={{ width: "100px", backgroundColor: "#4CAF50" }}>
                    Retweet
                </Button>,
            ]}
        >
            <div className="retweet-modal-content">
                <h3 className="modal-user-name">{dataRetweet?.name}</h3>
                <p className="modal-user-email">{dataRetweet?.email}</p>
                <h4 className="modal-post-content">{dataRetweet?.content}</h4>

                <Input.TextArea
                    autoFocus
                    rows={4}
                    placeholder="Add a message to your retweet"
                    value={dataRetweet.isi || ""}
                    onChange={(e) => {
                        setDataRetweet({
                            ...dataRetweet,
                            isi: e.target.value,
                        });
                    }}
                    maxLength={153}
                    style={{ borderRadius: '10px', padding: '10px', fontSize: '16px' }}
                />
            </div>

            <style jsx>{`
                .retweet-modal-content {
                    font-family: Arial, sans-serif;
                    text-align: left;
                }
                .modal-user-name {
                    font-size: 20px;
                    font-weight: bold;
                    color: #333;
                }
                .modal-user-email {
                    font-size: 14px;
                    color: #666;
                }
                .modal-post-content {
                    font-size: 16px;
                    color: #444;
                    margin-top: 10px;
                }
            `}</style>
        </Modal>
    );
}
