import { registerUser, loginUser } from '../services/userService';

const handleRegister = async (req, res) => {
    try {
        // Get user data from request body
        const userData = req.body;
        const data = await registerUser(userData);
        
        if (data.EC === 0) {
            res.redirect('/login?registerSuccess=true');
        } else {
            res.render('web/register', { error: data.EM });
        }
        
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
};

const handleLogin = async (req, res) => {
    try {
        const userData = req.body;
        const data = await loginUser(userData);

        if (data.EC === 0) {
            // Lưu thông tin người dùng vào session trong req để trả về ejs
            req.session.user = data.DT;
            console.log(data.DT)
            if(data.DT.group === 'customer') {
                res.redirect('/');
            }
            else if (data.DT.group === 'admin') {
                res.redirect('/admin')
            }
        } else {
            // Nếu đăng nhập thất bại, chuyển hướng đến trang login và hiển thị thông báo lỗi
            res.render('web/login', { error: data.EM, title: 'Đăng nhập' });
        }
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const handleLogout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            } else {
                res.redirect('/');
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export { handleRegister, handleLogin, handleLogout };
