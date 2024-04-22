const { google } = require('googleapis');
const { Readable } = require('stream');

const express = require('express');
const multer = require('multer');


const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 8000;


function bufferToStream(buffer) {
    const readable = new Readable();
    readable._read = () => {}; // _read is required but you can noop it
    readable.push(buffer);
    readable.push(null); // Indicates the end of the stream
    return readable;
}


const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization"
};

app.use(cors(corsOptions));
app.use(express.json());

const storage = multer.memoryStorage(); // This will store files in memory
const upload = multer({ storage: storage });

const credentials = JSON.parse(fs.readFileSync('../frontend/Keys/cred.json'));

// Initialize GoogleAuth for a service account
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: credentials.client_email,
    private_key: credentials.private_key.replace(/\\n/g, '\n') // Ensures private key line breaks are handled correctly
  },
  scopes: ['https://www.googleapis.com/auth/drive.file']
});

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file || !req.file.buffer) {
        return res.status(400).send('No file uploaded or Buffer unavailable.');
    }

    try {
        const authClient = await auth.getClient();
        const drive = google.drive({ version: 'v3', auth: authClient });

        const fileMetadata = {
            name: req.file.originalname,
            mimeType: req.file.mimetype,
            parents: ['1JAkuKL6_80Mwt-ASLeodJAIPUqC88uWy']
        };

        const media = {
            mimeType: req.file.mimetype,
            body: bufferToStream(req.file.buffer)
        };

        const file = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id'
        });

        const webViewLink = `https://drive.google.com/file/d/${file.data.id}/view`;
        
        console.log(req.file);
        console.log(req.body);

        res.status(200).json({
            message: "File uploaded successfully",
            link: webViewLink
        });
        console.log("hi");
    } catch (error) {
        console.error('Failed to upload file:', error);
        res.status(500).send('Failed to upload file.');

    }
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
