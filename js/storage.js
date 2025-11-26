class StorageManager {
    constructor() {
        this.usersKey = 'never_messanger_users';
        this.messagesKey = 'never_messanger_messages';
        this.currentUserKey = 'never_messanger_current_user';
    }

    // User management
    getUsers() {
        return JSON.parse(localStorage.getItem(this.usersKey)) || [];
    }

    saveUser(user) {
        const users = this.getUsers();
        const existingUser = users.find(u => u.id === user.id);
        
        if (existingUser) {
            Object.assign(existingUser, user);
        } else {
            users.push(user);
        }
        
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    getUserById(id) {
        const users = this.getUsers();
        return users.find(user => user.id === id);
    }

    // Message management
    getMessages() {
        return JSON.parse(localStorage.getItem(this.messagesKey)) || [];
    }

    saveMessage(message) {
        const messages = this.getMessages();
        messages.push({
            ...message,
            timestamp: new Date().toISOString(),
            id: Date.now().toString()
        });
        localStorage.setItem(this.messagesKey, JSON.stringify(messages));
    }

    // Current user management
    setCurrentUser(user) {
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem(this.currentUserKey));
    }

    clearCurrentUser() {
        localStorage.removeItem(this.currentUserKey);
    }

    // File handling
    saveFile(file, callback) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileData = {
                name: file.name,
                type: file.type,
                size: file.size,
                data: e.target.result,
                timestamp: new Date().toISOString()
            };
            callback(fileData);
        };
        reader.readAsDataURL(file);
    }
}
