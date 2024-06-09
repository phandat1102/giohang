const handleGetAdminHomePage = (req, res) => {
    try {
        const user = req.session.user;
        return res.render("admin/adminHome", { title: 'Trang chủ admin', user });

    } catch (error) {
        console.error('Error getting newest books:', error);
        return res.status(500).send('Internal Server Error');
    }
};



export {
    handleGetAdminHomePage, 
}