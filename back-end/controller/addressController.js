import AddressModel from "../models/addressModel.js";
import userModel from "../models/userModel.js"; // Đảm bảo người dùng tồn tại

export const createAddress = async (req, res) => {
  const { street, ward, district, province, isDefault } = req.body;
  const { userId } = req.user; // Lấy userId từ req.user sau khi đã xác thực

  try {
    // Kiểm tra người dùng có tồn tại không
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Lấy danh sách địa chỉ của người dùng
    const existingAddresses = await AddressModel.find({ user: userId });

    // Nếu người dùng chưa có địa chỉ nào, đặt isDefault = true
    const isAddressDefault = existingAddresses.length === 0 ? true : isDefault;

    // Nếu isDefault = true, cập nhật các địa chỉ khác của người dùng để không còn là mặc định
    if (isAddressDefault) {
      await AddressModel.updateMany(
        { user: userId, isDefault: true },
        { isDefault: false }
      );
    }

    // Tạo địa chỉ mới
    const address = new AddressModel({
      user: userId,
      street,
      ward,
      district,
      province,
      isDefault: isAddressDefault,
    });
    await address.save();

    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAddresses = async (req, res) => {
  const { userId } = req.user; // Lấy userId từ req.user sau khi đã xác thực

  try {
    // Kiểm tra người dùng có tồn tại không
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Lấy danh sách địa chỉ của người dùng
    const addresses = await AddressModel.find({ user: userId });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAddress = async (req, res) => {
  const { addressId } = req.params;
  const { street, ward, district, province, isDefault } = req.body;
  const { userId } = req.user; // Lấy userId từ người dùng đã đăng nhập

  try {
    // Tìm địa chỉ theo ID và quyền sở hữu
    const address = await AddressModel.findOne({
      _id: addressId,
      user: userId,
    });
    if (!address) {
      return res.status(404).json({
        message: "Địa chỉ không tồn tại hoặc không thuộc về người dùng",
      });
    }

    // Nếu `isDefault` = true, cập nhật các địa chỉ khác của người dùng để không còn là mặc định
    if (isDefault) {
      await AddressModel.updateMany(
        { user: userId, isDefault: true },
        { isDefault: false }
      );
    }

    // Cập nhật thông tin địa chỉ
    address.street = street || address.street;
    address.ward = ward || address.ward;
    address.district = district || address.district;
    address.province = province || address.province;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    await address.save();

    res.status(200).json({ message: "Cập nhật địa chỉ thành công", address });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  const { addressId } = req.params;
  const { userId } = req.user; // Lấy userId từ người dùng đã đăng nhập

  try {
    // Tìm địa chỉ theo ID và kiểm tra quyền sở hữu
    const address = await AddressModel.findOne({
      _id: addressId,
      user: userId,
    });

    // Kiểm tra xem địa chỉ có tồn tại hay không
    if (!address) {
      return res.status(404).json({
        message: "Địa chỉ không tồn tại hoặc không thuộc về người dùng",
      });
    }

    // Kiểm tra nếu địa chỉ là mặc định
    if (address.isDefault) {
      return res
        .status(400)
        .json({ message: "Không thể xóa địa chỉ mặc định" });
    }

    // Xóa địa chỉ
    await AddressModel.findByIdAndDelete(addressId);

    res.status(200).json({ message: "Địa chỉ đã được xóa" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDefaultAddress = async (req, res) => {
  const { userId } = req.user; // Lấy userId từ req.user sau khi đã xác thực

  try {
    const address = await AddressModel.findOne({
      user: userId,
      isDefault: true,
    });
    if (!address) {
      return res.status(404).json({ message: "Không có địa chỉ mặc định" });
    }

    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
