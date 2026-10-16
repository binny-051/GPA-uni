var soDong = 0;
var heDiemCu = "4";
var khoaLuu = "gpa-uni-co-ban";
var KHOA_PHIEN_DANG_NHAP = "gpa-uni-nguoi-dung-hien-tai";

function lay(id) {
    return document.getElementById(id);
}

function docLuuTru(khoa) {
    if (typeof docDuLieuBenVung === "function") {
        return docDuLieuBenVung(khoa);
    }
    try {
        return localStorage.getItem(khoa);
    } catch (loi) {
        return null;
    }
}

// Ghi dữ liệu vào bộ nhớ bền vững
function ghiLuuTru(khoa, giaTri) {
    if (typeof ghiDuLieuBenVung === "function") {
        ghiDuLieuBenVung(khoa, giaTri);
        return;
    }
    localStorage.setItem(khoa, giaTri);
}

// Xóa dữ liệu khỏi bộ nhớ bền vững
function xoaLuuTru(khoa) {
    if (typeof xoaDuLieuBenVung === "function") {
        xoaDuLieuBenVung(khoa);
        return;
    }
    localStorage.removeItem(khoa);
}

// Lấy thông tin người dùng đang đăng nhập
function docNguoiDungDangNhap() {
    if (typeof layNguoiDungHienTai === "function") {
        return layNguoiDungHienTai();
    }
    try {
        var duLieu = docLuuTru(KHOA_PHIEN_DANG_NHAP);
        return duLieu ? JSON.parse(duLieu) : null;
    } catch (loi) {
        return null;
    }
}

// Xác định khóa lưu trữ riêng cho từng tài khoản hoặc chế độ khách
function layKhoaLuu() {
    var nguoiDung = docNguoiDungDangNhap();
    if (nguoiDung && typeof nguoiDung.email === "string" && nguoiDung.email.trim() !== "") {
        return "gpa-uni-du-lieu-" + nguoiDung.email.trim().toLowerCase();
    }
    return khoaLuu;
}

function hienSo(so) {
    return so.toFixed(2).replace(".", ",");
}

function docSo(chuoi) {
    var giaTri = String(chuoi).trim().replace(",", ".");
    if (giaTri === "") return NaN;
    return Number(giaTri);
}

function hopLe(so, nhoNhat, lonNhat) {
    return !isNaN(so) && so >= nhoNhat && so <= lonNhat;
}

function xepLoai(gpa) {
    if (gpa >= 3.6) return "Xuất sắc";
    if (gpa >= 3.2) return "Giỏi";
    if (gpa >= 2.5) return "Khá";
    if (gpa >= 2) return "Trung bình";
    if (gpa >= 1) return "Yếu";
    return "Kém";
}

function quyDoi(diem, he) {
    // Quy đổi điểm chữ theo bảng tham khảo trong mục Thang điểm.
    if (he === "chu") {
        var chu = String(diem).trim().toUpperCase();
        var bangDiemChu = {
            "A+": 4.0,
            "A": 4.0,
            "B+": 3.5,
            "B": 3.0,
            "C+": 2.5,
            "C": 2.0,
            "D+": 1.5,
            "D": 1.0,
            "F": 0.0
        };
        return Object.prototype.hasOwnProperty.call(bangDiemChu, chu)
            ? bangDiemChu[chu]
            : NaN;
    }

    var so = docSo(diem);
    // Khi chọn hệ 4, người dùng nhập trực tiếp điểm số hệ 4.
    if (he === "4") {
        return hopLe(so, 0, 4) ? so : NaN;
    }

    // Hệ 10: dùng đúng các ngưỡng trong bảng quy đổi được cung cấp.
    if (!hopLe(so, 0, 10)) return NaN;
    if (so >= 9.0) return 4.0; // A+
    if (so >= 8.5) return 4.0; // A
    if (so >= 8.0) return 3.5; // B+
    if (so >= 7.0) return 3.0; // B
    if (so >= 6.5) return 2.5; // C+
    if (so >= 5.5) return 2.0; // C
    if (so >= 5.0) return 1.5; // D+
    if (so >= 4.0) return 1.0; // D
    return 0.0; // F
}

function xoaKetQua() {
    if (!lay("gpa-ky")) return;
    lay("gpa-ky").innerText = "—";
    lay("xep-loai-ky").innerText = "Chưa có kết quả";
    lay("tong-tin-chi").innerText = "—";
    lay("tong-so-mon").innerText = "—";
    lay("thong-tin-ky").innerText = "Nhập điểm và bấm tính để xem kết quả.";
    lay("diem-he-10").innerText = "";
    lay("phep-tinh").innerText = "";
    lay("loi-mon").innerText = "";
}

