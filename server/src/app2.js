import axios from 'axios';

const API_KEY = process.env.OPENAI_API_KEY; // Gunakan variabel lingkungan untuk API key

// Fungsi untuk mengambil Chat Completions
async function listChatCompletions(messages = [], model = 'gpt-3.5-turbo') {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions', 
      {
        model: model,
        messages: messages,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Menampilkan hasil
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching Chat Completions:', error.message);
  }
}

// Contoh penggunaan fungsi dengan percakapan
const messages = [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'Hello, who won the world series in 2020?' },
  { role: 'assistant', content: 'The Los Angeles Dodgers won the World Series in 2020.' },
  { role: 'user', content: 'Where was it played?' },
];

listChatCompletions(messages); // Panggil dengan pesan yang diinginkan
