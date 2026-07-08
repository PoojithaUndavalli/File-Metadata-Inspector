// Elements
const fileInput = document.getElementById("fileInput");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");
const previewContainer = document.getElementById("previewContainer");

// Metadata Fields
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const mimeType = document.getElementById("mimeType");
const modifiedDate = document.getElementById("modifiedDate");
const dimensions = document.getElementById("dimensions");

const cameraMake = document.getElementById("cameraMake");
const cameraModel = document.getElementById("cameraModel");
const dateTaken = document.getElementById("dateTaken");
const lensModel = document.getElementById("lensModel");
const orientation = document.getElementById("orientation");
const gpsLat = document.getElementById("gpsLat");
const gpsLong = document.getElementById("gpsLong");

// Browse Button
browseBtn.addEventListener("click", () => fileInput.click());

// File Input
fileInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
        handleFile(e.target.files[0]);
    }
});

// Drag Events
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

    if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
    }
});

// Main Function
function handleFile(file) {

    const allowed = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf"
    ];

    if (!allowed.includes(file.type)) {
        alert("Only Images and PDFs are supported.");
        return;
    }

    showBasicMetadata(file);

    if (file.type.startsWith("image")) {
        showImage(file);
    } else {
        showPDF(file);
    }
}

// Browser Metadata
function showBasicMetadata(file) {

    fileName.textContent = file.name;
    fileSize.textContent = formatSize(file.size);
    mimeType.textContent = file.type;
    modifiedDate.textContent = new Date(file.lastModified).toLocaleString();
}

// Format Bytes
function formatSize(bytes) {

    if (bytes < 1024)
        return bytes + " Bytes";

    if (bytes < 1024 * 1024)
        return (bytes / 1024).toFixed(2) + " KB";

    return (bytes / 1024 / 1024).toFixed(2) + " MB";
}

// Image Preview
function showImage(file) {

    const reader = new FileReader();

    reader.onload = function (event) {

        previewContainer.innerHTML = "";

        const img = document.createElement("img");

        img.src = event.target.result;

        previewContainer.appendChild(img);

        img.onload = function () {

            dimensions.textContent =
                img.naturalWidth + " × " + img.naturalHeight;

            loadExif(img);
        };
    };

    reader.readAsDataURL(file);
}

// PDF Preview
function showPDF(file) {

    dimensions.textContent = "-";

    clearExif();

    const url = URL.createObjectURL(file);

    previewContainer.innerHTML = `
        <iframe src="${url}"></iframe>
    `;
}

// EXIF
function loadExif(image) {

    EXIF.getData(image, function () {

        cameraMake.textContent =
            EXIF.getTag(this, "Make") || "-";

        cameraModel.textContent =
            EXIF.getTag(this, "Model") || "-";

        dateTaken.textContent =
            EXIF.getTag(this, "DateTimeOriginal") || "-";

        lensModel.textContent =
            EXIF.getTag(this, "LensModel") || "-";

        orientation.textContent =
            EXIF.getTag(this, "Orientation") || "-";

        gpsLat.textContent =
            convertGPS(EXIF.getTag(this, "GPSLatitude"));

        gpsLong.textContent =
            convertGPS(EXIF.getTag(this, "GPSLongitude"));
    });
}

// Convert GPS
function convertGPS(gps) {

    if (!gps)
        return "-";

    let d = gps[0];
    let m = gps[1];
    let s = gps[2];

    return (
        d +
        "° " +
        m +
        "' " +
        s.toFixed(2) +
        '"'
    );
}

// Reset EXIF
function clearExif() {

    cameraMake.textContent = "-";
    cameraModel.textContent = "-";
    dateTaken.textContent = "-";
    lensModel.textContent = "-";
    orientation.textContent = "-";
    gpsLat.textContent = "-";
    gpsLong.textContent = "-";
}