function themMon(duLieu) {
    if (!lay("danh-sach-mon")) return;
    soDong++;
    var dong = document.createElement("tr");
    dong.innerHTML =
        '<td><input class="tinh" type="checkbox" checked aria-label="Tính môn vào GPA"></td>' +
        '<td><span class="nhan-di-dong">Tên môn học</span><input class="ten" type="text" placeholder="Tên môn" maxlength="100" aria-label="Tên môn"></td>' +
        '<td><span class="nhan-di-dong">Tín chỉ</span><input class="tin-chi" type="text" inputmode="decimal" maxlength="10" aria-label="Số tín chỉ"><span class="loi loi-tin-chi"></span></td>' +
        '<td><span class="nhan-di-dong">Điểm</span><input class="diem" type="text" maxlength="10" aria-label="Điểm môn"><span class="loi loi-diem"></span></td>' +
        '<td><button type="button" class="xoa" aria-label="Xóa môn">Xóa</button></td>';
    var o = dong.getElementsByTagName("input");
    o[2].value = "3";
    if (duLieu) {
        o[0].checked = duLieu.tinh;
        o[1].value = duLieu.ten;
        o[2].value = duLieu.tinChi;
        o[3].value = duLieu.diem;
    }
    var loi = dong.getElementsByClassName("loi");
    loi[0].id = "loi-tin-chi-" + soDong;
    loi[1].id = "loi-diem-" + soDong;
    o[2].setAttribute("aria-describedby", loi[0].id);
    o[3].setAttribute("aria-describedby", loi[1].id);
    dong.getElementsByTagName("button")[0].onclick = function () {
        dong.parentNode.removeChild(dong);
        xoaKetQua();
    };
    dong.oninput = xoaKetQua;
    lay("danh-sach-mon").appendChild(dong);
    xoaKetQua();
}

function tinhGPA() {
    xoaKetQua();
    var dong = lay("danh-sach-mon").getElementsByTagName("tr");
    var he = lay("he-diem").value;
    var tongTinChi = 0, tongDiem = 0, tongHe10 = 0, soMon = 0;
    var coLoi = false;
    for (var i = 0; i < dong.length; i++) {
        var o = dong[i].getElementsByTagName("input");
        var loi = dong[i].getElementsByClassName("loi");
        loi[0].innerText = "";
        loi[1].innerText = "";
        o[2].setAttribute("aria-invalid", "false");
        o[3].setAttribute("aria-invalid", "false");
        if (!o[0].checked) continue;
        var tinChi = docSo(o[2].value);
        var diem = quyDoi(o[3].value, he);
        if (!(tinChi > 0 && tinChi <= 100)) {
            loi[0].innerText = "Nhập tín chỉ > 0 và ≤ 100.";
            o[2].setAttribute("aria-invalid", "true");
            coLoi = true;
        }
        if (!hopLe(diem, 0, 4)) {
            loi[1].innerText = he === "chu"
                ? "Nhập A+, A, B+, B, C+, C, D+, D hoặc F."
                : "Nhập điểm từ 0 đến " + he + ".";
            o[3].setAttribute("aria-invalid", "true");
            coLoi = true;
        }
        tongTinChi += tinChi;
        tongDiem += diem * tinChi;
        if (he === "10") tongHe10 += docSo(o[3].value) * tinChi;
        soMon++;
    }
    if (coLoi) {
        lay("loi-mon").innerText = "Chưa tính được: hãy sửa các ô được đánh dấu.";
        return;
    }
    if (tongTinChi === 0) {
        lay("loi-mon").innerText = "Chưa có môn được chọn để tính GPA.";
        return;
    }
    var gpa = tongDiem / tongTinChi;
    lay("gpa-ky").innerText = hienSo(gpa);
    lay("xep-loai-ky").innerText = xepLoai(gpa);
    lay("tong-tin-chi").innerText = String(tongTinChi).replace(".", ",");
    lay("tong-so-mon").innerText = soMon;
    lay("thong-tin-ky").innerText = xepLoai(gpa) + " · " + soMon + " môn · " + tongTinChi + " tín chỉ";
    lay("phep-tinh").innerText = "Tổng điểm × tín chỉ: " + hienSo(tongDiem) + "; chia cho " + tongTinChi + " tín chỉ.";
    if (he === "10") {
        lay("diem-he-10").innerText = "Trung bình hệ 10: " + hienSo(tongHe10 / tongTinChi);
    } else {
        lay("diem-he-10").innerText = "Chưa đủ dữ liệu hệ 10. Không suy ngược chính xác từ hệ 4 hoặc điểm chữ.";
    }
}

