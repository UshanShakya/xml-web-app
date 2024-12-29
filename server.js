const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');  // For parsing XML

// Initialize the Express app
const app = express();
const port = 3000;

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// Serve static files (like your HTML)
app.use(express.static('public'));

// Route to get the XML file data
app.get('/get-xml', (req, res) => {
    const filePath = path.join(__dirname, 'XML_SETUP', 'xml_details.xml');

    // Check if XML file exists
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).send('Error reading XML file.');
            }

            const parser = new xml2js.Parser({ explicitArray: false });
            parser.parseString(data, (err, result) => {
                if (err) {
                    return res.status(500).send('Error parsing XML file.');
                }
                if(result?.sections?.section === undefined) return null;
                const sectionsArray = Array.isArray(result?.sections?.section) ? result?.sections?.section : [result?.sections?.section];
                if(sectionsArray == undefined){
                    console.log("No sections found");
                    return null;
                }
                // Get sections and their key-value pairs
                const sections = sectionsArray.map(section => {
                    const sectionData = {
                        name: section?.name,
                        keyValues: []
                    };

                    // Extract all keys (tags) inside the section
                    Object.keys(section).forEach(tag => {
                        // Skip the 'name' field, as it's already handled
                        if (tag !== 'name') {
                            sectionData?.keyValues.push({
                                key: tag, // The tag name (e.g., Position)
                                value: section[tag] // The value inside the tag (e.g., Developer)
                            });
                        }
                    });
                    return sectionData;
                });

                res.json({ sections });
            });
        });
    } else {
        res.status(404).send('XML file not found');
    }
});

// Route to save XML data to a file
app.post('/save-xml', (req, res) => {
    const xmlContent = req.body.xmlContent;  // Get the XML content from request body

    const directoryPath = path.join(__dirname, 'XML_SETUP');  // Path for saving
    const filePath = path.join(directoryPath, 'xml_details.xml');  // File to save
    console.log(req.body)
    // Ensure the 'XML_SETUP' directory exists
    fs.ensureDirSync(directoryPath);

    // Check if the file already exists
    fs.pathExists(filePath, (err, exists) => {
        if (err) {
            return res.status(500).send('Error checking file existence.');
        }
        // Save the XML content to the file
        fs.writeFile(filePath, xmlContent, 'utf8', (err) => {
            if (err) {
                return res.status(500).send({ error: 'Failed to save the file.' });
            }
            res.status(200).send({ message: 'XML file saved successfully.' });
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
