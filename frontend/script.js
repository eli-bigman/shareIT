import { apiService } from './services/api.js';

class FileUploader {
    constructor() {
        this.fileInput = document.getElementById('fileInput');
        this.uploadButton = document.getElementById('uploadButton');
        this.uploadError = document.getElementById('uploadError');
        this.filesList = document.getElementById('filesList');
        this.loginSection = document.getElementById('loginSection');
        this.uploadSection = document.getElementById('uploadSection');
        this.fileList = document.getElementById('fileList');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.loginButton = document.getElementById('loginButton');
        this.loginError = document.getElementById('loginError');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.loginButton.addEventListener('click', () => this.handleLogin());
        this.uploadButton.addEventListener('click', () => this.handleUpload());
    }

    async handleLogin() {
        const username = this.usernameInput.value;
        const password = this.passwordInput.value;

        if (!username || !password) {
            this.loginError.textContent = 'Please enter both username and password';
            return;
        }

        try {
            await apiService.login(username, password);
            this.loginError.textContent = '';
            this.loginSection.style.display = 'none';
            this.uploadSection.style.display = 'block';
            this.fileList.style.display = 'block';
            await this.loadFiles();
        } catch (error) {
            this.loginError.textContent = 'Login failed. Please check your credentials.';
            console.error('Login error:', error);
        }
    }

    async handleUpload() {
        const file = this.fileInput.files[0];
        if (!file) {
            this.uploadError.textContent = 'Please select a file';
            return;
        }

        try {
            await apiService.uploadFile(file);
            this.uploadError.textContent = '';
            await this.loadFiles();
            this.fileInput.value = ''; // Clear the file input
        } catch (error) {
            this.uploadError.textContent = 'Error uploading file';
            console.error('Upload error:', error);
        }
    }

    async loadFiles() {
        try {
            const files = await apiService.getFiles();
            this.filesList.innerHTML = files.map(file => `
                <div class="file-item">
                    <span>${file.originalName}</span>
                    <button data-file-id="${file.id}" class="download-btn">Download</button>
                </div>
            `).join('');

            // Add event listeners to download buttons
            this.filesList.querySelectorAll('.download-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const fileId = e.currentTarget.dataset.fileId;
                    this.handleDownload(fileId);
                });
            });
        } catch (error) {
            console.error('Error loading files:', error);
        }
    }

    async handleDownload(fileId) {
        try {
            const response = await apiService.downloadFile(fileId);
            const blob = await response.blob();
            const contentDisposition = response.headers.get('content-disposition');
            let filename = 'downloaded-file';
            
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download file. Please try again.');
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FileUploader();
}); 