$(document).ready(function () {
  // Function to check if the token is valid
  function isTokenExpired(token) {
    try {
      // Decode the JWT token
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode the payload
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return currentTime > payload.exp; // Check if the token is expired
    } catch (e) {
      console.error("Invalid token format:", e);
      return true; // Treat invalid tokens as expired
    }
  }

  // check if localstorage has token or not
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    // If no token or the token is expired, redirect to login
    window.location.href = "/admin";
  }
  const sectionsContainer = $("#sections-container");
  const addSectionBtn = $("#add-section-btn");
  const form = $("#dynamic-form");

  // Function to load XML data and populate the form
  function loadXMLData() {
    $.ajax({
      url: "/get-xml", // Endpoint URL
      method: "GET", // HTTP method
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: function (data) {
        if (data.sections && Array.isArray(data.sections)) {
          data.sections.forEach((section) => {
            createSectionInitialGet(section.name, section.keyValues);
          });
        }
      },
      error: function (er) {
        if (er.status == 403) {
          alert("Token Expired");
          window.location.href = "/admin";
        }
        console.log("Error loading XML file or no XML file present.");
      },
    });
  }

  // Function to create a new section with name and key-value pairs
  function createSectionInitialGet(sectionName, keyValues = []) {
    const section = $(`
            <div class="section card mb-3 p-3 border-primary">
                <div class="mb-3 card-header">
                    <h5>Section Name</h5>
                    <input type="text" name="sectionName" class="form-control" value="${sectionName}" required>
                </div>
                <div class="key-value-container"></div>
                <div class="f-spaced-evenly">
                    <button type="button" class="btn btn-secondary add-key-value-btn">Add Key-Value Pair</button>
                    <button type="button" class="btn btn-danger remove-section-btn">Remove Section</button>
                </div>
            </div>
        `);

    // Add key-value pairs dynamically if available
    keyValues.forEach((kv) => {
      addKeyValuePair(section.find(".key-value-container"), kv.key, kv.value);
    });

    sectionsContainer.append(section);

    // Add functionality to the Remove Section button
    section.find(".remove-section-btn").on("click", function () {
      section.remove();
    });

    // Add functionality to the Add Key-Value Pair button
    section.find(".add-key-value-btn").on("click", function () {
      addKeyValuePair(section.find(".key-value-container"));
    });
  }

  // Function to create a new section with name and key-value pairs
  function createSection() {
    const section = $(`
            <div class="section card mb-3 p-3 border-primary">
                <div class="mb-3 card-header">
                    <h5>Section Name</h5>
                    <input type="text" name="sectionName" class="form-control" value="" placeholder="Section Name" required>
                </div>
                <div class="key-value-container"></div>
                <div class="f-spaced-evenly">
                    <button type="button" class="btn btn-secondary add-key-value-btn">Add Key-Value Pair</button>
                    <button type="button" class="btn btn-danger remove-section-btn">Remove Section</button>
                </div>
            </div>
        `);

    sectionsContainer.append(section);

    // Add functionality to the Remove Section button
    section.find(".remove-section-btn").on("click", function () {
      section.remove();
    });

    // Add functionality to the Add Key-Value Pair button
    section.find(".add-key-value-btn").on("click", function () {
      addKeyValuePair(section.find(".key-value-container"));
    });
  }

  // Function to add a key-value pair to the form
  function addKeyValuePair(container, key = "", value = "") {
    const keyValuePair = $(`
            <div class="key-value-pair mb-2 row g-2 align-items-center">
                <div class="col">
                    <input type="text" name="key[]" class="form-control" placeholder="Key (e.g. Position)" value="${key}" required>
                </div>
                <div class="col">
                    <input type="text" name="value[]" class="form-control" placeholder="Value (e.g. Developer)" value="${value}" required>
                </div>
                <div class="col-auto">
                    <button type="button" class="btn btn-danger remove-key-value-btn">Remove</button>
                </div>
            </div>
        `);

    // Add remove key-value functionality
    keyValuePair.find(".remove-key-value-btn").on("click", function () {
      keyValuePair.remove();
    });

    container.append(keyValuePair);
  }

  // Form submission handler to save the XML file
  form.on("submit", function (event) {
    event.preventDefault();

    const sections = [];
    let valid = true; // To track form validity

    $(".section").each(function () {
      const name = $(this).find('input[name="sectionName"]').val();

      // Validate section name (cannot be empty)
      if (!name.trim()) {
        valid = false;
        alert("Section name is required.");
        return false;
      }

      const keyValues = [];
      $(this)
        .find(".key-value-pair")
        .each(function () {
          const key = $(this).find('input[name="key[]"]').val();
          const value = $(this).find('input[name="value[]"]').val();
          if (key && value) {
            keyValues.push({ key, value });
          }
        });

      if (keyValues.length > 0 && name) {
        sections.push({ name, keyValues });
      }
    });

    if (!valid) return;

    // Generate the XML and send it to the server for saving
    const xmlContent = generateXML(sections);
    saveXMLToServer(xmlContent);
  });

  // Function to generate XML from form data
  function generateXML(sections) {
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<sections>\n`;

    sections.forEach(({ name, keyValues }) => {
      xmlContent += `  <section>\n    <name>${name}</name>\n`;
      keyValues.forEach(({ key, value }) => {
        // Dynamic tags for each key (Position, Project, etc.)
        xmlContent += `    <${key}>${value}</${key}>\n`;
      });
      xmlContent += `  </section>\n`;
    });

    xmlContent += `</sections>`;

    return xmlContent;
  }

  // Function to save XML to the server
  function saveXMLToServer(xmlContent) {
    $.ajax({
      url: "/save-xml",
      method: "POST",
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify({ xmlContent }),
      success: function (response) {
        alert(response.message);
      },
      error: function (er) {
        if (er.status == 403) {
          alert("Token Expired");
          window.location.href = "/admin";
        }
        alert("Error saving XML to server");
      },
    });
  }

  // Initial load of XML data when page loads
  loadXMLData();
  addSectionBtn.on("click", createSection);
});
