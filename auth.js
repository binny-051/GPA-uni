var KHOA_DANH_SACH_TK = "gpa-uni-danh-sach-tai-khoan";
var KHOA_PHIEN_HIEN_TAI = "gpa-uni-nguoi-dung-hien-tai";
var KHOA_LUU_CO_BAN = "gpa-uni-co-ban";

function layPhanTu(id) {
    return document.getElementById(id);
}

function docDanhSachTaiKhoan() {
    try {
        var duLieu = localStorage.getItem(KHOA_DANH_SACH_TK);
        if (!duLieu) return [];
        var danhSach = JSON.parse(duLieu);
        return Array.isArray(danhSach) ? danhSach : [];
    } catch (loi) {
        return [];
    }
}

function luuDanhSachTaiKhoan(danhSach) {
    localStorage.setItem(KHOA_DANH_SACH_TK, JSON.stringify(danhSach));
}

function layNguoiDungHienTai() {
    try {
        var duLieuLocal = localStorage.getItem(KHOA_PHIEN_HIEN_TAI);
        if (duLieuLocal) return JSON.parse(duLieuLocal);

        var duLieuSession = sessionStorage.getItem(KHOA_PHIEN_HIEN_TAI);
        if (duLieuSession) return JSON.parse(duLieuSession);
    } catch (loi) {
        return null;
    }
    return null;
}

function kiemTraDinhDangEmail(email) {
    var chuoi = String(email).trim();
    var viTriA = chuoi.indexOf("@");
    var viTriCham = chuoi.lastIndexOf(".");
    if (chuoi.indexOf(" ") !== -1) return false;
    return viTriA > 0 && viTriCham > viTriA + 1 && viTriCham < chuoi.length - 1;
}

function kiemTraDoManhMatKhau(matKhau) {
    if (!matKhau || matKhau.length < 6) return false;
    var coChuCai = false;
    var coChuSo = false;
    for (var i = 0; i < matKhau.length; i++) {
        var kyTu = matKhau.charAt(i);
        if ((kyTu >= "a" && kyTu <= "z") || (kyTu >= "A" && kyTu <= "Z")) {
            coChuCai = true;
        } else if (kyTu >= "0" && kyTu <= "9") {
            coChuSo = true;
        }
    }
    return coChuCai && coChuSo;
}

function doiHienMatKhau(idInput, nutBam) {
    var oNhap = layPhanTu(idInput);
    if (!oNhap) return;
    if (oNhap.type === "password") {
        oNhap.type = "text";
        nutBam.innerText = "Ẩn";
        nutBam.setAttribute("aria-label", "Ẩn mật khẩu");
    } else {
        oNhap.type = "password";
        nutBam.innerText = "Hiện";
        nutBam.setAttribute("aria-label", "Hiện mật khẩu");
    }
}

function ganLoiTruong(idInput, idLoi, thongDiep) {
    var oNhap = layPhanTu(idInput);
    var theLoi = layPhanTu(idLoi);
    if (theLoi) {
        theLoi.innerText = thongDiep;
    }
    if (oNhap) {
        oNhap.setAttribute("aria-invalid", thongDiep !== "" ? "true" : "false");
    }
}

function hienThongBaoAuth(thongDiep, laLoi) {
    var hop = layPhanTu("thong-bao-auth");
    if (!hop) return;
    if (!thongDiep) {
        hop.className = "hop-thong-bao";
        hop.innerText = "";
        return;
    }
    hop.innerText = thongDiep;
    hop.className = laLoi ? "hop-thong-bao hien-loi" : "hop-thong-bao hien-thanh-cong";
}

function xoaLoiDangKy() {
    ganLoiTruong("ho-ten-dang-ky", "loi-ho-ten", "");
    ganLoiTruong("email-dang-ky", "loi-email-dang-ky", "");
    ganLoiTruong("mat-khau-dang-ky", "loi-mat-khau-dang-ky", "");
    ganLoiTruong("xac-nhan-mat-khau", "loi-xac-nhan-mat-khau", "");
    if (layPhanTu("loi-dieu-khoan")) {
        layPhanTu("loi-dieu-khoan").innerText = "";
    }
    hienThongBaoAuth("", false);
}

function xoaLoiDangNhap() {
    ganLoiTruong("email-dang-nhap", "loi-email-dang-nhap", "");
    ganLoiTruong("mat-khau-dang-nhap", "loi-mat-khau-dang-nhap", "");
    hienThongBaoAuth("", false);
}

