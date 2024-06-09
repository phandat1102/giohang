import { getBillsPerPage } from "../services/billService";

const handleGetAdminListBillPage = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        // Số lượng item trên mỗi trang
        const limit = parseInt(req.query.limit) || 3;

        const { EM, EC, DT } = await getBillsPerPage(page, limit);
        if (EC === 0) {
            const user = req.session.user;
            res.render('admin/bill/list_bills', { title: 'List Bills', dataBills: DT, user });
        } else {
            console.error(EM);
            res.status(500).send('Internal Server Error');
        }
    } catch (error) {
        console.error('Error fetching bills:', error);
        res.status(500).send('Internal Server Error');
    }
};

export {
    handleGetAdminListBillPage
}