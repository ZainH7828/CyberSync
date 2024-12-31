const bcrypt = require('bcryptjs');

// Replace 'password1' with the actual password you want to hash
const password = 'password1';

bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    console.log('Hashed password:', hash);
});