function xuLyDangKy() {
    xoaLoiDangKy();

    var oHoTen = layPhanTu("ho-ten-dang-ky");
    var oEmail = layPhanTu("email-dang-ky");
    var oMatKhau = layPhanTu("mat-khau-dang-ky");
    var oXacNhan = layPhanTu("xac-nhan-mat-khau");
    var oDieuKhoan = layPhanTu("dong-y-dieu-khoan");

    var hoTen = oHoTen.value.trim();
    var email = oEmail.value.trim().toLowerCase();
    var matKhau = oMatKhau.value;
    var xacNhan = oXacNhan.value;
    var dongY = oDieuKhoan.checked;
    var coLoi = false;

    if (hoTen.length < 2) {
        ganLoiTruong("ho-ten-dang-ky", "loi-ho-ten", "Vui lòng nhập họ và tên đầy đủ (từ 2 ký tự trở lên).");
        coLoi = true;
    }

    if (email === "") {
        ganLoiTruong("email-dang-ky", "loi-email-dang-ky", "Vui lòng nhập địa chỉ E-mail sinh viên.");
        coLoi = true;
    } else if (!kiemTraDinhDangEmail(email)) {
        ganLoiTruong("email-dang-ky", "loi-email-dang-ky", "Địa chỉ E-mail không đúng định dạng (ví dụ: ten@neu.edu.vn).");
        coLoi = true;
    }

    if (!kiemTraDoManhMatKhau(matKhau)) {
        ganLoiTruong("mat-khau-dang-ky", "loi-mat-khau-dang-ky", "Mật khẩu phải từ 6 ký tự trở lên, gồm cả chữ cái và chữ số.");
        coLoi = true;
    }

    if (xacNhan === "") {
        ganLoiTruong("xac-nhan-mat-khau", "loi-xac-nhan-mat-khau", "Vui lòng nhập lại mật khẩu để xác nhận.");
        coLoi = true;
    } else if (xacNhan !== matKhau) {
        ganLoiTruong("xac-nhan-mat-khau", "loi-xac-nhan-mat-khau", "Mật khẩu nhập lại không khớp với mật khẩu đã tạo.");
        coLoi = true;
    }

    if (!dongY) {
        layPhanTu("loi-dieu-khoan").innerText = "Bạn cần tích chọn đồng ý với điều khoản sử dụng trước khi đăng ký.";
        coLoi = true;
    }

    if (coLoi) {
        hienThongBaoAuth("Chưa thể đăng ký: Vui lòng kiểm tra và sửa các mục được đánh dấu bên dưới.", true);
        return;
    }

    var danhSach = docDanhSachTaiKhoan();
    for (var i = 0; i < danhSach.length; i++) {
        if (danhSach[i].email.toLowerCase() === email) {
            ganLoiTruong("email-dang-ky", "loi-email-dang-ky", "Địa chỉ E-mail này đã được đăng ký trước đó.");
            hienThongBaoAuth("E-mail đã tồn tại. Vui lòng dùng E-mail khác hoặc chuyển sang trang Đăng nhập.", true);
            return;
        }
    }

    var taiKhoanMoi = {
        hoTen: hoTen,
        email: email,
        matKhau: matKhau,
        ngayTao: new Date().toLocaleDateString("vi-VN")
    };

    try {
        danhSach.push(taiKhoanMoi);
        luuDanhSachTaiKhoan(danhSach);
        if (layPhanTu("nut-dang-ky")) layPhanTu("nut-dang-ky").disabled = true;
        hienThongBaoAuth("Đăng ký tài khoản thành công! Đang chuyển sang trang đăng nhập...", false);
        setTimeout(function () {
            window.location.href = "login.html?dangky=thanhcong&email=" + encodeURIComponent(email);
        }, 900);
    } catch (loi) {
        hienThongBaoAuth("Không thể lưu tài khoản do trình duyệt đang chặn bộ nhớ lưu trữ.", true);
    }
}

