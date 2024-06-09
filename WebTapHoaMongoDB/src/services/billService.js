import Bill from '../models/billSchema';
import BillDetail from '../models/billDetailSchema';
import { format } from 'date-fns';

export const createBill = async (billData, billDetailData) => {
    const session = await Bill.startSession();
    session.startTransaction();
    try {
        const options = { session };

        // Create new bill
        const newBill = new Bill(billData);
        await newBill.save(options);

        // Create new bill details
        const billDetails = billDetailData.map(detail => ({
            billId: newBill._id,
            product: detail.product,
            price: detail.price,
            quantity: detail.quantity
        }));
        await BillDetail.insertMany(billDetails, options);

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return {
            EM: 'Bill created successfully!',
            EC: 0
        };
    } catch (error) {
        // Rollback the transaction if any error occurs
        await session.abortTransaction();
        session.endSession();
        console.error('Error creating bill:', error);
        return {
            EM: 'Failed to create bill',
            EC: -1
        };
    }
};


export const getBillsPerPage = async (page, limit) => {
    try {
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        const skip = (pageNumber - 1) * limitNumber;
        // Lấy tổng số hóa đơn
        const totalBills = await Bill.countDocuments();
        // Tính tổng số trang
        const totalPages = Math.ceil(totalBills / limitNumber);
        // Lấy danh sách hóa đơn phân trang
        // lean () => lay doi tuong ve dang javascript
        const bills = await Bill.find().skip(skip).limit(limitNumber).lean();
        bills.forEach(bill => {
            bill.saleDate = format(bill.saleDate, "dd/MM/yyyy HH:mm");
        });
        return {
            EM: 'Get bills successfully',
            EC: 0,
            DT: {
                bills,
                totalPages // Trả về tổng số trang cùng với danh sách hóa đơn
            }
        };
    } catch (error) {
        console.error('Error getting bills:', error);
        return {
            EM: 'Failed to get bills',
            EC: -1
        };
    }
};