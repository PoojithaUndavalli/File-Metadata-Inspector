// ============================
// DOM Elements
// ============================

const fileInput = document.getElementById("fileInput");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");
const previewContainer = document.getElementById("previewContainer");

// Browser Metadata
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const mimeType = document.getElementById("mimeType");
const modifiedDate = document.getElementById("modifiedDate");
const dimensions = document.getElementById("dimensions");

// EXIF Metadata
const cameraMake = document.getElementById("cameraMake");
const cameraModel = document.getElementById("cameraModel");
const dateTaken = document.getElementById("dateTaken");
const lensModel = document.getElementById("lensModel");
const orientation = document.getElementById("orientation");
const gpsLat = document.getElementById("gpsLat");
const gpsLong = document.getElementById("gpsLong");

// ============================
// Browse Button
// ============================

browseBtn.addEventListener("click", () => {
    fileInput.click();
});

// ============================
// File Input
// ============================

fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

// ============================
// Drag & Drop
// ============================

dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("active");
});

dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("active");
});

dropArea.addEventListener("drop", (e) => {
    e.preventDefault();

    dropArea.classList.remove("active");

    if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
    }
});

// ============================
// Main Function
// ============================

function handleFile(file) {

    const supportedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf"
    ];

    if (!supportedTypes.includes(file.type)) {

        alert("Only Images and PDFs are supported.");

        return;
    }

    displayBrowserMetadata(file);

    if (file.type.startsWith("image")) {

        displayImage(file);

    } else {

        displayPDF(file);

    }
}

// ============================
// Browser Metadata
// ============================

function displayBrowserMetadata(file) {

    fileName.textContent = file.name;

    fileSize.textContent = formatFileSize(file.size);

    mimeType.textContent = file.type;

    modifiedDate.textContent =
        new Date(file.lastModified).toLocaleString();
}

// ============================
// Image Preview
// ============================

function displayImage(file) {

    clearExif();

    const reader = new FileReader();

    reader.onload = function (event) {

        previewContainer.innerHTML = "";

        const img = document.createElement("img");

        img.src = event.target.result;

        previewContainer.appendChild(img);

        img.onload = function () {

            dimensions.textContent =
                `${img.naturalWidth} × ${img.naturalHeight}`;

            loadEXIF(file);

        };

    };

    reader.readAsDataURL(file);
}

// ============================
// PDF Preview
// ============================

function displayPDF(file) {

    clearExif();

    dimensions.textContent = "-";

    const url = URL.createObjectURL(file);

    previewContainer.innerHTML = `
        <iframe src="${url}" width="100%" height="550"></iframe>
    `;
}

// ============================
// EXIF Metadata
// ============================

function loadEXIF(file) {

    EXIF.getData(file, function () {

        cameraMake.textContent =
            EXIF.getTag(this, "Make") || "Not Available";

        cameraModel.textContent =
            EXIF.getTag(this, "Model") || "Not Available";

        dateTaken.textContent =
            EXIF.getTag(this, "DateTimeOriginal") || "Not Available";

        lensModel.textContent =
            EXIF.getTag(this, "LensModel") || "Not Available";

        orientation.textContent =
            EXIF.getTag(this, "Orientation") || "Not Available";

        const lat =
            EXIF.getTag(this, "GPSLatitude");

        const latRef =
            EXIF.getTag(this, "GPSLatitudeRef");

        const lon =
            EXIF.getTag(this, "GPSLongitude");

        const lonRef =
            EXIF.getTag(this, "GPSLongitudeRef");

        gpsLat.textContent =
            convertGPS(lat, latRef);

        gpsLong.textContent =
            convertGPS(lon, lonRef);

    });

}

// ============================
// Convert GPS Coordinates
// ============================

function convertGPS(coords, ref) {

    if (!coords)
        return "Not Available";

    const degrees = Number(coords[0]);

    const minutes = Number(coords[1]);

    const seconds = Number(coords[2]);

    let decimal =
        degrees +
        minutes / 60 +
        seconds / 3600;

    if (ref === "S" || ref === "W")
        decimal *= -1;

    return decimal.toFixed(6);
}

// ============================
// Format File Size
// ============================

function formatFileSize(bytes) {

    if (bytes < 1024)
        return `${bytes} Bytes`;

    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(2)} KB`;

    if (bytes < 1024 * 1024 * 1024)
        return `${(bytes / 1024 / 1024).toFixed(2)} MB`;

    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

// ============================
// Clear EXIF Fields
// ============================

function clearExif() {

    cameraMake.textContent = "-";
    cameraModel.textContent = "-";
    dateTaken.textContent = "-";
    lensModel.textContent = "-";
    orientation.textContent = "-";
    gpsLat.textContent = "-";
    gpsLong.textContent = "-";
}
