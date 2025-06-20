// DOM elements
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const classifyButton = document.getElementById('classifyButton');
const resultContainer = document.getElementById('resultContainer');

// Verify DOM elements exist
if (!imageInput || !imagePreview || !classifyButton || !resultContainer) {
    console.error('One or more DOM elements not found:', {
        imageInput, imagePreview, classifyButton, resultContainer
    });
    resultContainer.innerHTML = '<p>Error: Page elements not loaded correctly.</p>';
}

// Collapsible logic for Cloud Classifier
const toggleBtn = document.getElementById('toggleClassifier');
const content = document.getElementById('cloudClassifierContent');
const icon = document.getElementById('toggleIcon');

// Handle image upload
imageInput.addEventListener('change', async (event) => {
    console.log('Image input changed');
    const file = event.target.files[0];
    if (!file) {
        console.error('No file selected');
        resultContainer.innerHTML = '<p>Please select an image file.</p>';
        return;
    }

    console.log('Selected file:', file.name, file.type);

    // Validate file type
    if (!file.type.startsWith('image/')) {
        console.error('Invalid file type:', file.type);
        resultContainer.innerHTML = '<p>Please upload a valid image file (e.g., JPEG, PNG).</p>';
        classifyButton.disabled = true;
        return;
    }

    // Display image preview
    const reader = new FileReader();
    reader.onload = (e) => {
        console.log('FileReader loaded image');
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        classifyButton.disabled = false;
        console.log('Classify button enabled');
    };
    reader.onerror = (error) => {
        console.error('FileReader error:', error);
        resultContainer.innerHTML = '<p>Error loading image preview.</p>';
        classifyButton.disabled = true;
    };
    reader.readAsDataURL(file);
});

// Handle classify button click
classifyButton.addEventListener('click', async () => {
    console.log('Classify button clicked');
    const file = imageInput.files[0];
    if (!file) {
        console.error('No file available for classification');
        resultContainer.innerHTML = '<p>Please upload an image first.</p>';
        return;
    }

    resultContainer.innerHTML = '<p>Classifying...</p>';

    try {
        // Preprocess image: resize to 224x224
        console.log('Resizing image');
        const blob = await resizeImage(file);

        // Convert blob to base64
        const base64Image = await blobToBase64(blob);

        // Send to backend
        console.log('Sending request to backend');
        const response = await fetch('http://localhost:3000/classify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: base64Image,
                labels: ['cumulus', 'stratus', 'cirrus', 'nimbus', 'altocumulus', 'stratocumulus']
            })
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Backend response:', result);
            // Display the top label or a non-cloud message
            if (result.labels && result.labels.length > 0) {
                resultContainer.innerHTML = `<p>That looks like a ${result.labels[0].name} cloud</p>`;
            } else {
                resultContainer.innerHTML = '<p>That doesn\'t look like a cloud</p>';
            }
        } else {
            throw new Error(result.error || 'Classification failed');
        }
    } catch (error) {
        console.error('Classification error:', error);
        resultContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});

// Function to resize image to 224x224
export async function resizeImage(file) {
    console.log('Starting image resize');
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
                console.log('Image resized successfully');
                resolve(blob);
            } else {
                console.error('Failed to create blob');
                reject(new Error('Failed to resize image'));
            }
        }, 'image/jpeg');
    });
}

// Convert blob to base64
export function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result.split(',')[1]); // Extract base64 data
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}


// Collapsible logic for Cloud Classifier with dynamic max-height
//const toggleBtn = document.getElementById('toggleClassifier');
//const content = document.getElementById('cloudClassifierContent');
//const icon = document.getElementById('toggleIcon');

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