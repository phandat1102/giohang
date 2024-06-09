import User from '../models/userSchema';
import bcrypt from 'bcrypt';

const checkExistingEmail = async (email) => {
    try {
        const existingUser = await User.findOne({ email });
        return existingUser !== null;
    } catch (error) {
        console.log("Error: ", error);
        return {
            EM: 'Something wrong in service...',
            EC: -2
        }
    }
};

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.log("Error: ", error);
        return {
            EM: 'Something wrong in service...',
            EC: -2
        }
    }
};

const registerUser = async (userData) => {
    try {
        const [emailExists] = await Promise.all([
            checkExistingEmail(userData.email),
        ]);
        
        if (!emailExists) {
            // Hash the password
            const hashedPassword = await hashPassword(userData.password);
            userData.password = hashedPassword;
            // Set default group to 'customer'
            userData.group = 'customer';
            // Create a new user instance
            const newUser = new User(userData);
            // Save the user to the database
            await newUser.save();
            
            return {
                EM: 'Register successfully!',
                EC: 0,
                DT: ''
            };
        } else {
            return {
                EM: 'Email already exists',
                EC: -1,
            };
        }
    } catch (error) {
        console.log("Error: ", error);
        return {
            EM: 'Something wrong in service...',
            EC: -2
        }
    }
};

const loginUser = async (userData) => {
    try {
        // Kiểm tra xem người dùng có tồn tại ko
        const user = await User.findOne({ email: userData.email });

        if (user) {
            // Nếu người dùng tồn tại, kiểm tra mật khẩu
            const validPassword = await bcrypt.compare(userData.password, user.password);
            
            if (validPassword) {
                // Xóa trường mật khẩu từ đối tượng người dùng trước khi trả về
                const userWithoutPassword = { ...user.toObject() };
                delete userWithoutPassword.password;

                return {
                    EM: 'Login successfully!',
                    EC: 0,
                    DT: userWithoutPassword
                };
            } else {
                // mật khẩu sai
                return {
                    EM: 'Invalid email or password',
                    EC: -1
                };
            }
        } else {
            // Nếu người dùng không tồn tại
            return {
                EM: 'Invalid email or password',
                EC: -1
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            EM: 'Something went wrong',
            EC: -2
        };
    }
};


export { registerUser, loginUser };
