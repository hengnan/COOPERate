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

function getParent(course, type){
    const directory_structure=  JSON.parse(fs.readFileSync('GDrive/directories.json'));
    console.log(directory_structure);
    console.log(course);
    console.log(type);
    return directory_structure[course][type]
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

const credentials = JSON.parse(fs.readFileSync('Keys/cred.json'));
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
        
        console.log(req);
        console.log(req.body);

        reviewData = JSON.parse(req.body.reviewData);
        const fileMetadata = {
            name: reviewData.course_id + '_' + reviewData.type + '_' +reviewData.year + '_' + reviewData.username,
            mimeType: req.file.mimetype,
            parents: [getParent(reviewData.course_id, reviewData.type)]
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


app.delete('/deleteFile/:fileId', async (req, res) => {
    const fileId = req.params.fileId;  // Get the file ID from the request parameters

    try {
        const authClient = await auth.getClient();
        const drive = google.drive({ version: 'v3', auth: authClient });

        await drive.files.delete({
            fileId: fileId
        });

        res.status(200).send({ message: "File deleted successfully" });
    } catch (error) {
        console.error('Failed to delete file:', error);
        res.status(500).send('Failed to delete file.');
    }
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
