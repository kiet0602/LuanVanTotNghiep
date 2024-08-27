import React, { useState, useEffect } from "react";
import axios from "axios";

const LocationSelector = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // Lấy danh sách tỉnh thành
  useEffect(() => {
    axios
      .get("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((response) => {
        if (response.data.error === 0) {
          setProvinces(response.data.data);
        }
      })
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);

  // Lấy danh sách quận huyện khi chọn tỉnh
  useEffect(() => {
    if (selectedProvince) {
      axios
        .get(`https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`)
        .then((response) => {
          if (response.data.error === 0) {
            setDistricts(response.data.data);
            setWards([]); // Reset wards khi tỉnh thay đổi
          }
        })
        .catch((error) => console.error("Error fetching districts:", error));
    }
  }, [selectedProvince]);

  // Lấy danh sách phường xã khi chọn quận
  useEffect(() => {
    if (selectedDistrict) {
      axios
        .get(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`)
        .then((response) => {
          if (response.data.error === 0) {
            setWards(response.data.data);
          }
        })
        .catch((error) => console.error("Error fetching wards:", error));
    }
  }, [selectedDistrict]);

  return (
    <div className="css_select_div">
      <select
        className="css_select"
        id="tinh"
        name="tinh"
        value={selectedProvince}
        onChange={(e) => setSelectedProvince(e.target.value)}
        title="Chọn Tỉnh Thành"
      >
        <option value="">Tỉnh Thành</option>
        {provinces.map((province) => (
          <option key={province.id} value={province.id}>
            {province.full_name}
          </option>
        ))}
      </select>

      <select
        className="css_select"
        id="quan"
        name="quan"
        value={selectedDistrict}
        onChange={(e) => setSelectedDistrict(e.target.value)}
        title="Chọn Quận Huyện"
        disabled={!selectedProvince}
      >
        <option value="">Quận Huyện</option>
        {districts.map((district) => (
          <option key={district.id} value={district.id}>
            {district.full_name}
          </option>
        ))}
      </select>

      <select
        className="css_select"
        id="phuong"
        name="phuong"
        value={selectedWard}
        onChange={(e) => setSelectedWard(e.target.value)}
        title="Chọn Phường Xã"
        disabled={!selectedDistrict}
      >
        <option value="">Phường Xã</option>
        {wards.map((ward) => (
          <option key={ward.id} value={ward.id}>
            {ward.full_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelector;