function xuLyDangNhap() {
    xoaLoiDangNhap();

    var email = layPhanTu("email-dang-nhap").value.trim().toLowerCase();
    var matKhau = layPhanTu("mat-khau-dang-nhap").value;
    var ghiNho = layPhanTu("ghi-nho") ? layPhanTu("ghi-nho").checked : true;
    var coLoi = false;

    if (email === "") {
        ganLoiTruong("email-dang-nhap", "loi-email-dang-nhap", "Vui lòng nhập địa chỉ E-mail.");
        coLoi = true;
    } else if (!kiemTraDinhDangEmail(email)) {
        ganLoiTruong("email-dang-nhap", "loi-email-dang-nhap", "Địa chỉ E-mail không đúng định dạng.");
        coLoi = true;
    }

    if (matKhau === "") {
        ganLoiTruong("mat-khau-dang-nhap", "loi-mat-khau-dang-nhap", "Vui lòng nhập mật khẩu.");
        coLoi = true;
    }

    if (coLoi) {
        hienThongBaoAuth("Vui lòng kiểm tra lại các trường thông tin đăng nhập.", true);
        return;
    }

    var danhSach = docDanhSachTaiKhoan();
    var taiKhoanKhop = null;
    for (var i = 0; i < danhSach.length; i++) {
        if (danhSach[i].email.toLowerCase() === email && danhSach[i].matKhau === matKhau) {
            taiKhoanKhop = danhSach[i];
            break;
        }
    }

    if (!taiKhoanKhop) {
        hienThongBaoAuth("E-mail hoặc mật khẩu không chính xác. Vui lòng thử lại.", true);
        return;
    }

    var thongTinPhien = JSON.stringify({
        hoTen: taiKhoanKhop.hoTen,
        email: taiKhoanKhop.email,
        dangNhapLuc: new Date().toLocaleString("vi-VN")
    });

    try {
        localStorage.removeItem(KHOA_PHIEN_HIEN_TAI);
        sessionStorage.removeItem(KHOA_PHIEN_HIEN_TAI);

        if (ghiNho) {
            localStorage.setItem(KHOA_PHIEN_HIEN_TAI, thongTinPhien);
        } else {
            sessionStorage.setItem(KHOA_PHIEN_HIEN_TAI, thongTinPhien);
        }

        if (layPhanTu("nut-dang-nhap")) layPhanTu("nut-dang-nhap").disabled = true;
        hienThongBaoAuth("Đăng nhập thành công! Chào mừng " + taiKhoanKhop.hoTen + " quay trở lại.", false);

        setTimeout(function () {
            window.location.href = "index.html";
        }, 600);
    } catch (loi) {
        hienThongBaoAuth("Trình duyệt đang chặn bộ nhớ lưu trữ phiên đăng nhập.", true);
    }
}

function dangXuatTaiKhoan() {
    if (!confirm("Bạn có chắc chắn muốn đăng xuất khỏi tài khoản GPA Uni?")) return;
    try {
        localStorage.removeItem(KHOA_PHIEN_HIEN_TAI);
        sessionStorage.removeItem(KHOA_PHIEN_HIEN_TAI);
    } catch (loi) {}
    window.location.href = "login.html";
}

function dongBoDuLieuTuCheDoKhach() {
    var nguoiDung = layNguoiDungHienTai();
    if (!nguoiDung || !nguoiDung.email) return;

    try {
        var duLieuKhach = localStorage.getItem(KHOA_LUU_CO_BAN);
        if (!duLieuKhach) return;

        var khoaTaiKhoan = "gpa-uni-du-lieu-" + nguoiDung.email.toLowerCase();
        if (!confirm("Chuyển bản lưu học kỳ từ chế độ khách vào tài khoản " + nguoiDung.email + "?")) return;

        localStorage.setItem(khoaTaiKhoan, duLieuKhach);
        localStorage.removeItem(KHOA_LUU_CO_BAN);

        if (typeof tuDongTaiHocKyCuaTaiKhoan === "function") {
            tuDongTaiHocKyCuaTaiKhoan();
        }
        if (layPhanTu("trang-thai-luu")) {
            layPhanTu("trang-thai-luu").innerText = "Đã chuyển và tải dữ liệu học kỳ cũ vào tài khoản " + nguoiDung.email + " thành công!";
        }
    } catch (loi) {}
}

