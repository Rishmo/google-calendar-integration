import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data } = await axios.get('http://localhost:5000/events');
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    const { title, dateTime, location } = req.body;
    const { data } = await axios.post('http://localhost:5000/events', { title, dateTime, location });
    res.status(201).json(data);
  }
}