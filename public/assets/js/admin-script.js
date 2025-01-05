$(document).ready(function () {
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
      data: JSON.stringify({ xmlContent }),
      success: function (response) {
        alert(response.message);
      },
      error: function () {
        alert("Error saving XML to server");
      },
    });
  }

  // Initial load of XML data when page loads
  loadXMLData();
  addSectionBtn.on("click", createSection);
});
