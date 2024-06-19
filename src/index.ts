import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

interface FormSubmission {
  name: string;
  email: string;
  phone: string;
  github_link: string;
  stopwatch_time: number;
}

const dbFile = './db.json';

// Initialize the JSON file if it doesn't exist
if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify({ submissions: [] }));
}

app.get('/ping', (req, res) => {
  res.json(true);
});

app.post('/submit', (req, res) => {
  const newSubmission: FormSubmission = req.body;
  const db = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
  db.submissions.push(newSubmission);
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
  res.status(201).json(newSubmission);
});

app.get('/read', (req, res) => {
  const index = parseInt(req.query.index as string);
  const db = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
  const submission = db.submissions[index];
  if (submission) {
    res.json(submission);
  } else {
    res.status(404).json({ error: 'Submission not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