function doiHeDiem() {
    var diem = document.getElementsByClassName("diem");
    var daNhap = false;
    for (var i = 0; i < diem.length; i++) {
        if (diem[i].value !== "") daNhap = true;
    }
    if (daNhap && !confirm("Đổi hệ điểm sẽ xóa điểm đã nhập. Bạn có muốn tiếp tục?")) {
        lay("he-diem").value = heDiemCu;
        return;
    }
    for (var j = 0; j < diem.length; j++) diem[j].value = "";
    heDiemCu = lay("he-diem").value;
    xoaKetQua();
}

function lamMoi() {
    if (!confirm("Xóa danh sách môn đang nhập? Bản đã lưu vẫn được giữ lại.")) return;
    lay("danh-sach-mon").innerHTML = "";
    themMon();
}

function duLieuMau() {
    if (!confirm("Thay danh sách đang nhập bằng dữ liệu mẫu? Bản đã lưu không thay đổi.")) return;
    lay("danh-sach-mon").innerHTML = "";
    lay("he-diem").value = "4";
    heDiemCu = "4";
    lay("ten-ky").value = "Học kỳ mẫu";
    themMon({tinh: true, ten: "Marketing Dịch vụ", tinChi: "3", diem: "4"});
    themMon({tinh: true, ten: "Social Media Marketing", tinChi: "3", diem: "4"});
    themMon({tinh: true, ten: "Quản trị bán hàng", tinChi: "3", diem: "4"});
    themMon({tinh: true, ten: "Khoa học dữ liệu", tinChi: "3", diem: "4"});
    themMon({tinh: true, ten: "Thiết kế Web", tinChi: "3", diem: "4"});
    themMon({tinh: true, ten: "Tiếng Anh ngành Marketing", tinChi: "3", diem: "4"});
    tinhGPA();
}

function tinhTichLuy() {
    var gpaCu = docSo(lay("gpa-cu").value);
    var tcCu = docSo(lay("tin-chi-cu").value);
    var gpaMoi = docSo(lay("gpa-moi").value);
    var tcMoi = docSo(lay("tin-chi-moi").value);
    var ketQua = lay("ket-qua-tich-luy");
    if (lay("co-hoc-lai").checked) {
        ketQua.innerText = "Không cộng dồn khi thay thế điểm học lại. Cần tính lại từ danh sách đầy đủ các môn và chỉ chọn lần học được trường công nhận.";
        return;
    }
    if (!hopLe(gpaCu, 0, 4) || !hopLe(gpaMoi, 0, 4) ||
        !hopLe(tcCu, 0, 10000) || !(tcMoi > 0 && tcMoi <= 10000)) {
        ketQua.innerText = "Hãy nhập đủ GPA từ 0 đến 4; tín chỉ cũ từ 0 đến 10.000; tín chỉ mới lớn hơn 0 và không quá 10.000.";
        return;
    }
    var gpa = (gpaCu * tcCu + gpaMoi * tcMoi) / (tcCu + tcMoi);
    ketQua.innerText = "GPA tích lũy mới: " + hienSo(gpa) + ". Phép tính: (" +
        gpaCu + " × " + tcCu + " + " + gpaMoi + " × " + tcMoi + ") / " + (tcCu + tcMoi) + ".";
}

