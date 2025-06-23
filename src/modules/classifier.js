import { showSunSpinner } from "./ui.js";

// DOM elements for image upload and classification
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const classifyButton = document.getElementById('classifyButton');
const resultContainer = document.getElementById('resultContainer');


// Collapsible logic for Cloud Classifier
const toggleBtn = document.getElementById('toggleClassifier');
const content = document.getElementById('cloudClassifierContent');
const icon = document.getElementById('toggleIcon');

// Handle image upload
imageInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) {
        resultContainer.innerHTML = '<p>Please select an image file.</p>';
        return;
    }

    if (!(file.type === 'image/jpeg' || file.type === 'image/png')) {  // Validate file type - onkly allow JPEG and PNG
        resultContainer.innerHTML = '<p class="text-red-600">Please upload a JPEG or PNG image.</p>';
        classifyButton.disabled = true;
        return;
    }

    // Display image preview
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        classifyButton.disabled = false;
    };
    reader.onerror = (error) => {
        resultContainer.innerHTML = '<p>Error loading image preview.</p>';
        classifyButton.disabled = true;
    };
    reader.readAsDataURL(file);
});

// Handle classify button click
classifyButton.addEventListener('click', async () => {
    const file = imageInput.files[0];
    if (!file) {
        resultContainer.innerHTML = '<p>Please upload an image first.</p>';
        return;
    }

    showSunSpinner('resultContainer');  // Show rotating sun spinner while processing

    try {
        // Preprocess image: resize to 224x224
        const blob = await resizeImage(file);

        // Convert blob to base64
        const base64Image = await blobToBase64(blob);

        // Send to backend
        const response = await fetch('https://csc435-wk8assignment.netlify.app/.netlify/functions/classify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: base64Image,
                labels: ['cumulus', 'stratus', 'cirrus', 'cirrocumulus', 'cirrostratus', 'altostratus', 'altocumulus', 'stratocumulus', 'nimbostratus', 'cumulonimbus']
            })
        });

        const result = await response.json();
        if (response.ok) {  // Display the top label or a non-cloud message 
            
            if (result.labels && result.labels.length > 0) { 
                resultContainer.innerHTML = `<p class="text-white mb-4 text-center" style="font-family: 'Quicksand', sans-serif;">That looks like a ${result.labels[0].name} cloud</p>`;
            } else {
                resultContainer.innerHTML = `<p class="text-white mb-4 text-center" style="font-family: 'Quicksand', sans-serif;">That doesn\'t look like a cloud</p>`;
            }
        } else {
            throw new Error(result.error || 'Classification failed');
        }
    } catch (error) {
        resultContainer.innerHTML = `<p class="text-white mb-4 text-center" style="font-family: 'Quicksand', sans-serif;">Error: ${error.message}</p>`;
    }
});

// Function to resize image to 224x224
export async function resizeImage(file) {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise(resolve => img.onload = resolve);

    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 224, 224);

    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            URL.revokeObjectURL(img.src);
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error('Failed to resize image'));
            }
        }, 'image/jpeg');
    });
}

export function blobToBase64(blob) {  // Convert blob to base64
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result.split(',')[1]); // Extract base64 data
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// Helper functions to expand/collapse classifier content
function expandContent() {
  content.hidden = false;
  content.style.maxHeight = 'none';
  const fullHeight = content.scrollHeight + 'px';
  content.style.maxHeight = '0';
  setTimeout(() => {
    content.style.maxHeight = fullHeight;
    content.style.opacity = '1';
    content.style.pointerEvents = 'auto';
    icon.style.transform = 'rotate(180deg)';
  }, 10);
}

function collapseContent() {
  content.style.maxHeight = '0';
  content.style.opacity = '0';
  content.style.pointerEvents = 'none';
  setTimeout(() => {
    content.hidden = true;
    icon.style.transform = 'rotate(0deg)';
  }, 300);
}

toggleBtn.addEventListener('click', () => {
  const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
  toggleBtn.setAttribute('aria-expanded', !expanded);
  if (expanded) {
    collapseContent();
  } else {
    expandContent();
  }
});

// Watch for content changes and adjust max-height
const observer = new MutationObserver(() => {
  if (!content.hidden) {
    content.style.maxHeight = 'none';
    const fullHeight = content.scrollHeight + 'px';
    content.style.maxHeight = fullHeight;
  }
});
observer.observe(content, { childList: true, subtree: true, characterData: true });

// Also listen for image load events (for preview images)
if (imagePreview) {
  imagePreview.addEventListener('load', () => {
    if (!content.hidden) {
      content.style.maxHeight = 'none';
      const fullHeight = content.scrollHeight + 'px';
      content.style.maxHeight = fullHeight;
    }
  });
}