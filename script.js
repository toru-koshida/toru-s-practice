function convertToMP3() {
    const mp4Input = document.getElementById('mp4Input');
    
    if (mp4Input.files.length > 0) {
        const mp4File = mp4Input.files[0];
        const formData = new FormData();
        formData.append('mp4File', mp4File);

        fetch('/convert', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const downloadLink = document.getElementById('downloadLink');
                downloadLink.href = data.mp3Url;
                downloadLink.download = 'converted.mp3';
                downloadLink.style.display = 'block';
            } else {
                alert('Conversion failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    } else {
        alert('Please select an MP4 file.');
    }
}