function tinhMucTieu() {
    var gpa = docSo(lay("gpa-hien-tai").value);
    var tc = docSo(lay("tin-chi-hien-tai").value);
    var mucTieu = docSo(lay("gpa-muc-tieu").value);
    var conLai = docSo(lay("tin-chi-con-lai").value);
    var ketQua = lay("ket-qua-muc-tieu");
    if (!hopLe(gpa, 0, 4) || !hopLe(mucTieu, 0, 4) ||
        !hopLe(tc, 0, 10000) || !hopLe(conLai, 0, 10000)) {
        ketQua.innerText = "Hãy nhập đủ GPA từ 0 đến 4 và tín chỉ từ 0 đến 10.000.";
        return;
    }
    if (tc + conLai === 0) {
        ketQua.innerText = "Chưa có tín chỉ để tính GPA.";
        return;
    }
    if (conLai === 0) {
        ketQua.innerText = gpa >= mucTieu ? "Không còn tín chỉ mới. GPA hiện tại đã đạt ngưỡng mục tiêu." : "Không còn tín chỉ mới. GPA hiện tại chưa đạt mục tiêu.";
        return;
    }
    var canDat = (mucTieu * (tc + conLai) - gpa * tc) / conLai;
    var toiDa = (gpa * tc + 4 * conLai) / (tc + conLai);
    var thongBao = "Cần đạt trung bình " + hienSo(canDat) + " trên số tín chỉ còn lại. Mục tiêu khả thi theo giả định.";
    if (canDat > 4) thongBao = "Cần đạt " + hienSo(canDat) + ", vượt 4,00. Mục tiêu không khả thi theo giả định.";
    if (canDat <= 0) thongBao = "Không cần thêm điểm có trọng số để đạt ngưỡng: phần còn lại đạt 0 vẫn đủ theo mô hình này.";
    ketQua.innerText = thongBao + " GPA tối đa có thể đạt: " + hienSo(toiDa) + ".";
}

function luuDuLieu() {
    var danhSach = [];
    var dong = lay("danh-sach-mon").getElementsByTagName("tr");
    for (var i = 0; i < dong.length; i++) {
        var o = dong[i].getElementsByTagName("input");
        danhSach.push({tinh: o[0].checked, ten: o[1].value, tinChi: o[2].value, diem: o[3].value});
    }
    var duLieu = {tenKy: lay("ten-ky").value, he: lay("he-diem").value, mon: danhSach};
    var khoaHienTai = layKhoaLuu();
    var nguoiDung = docNguoiDungDangNhap();
    try {
        ghiLuuTru(khoaHienTai, JSON.stringify(duLieu));
        if (nguoiDung && nguoiDung.email) {
            lay("trang-thai-luu").innerText = "Đã lưu học kỳ \"" + duLieu.tenKy + "\" vào tài khoản " + nguoiDung.email + ".";
        } else {
            lay("trang-thai-luu").innerText = "Đã lưu học kỳ trên thiết bị này (chế độ khách).";
        }
    } catch (loi) {
        lay("trang-thai-luu").innerText = "Không lưu được. Trình duyệt có thể đang chặn lưu trữ hoặc đã hết dung lượng.";
    }
}

function taiDuLieu() {
    var khoaHienTai = layKhoaLuu();
    var nguoiDung = docNguoiDungDangNhap();
    try {
        var banLuu = docLuuTru(khoaHienTai);
        if (!banLuu) {
            lay("trang-thai-luu").innerText = nguoiDung
                ? "Tài khoản " + nguoiDung.email + " chưa có học kỳ nào được lưu."
                : "Chưa có học kỳ được lưu.";
            return;
        }
        var duLieu = JSON.parse(banLuu);
        if (!duLieu || typeof duLieu.tenKy !== "string" ||
            (duLieu.he !== "4" && duLieu.he !== "10" && duLieu.he !== "chu") ||
            !Array.isArray(duLieu.mon)) throw new Error("Sai định dạng");
        for (var i = 0; i < duLieu.mon.length; i++) {
            var mon = duLieu.mon[i];
            if (!mon || typeof mon.ten !== "string" || typeof mon.tinChi !== "string" ||
                typeof mon.diem !== "string" || typeof mon.tinh !== "boolean") throw new Error("Sai môn học");
        }
        if (!confirm("Mở bản đã lưu (\"" + duLieu.tenKy + "\") và thay danh sách đang nhập?")) return;
        lay("danh-sach-mon").innerHTML = "";
        lay("ten-ky").value = duLieu.tenKy;
        lay("he-diem").value = duLieu.he;
        heDiemCu = duLieu.he;
        for (var j = 0; j < duLieu.mon.length; j++) themMon(duLieu.mon[j]);
        xoaKetQua();
        lay("trang-thai-luu").innerText = "Đã mở học kỳ \"" + duLieu.tenKy + "\". Bấm tính để kiểm tra kết quả.";
    } catch (loi) {
        lay("trang-thai-luu").innerText = "Không đọc được dữ liệu. Bản đã lưu được giữ nguyên.";
    }
}

function xoaDuLieu() {
    var khoaHienTai = layKhoaLuu();
    if (!confirm("Xóa bản học kỳ đã lưu trên thiết bị này?")) return;
    try {
        xoaLuuTru(khoaHienTai);
        lay("trang-thai-luu").innerText = "Đã xóa bản lưu. Danh sách đang nhập vẫn được giữ lại.";
    } catch (loi) {
        lay("trang-thai-luu").innerText = "Trình duyệt không cho phép xóa dữ liệu lưu.";
    }
}

