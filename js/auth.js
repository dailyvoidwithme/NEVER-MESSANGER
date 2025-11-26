const storage = new StorageManager();

function showRegister() {
    const form = document.querySelector('.auth-form') || document.getElementById('loginForm');
    if (form) {
        form.innerHTML = `
            <h2>Register for NEVER MESSANGER</h2>
            <form id="registerForm">
                <input type="text" id="newUserID" placeholder="Choose Unique ID" required>
                <input type="text" id="newUsername" placeholder="Choose Username" required>
                <button type="submit">Register & Login</button>
            </form>
            <p>Already have an account? <a href="#" onclick="showLogin()">Login here</a></p>
        `;
        
        document.getElementById('registerForm').addEventListener('submit', handleRegister);
    }
}

function showLogin() {
    location.reload();
}

function handleRegister(e) {
    e.preventDefault();
    
    const userID = document.getElementById('newUserID').value.trim();
    const username = document.getElementById('newUsername').value.trim();
    
    if (userID && username) {
        const users = storage.getUsers();
        
        if (users.find(user => user.id === userID)) {
            alert('User ID already exists! Please choose a different one.');
            return;
        }
        
        const newUser = {
            id: userID,
            username: username,
            joined: new Date().toISOString()
        };
        
        storage.saveUser(newUser);
        storage.setCurrentUser(newUser);
        window.location.href = 'chat.html';
    }
}

if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userID = document.getElementById('userID').value.trim();
        const username = document.getElementById('username').value.trim();
        
        const user = storage.getUserById(userID);
        
        if (user && user.username === username) {
            storage.setCurrentUser(user);
            window.location.href = 'chat.html';
        } else {
            alert('Invalid credentials! Please check your ID and username.');
        }
    });
}

function logout() {
    storage.clearCurrentUser();
    window.location.href = 'index.html';
}
