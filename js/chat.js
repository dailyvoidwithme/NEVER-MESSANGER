const storage = new StorageManager();
let currentUser = storage.getCurrentUser();

document.addEventListener('DOMContentLoaded', function() {
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('currentUsername').textContent = currentUser.username;
    loadMessages();
    updateOnlineUsers();
    
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
    setInterval(loadMessages, 2000);
});

function loadMessages() {
    const messagesContainer = document.getElementById('messages');
    const messages = storage.getMessages();
    
    messagesContainer.innerHTML = '';
    
    messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.senderId === currentUser.id ? 'own' : ''}`;
        
        let content = `
            <strong>${msg.sender}</strong>
            <small>${new Date(msg.timestamp).toLocaleString()}</small>
            <br>
        `;
        
        if (msg.file) {
            if (msg.file.type.startsWith('image/')) {
                content += `<div class="file-preview"><img src="${msg.file.data}" alt="${msg.file.name}"></div>`;
            } else if (msg.file.type.startsWith('video/')) {
                content += `
                    <div class="file-preview">
                        <video controls>
                            <source src="${msg.file.data}" type="${msg.file.type}">
                            Your browser does not support the video tag.
                        </video>
                        <p>${msg.file.name}</p>
                    </div>
                `;
            } else {
                content += `
                    <div class="file-preview">
                        <a href="${msg.file.data}" download="${msg.file.name}">
                            📎 ${msg.file.name} (${formatFileSize(msg.file.size)})
                        </a>
                    </div>
                `;
            }
        }
        
        if (msg.text) {
            content += `<p>${msg.text}</p>`;
        }
        
        messageDiv.innerHTML = content;
        messagesContainer.appendChild(messageDiv);
    });
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const text = messageInput.value.trim();
    const fileInput = document.getElementById('fileInput');
    
    if (!text && fileInput.files.length === 0) return;
    
    const message = {
        senderId: currentUser.id,
        sender: currentUser.username,
        text: text
    };
    
    if (fileInput.files.length > 0) {
        storage.saveFile(fileInput.files[0], function(fileData) {
            message.file = fileData;
            storage.saveMessage(message);
            messageInput.value = '';
            fileInput.value = '';
            loadMessages();
        });
    } else {
        storage.saveMessage(message);
        messageInput.value = '';
        loadMessages();
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        sendMessage();
    }
}

function updateOnlineUsers() {
    const usersList = document.getElementById('usersList');
    const users = storage.getUsers();
    
    usersList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user.username;
        usersList.appendChild(li);
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

document.getElementById('messageInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