function taoGopY() {
    var tieuDe = lay("tieu-de").value.trim();
    var noiDung = lay("noi-dung").value.trim();
    if (tieuDe === "" || noiDung === "") {
        lay("trang-thai-gop-y").innerText = "Vui lòng nhập tiêu đề và nội dung, không chỉ nhập khoảng trắng.";
        return;
    }
    lay("ban-gop-y").value = "GÓP Ý GPA UNI\nHọ tên: " + lay("ho-ten").value +
        "\nTiêu đề: " + tieuDe + "\n\n" + noiDung;
    lay("trang-thai-gop-y").innerText = "Đã tạo nội dung. Hãy chọn văn bản phía trên và sao chép. Chưa gửi trực tuyến.";
}

function moTrang(maTrang) {
    if (!lay(maTrang)) return;
    var trang = document.getElementsByClassName("trang");
    for (var i = 0; i < trang.length; i++) trang[i].style.display = "none";
    lay(maTrang).style.display = "block";
    if (maTrang === "trang-chu") lay("tinh-gpa").style.display = "block";
    lay("dau-trang-tinh").style.display = maTrang === "trang-chu" ? "none" : "flex";
    lay("tieu-de-bang").innerText = maTrang === "trang-chu" ? "Tính nhanh GPA của bạn" : "Danh sách môn học";
    var menu = lay("menu").getElementsByTagName("a");
    for (var j = 0; j < menu.length; j++) {
        menu[j].className = "";
        menu[j].removeAttribute("aria-current");
    }
    lay("menu-" + maTrang).className = "dang-chon";
    lay("menu-" + maTrang).setAttribute("aria-current", "page");
    var tenTrang = {
        "trang-chu": "Trang chủ",
        "tinh-gpa": "Tính GPA kỳ",
        "tich-luy": "GPA tích lũy",
        "muc-tieu": "Mục tiêu GPA",
        "thang-diem": "Quy chế & Thang điểm",
        "huong-dan": "Hướng dẫn",
        "gop-y": "Liên hệ / Góp ý"
    };
    lay("ten-trang").innerText = tenTrang[maTrang];
    document.title = tenTrang[maTrang] + " — GPA Uni";
    lay("thanh-ben").className = "thanh-ben";
    lay("nut-menu").setAttribute("aria-expanded", "false");
    lay("noi-dung-chinh").focus();
    window.scrollTo(0, 0);
}

function batTatMenu() {
    var dangMo = lay("thanh-ben").className === "thanh-ben menu-mo";
    lay("thanh-ben").className = dangMo ? "thanh-ben" : "thanh-ben menu-mo";
    lay("nut-menu").setAttribute("aria-expanded", dangMo ? "false" : "true");
}

function moLuuDuLieu() {
    moTrang("tinh-gpa");
    lay("luu-du-lieu").scrollIntoView();
    lay("luu-du-lieu").getElementsByTagName("button")[0].focus();
}

// Tự động khôi phục học kỳ của tài khoản khi mở trang
function tuDongTaiHocKyCuaTaiKhoan() {
    if (!lay("danh-sach-mon")) return;
    try {
        var khoaHienTai = layKhoaLuu();
        var banLuu = docLuuTru(khoaHienTai);
        if (!banLuu) return;

        var duLieu = JSON.parse(banLuu);
        if (!duLieu || typeof duLieu.tenKy !== "string" ||
            (duLieu.he !== "4" && duLieu.he !== "10" && duLieu.he !== "chu") ||
            !Array.isArray(duLieu.mon) || duLieu.mon.length === 0) return;

        lay("danh-sach-mon").innerHTML = "";
        lay("ten-ky").value = duLieu.tenKy;
        lay("he-diem").value = duLieu.he;
        heDiemCu = duLieu.he;
        for (var j = 0; j < duLieu.mon.length; j++) {
            themMon(duLieu.mon[j]);
        }
        xoaKetQua();
        if (lay("trang-thai-luu")) {
            lay("trang-thai-luu").innerText = "Đã khôi phục học kỳ \"" + duLieu.tenKy + "\" đã lưu của bạn.";
        }
    } catch (loi) {}
}

if (lay("danh-sach-mon")) {
    themMon();
    themMon();
    moTrang("trang-chu");
    tuDongTaiHocKyCuaTaiKhoan();
}