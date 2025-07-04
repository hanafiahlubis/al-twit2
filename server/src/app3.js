import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000 || process.env.PORT;

// Middleware untuk parsing JSON
app.use(express.json());

// Endpoint untuk memanggil model Hugging Face
app.post('/ai', async (req, res) => {
    const { inputText } = req.body;

    if (!inputText) {
        return res.status(400).json({ error: "Input text is required" });
    }

    try {
        const response = await axios.post(
            'https://huggingface.co/models/openai-community/gpt2', // URL model GPT-2 dari Hugging Face
            { inputs: inputText },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.HF_API_KEY}`,
                },
            }
        );

        // Mengirimkan hasil response dari Hugging Face ke client
        return res.json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