function maHoaHTML(chuoi) {
    return String(chuoi == null ? "" : chuoi)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function layChuVietTat(hoTen) {
    if (!hoTen || typeof hoTen !== "string") return "SV";
    var cacTu = hoTen.trim().split(/\s+/);
    if (cacTu.length === 1) {
        return cacTu[0].charAt(0).toUpperCase();
    }
    var chuDau = cacTu[0].charAt(0).toUpperCase();
    var chuCuoi = cacTu[cacTu.length - 1].charAt(0).toUpperCase();
    return chuDau + chuCuoi;
}

function ganSuKienXoaLoiKhiNhap() {
    var danhSachCap = [
        { input: "ho-ten-dang-ky", loi: "loi-ho-ten" },
        { input: "email-dang-ky", loi: "loi-email-dang-ky" },
        { input: "mat-khau-dang-ky", loi: "loi-mat-khau-dang-ky" },
        { input: "xac-nhan-mat-khau", loi: "loi-xac-nhan-mat-khau" },
        { input: "email-dang-nhap", loi: "loi-email-dang-nhap" },
        { input: "mat-khau-dang-nhap", loi: "loi-mat-khau-dang-nhap" }
    ];

    for (var i = 0; i < danhSachCap.length; i++) {
        (function (cap) {
            var phanTuInput = layPhanTu(cap.input);
            if (phanTuInput) {
                phanTuInput.oninput = function () {
                    ganLoiTruong(cap.input, cap.loi, "");
                };
            }
        })(danhSachCap[i]);
    }

    var oDieuKhoan = layPhanTu("dong-y-dieu-khoan");
    if (oDieuKhoan && layPhanTu("loi-dieu-khoan")) {
        oDieuKhoan.onchange = function () {
            if (oDieuKhoan.checked) layPhanTu("loi-dieu-khoan").innerText = "";
        };
    }
}

function capNhatGiaoDienTaiKhoan() {
    var nguoiDung = layNguoiDungHienTai();

    if (layPhanTu("form-dang-nhap")) {
        var chuoiThamSo = window.location.search;
        if (chuoiThamSo.indexOf("dangky=thanhcong") !== -1) {
            hienThongBaoAuth("Tài khoản đã được tạo thành công! Vui lòng nhập mật khẩu để đăng nhập.", false);
        }
        var viTriEmail = chuoiThamSo.indexOf("email=");
        if (viTriEmail !== -1 && layPhanTu("email-dang-nhap")) {
            var giaTriEmail = decodeURIComponent(chuoiThamSo.substring(viTriEmail + 6).split("&")[0]);
            layPhanTu("email-dang-nhap").value = giaTriEmail;
            if (layPhanTu("mat-khau-dang-nhap")) layPhanTu("mat-khau-dang-nhap").focus();
        }
    }

    var thanhTren = document.querySelector(".thanh-tren .trang-thai");
    if (!thanhTren) return;

    thanhTren.className = "trang-thai cum-tai-khoan";

    if (nguoiDung && nguoiDung.email) {
        var vietTat = maHoaHTML(layChuVietTat(nguoiDung.hoTen));
        var hoTenAnToan = maHoaHTML(nguoiDung.hoTen);
        var emailAnToan = maHoaHTML(nguoiDung.email);
        thanhTren.innerHTML =
            '<span class="cham-xanh"></span>' +
            '<span class="ten-tai-khoan">Xin chào, ' + hoTenAnToan + '</span>' +
            '<span class="anh-dai-dien" title="Tài khoản: ' + emailAnToan + '">' + vietTat + '</span>' +
            '<button type="button" class="nut-phu nut-nho-auth" onclick="dangXuatTaiKhoan()">Đăng xuất</button>';

        var theLuuNho = document.querySelector(".the-luu-nho");
        if (theLuuNho) {
            var doanVanTheLuu = theLuuNho.getElementsByTagName("p")[0];
            if (doanVanTheLuu) {
                doanVanTheLuu.innerHTML = "Đang lưu theo tài khoản:<br><strong>" + emailAnToan + "</strong>";
            }
        }

        var oHoTenGopY = layPhanTu("ho-ten");
        if (oHoTenGopY && oHoTenGopY.value === "") {
            oHoTenGopY.value = nguoiDung.hoTen;
        }

        var coDuLieuKhach = localStorage.getItem(KHOA_LUU_CO_BAN);
        var khoaTaiKhoan = "gpa-uni-du-lieu-" + nguoiDung.email.toLowerCase();
        var coDuLieuTaiKhoan = localStorage.getItem(khoaTaiKhoan);
        if (coDuLieuKhach && !coDuLieuTaiKhoan && layPhanTu("trang-thai-luu")) {
            layPhanTu("trang-thai-luu").innerHTML =
                'Phát hiện có học kỳ lưu ở chế độ khách trước đây. ' +
                '<button type="button" class="nut-chu" onclick="dongBoDuLieuTuCheDoKhach()">Chuyển vào tài khoản của tôi →</button>';
        }
    } else {
        thanhTren.innerHTML =
            '<span class="cham-xanh"></span>' +
            '<span>Chế độ khách</span>' +
            '<a class="nut nut-nho-auth" href="login.html">Đăng nhập</a>' +
            '<a class="nut nut-phu nut-nho-auth" href="register.html">Đăng ký</a>';
    }
}

ganSuKienXoaLoiKhiNhap();
capNhatGiaoDienTaiKhoan();