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
        if (duLieu) return JSON.parse(duLieu);
        var duLieuPhien = sessionStorage.getItem(KHOA_PHIEN_DANG_NHAP);
        return duLieuPhien ? JSON.parse(duLieuPhien) : null;
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

var EMAIL_QUAN_TRI = "ducanh05012k6@gmail.com";
var thangBieuDoTichLuy = 4;

var danhSachMocTichLuy = [
    { ten: "HK1 24-25", gpa: 3.10 },
    { ten: "HK2 24-25", gpa: 3.18 },
    { ten: "HK1 25-26", gpa: 3.25 },
    { ten: "HK2 25-26", gpa: 3.28 },
    { ten: "HK mới", gpa: 3.32 }
];

function kichHoatTheSvg(tenThe, thuocTinh) {
    var phanTu = document.createElementNS("http://www.w3.org/2000/svg", tenThe);
    if (thuocTinh) {
        for (var khoa in thuocTinh) {
            if (Object.prototype.hasOwnProperty.call(thuocTinh, khoa)) {
                phanTu.setAttribute(khoa, thuocTinh[khoa]);
            }
        }
    }
    return phanTu;
}

function doiDiemTheoThangBieuDo(diemHe4) {
    return thangBieuDoTichLuy === 10 ? diemHe4 * 2.5 : diemHe4;
}

function layNutDoiThangBieuDo() {
    return lay("nut-doi-thang-bieu-do") || document.querySelector(".nhan-thang-diem");
}

function layMauSoThangBieuDo() {
    return lay("mau-so-thang-bieu-do") || document.querySelector(".chan-bieu-do-tich-luy .tren-bon");
}

function layNhanDiemMocKy() {
    return lay("nhan-diem-moc-ky") || document.querySelector('label[for="diem-moc-ky"]');
}

function ganSuKienNutDoiThang() {
    var nutThang = layNutDoiThangBieuDo();
    if (!nutThang) return;
    if (!nutThang.onclick) {
        nutThang.onclick = doiThangBieuDoTichLuy;
    }
    if (nutThang.tagName !== "BUTTON") {
        nutThang.setAttribute("role", "button");
        nutThang.setAttribute("tabindex", "0");
        nutThang.onkeydown = function (suKien) {
            if (suKien.key === "Enter" || suKien.key === " ") {
                suKien.preventDefault();
                doiThangBieuDoTichLuy();
            }
        };
    }
}

function doiThangBieuDoTichLuy() {
    thangBieuDoTichLuy = thangBieuDoTichLuy === 4 ? 10 : 4;

    var nutThang = layNutDoiThangBieuDo();
    if (nutThang) {
        nutThang.innerText = thangBieuDoTichLuy === 10 ? "↻ Thang 10.0" : "↻ Thang 4.0";
    }
    var mauSo = layMauSoThangBieuDo();
    if (mauSo) {
        mauSo.innerText = thangBieuDoTichLuy === 10 ? "/ 10,0" : "/ 4,0";
    }
    var nhanMoc = layNhanDiemMocKy();
    if (nhanMoc) {
        nhanMoc.innerText = thangBieuDoTichLuy === 10
            ? "GPA tích lũy mốc (0–10)"
            : "GPA tích lũy mốc (0–4)";
    }
    if (lay("diem-moc-ky")) {
        lay("diem-moc-ky").placeholder = thangBieuDoTichLuy === 10 ? "Ví dụ: 8,30" : "Ví dụ: 3,45";
    }

    veBieuDoTichLuy(danhSachMocTichLuy);
    if (lay("thong-bao-bieu-do")) {
        lay("thong-bao-bieu-do").innerText = "Đã chuyển biểu đồ sang hiển thị theo Thang " + thangBieuDoTichLuy + ".0.";
    }
}

function veBieuDoTichLuy(danhSachMoc, gpaTichLuyChung) {
    ganSuKienNutDoiThang();
    var svg = lay("bieu-do-gpa-svg");
    if (!svg) return;

    var moc = Array.isArray(danhSachMoc) && danhSachMoc.length > 0
        ? danhSachMoc.slice()
        : [{ ten: "Hiện tại", gpa: 3.32 }];

    var gpaCuoiHe4 = typeof gpaTichLuyChung === "number" && !isNaN(gpaTichLuyChung)
        ? gpaTichLuyChung
        : moc[moc.length - 1].gpa;

    var gpaHienThi = doiDiemTheoThangBieuDo(gpaCuoiHe4);

    if (lay("so-gpa-tich-luy-lon")) {
        lay("so-gpa-tich-luy-lon").innerText = hienSo(gpaHienThi);
    }
    var mauSo = layMauSoThangBieuDo();
    if (mauSo) {
        mauSo.innerText = thangBieuDoTichLuy === 10 ? "/ 10,0" : "/ 4,0";
    }
    var nutThang = layNutDoiThangBieuDo();
    if (nutThang) {
        nutThang.innerText = thangBieuDoTichLuy === 10 ? "↻ Thang 10.0" : "↻ Thang 4.0";
    }

    var theChenhLech = lay("chenh-lech-gpa-tich-luy");
    if (theChenhLech) {
        if (moc.length >= 2) {
            var diemTruocHe4 = moc[moc.length - 2].gpa;
            var chenh = doiDiemTheoThangBieuDo(gpaCuoiHe4 - diemTruocHe4);
            if (Math.abs(chenh) < 0.005) {
                theChenhLech.className = "nhan-chenh-lech";
                theChenhLech.innerText = "Ổn định (0,00) · " + xepLoai(gpaCuoiHe4);
            } else if (chenh > 0) {
                theChenhLech.className = "nhan-chenh-lech tang";
                theChenhLech.innerText = "▲ +" + hienSo(chenh) + " so với kỳ trước · " + xepLoai(gpaCuoiHe4);
            } else {
                theChenhLech.className = "nhan-chenh-lech giam";
                theChenhLech.innerText = "▼ " + hienSo(chenh) + " so với kỳ trước · " + xepLoai(gpaCuoiHe4);
            }
        } else {
            theChenhLech.className = "nhan-chenh-lech";
            theChenhLech.innerText = "Xếp loại hiện tại: " + xepLoai(gpaCuoiHe4);
        }
    }

    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }

    var rong = 600;
    var cao = 220;
    var leTrai = 54;
    var lePhai = 38;
    var leTren = 28;
    var leDuoi = 40;
    var vungRong = rong - leTrai - lePhai;
    var vungCao = cao - leTren - leDuoi;

    var defs = kichHoatTheSvg("defs");
    var gradient = kichHoatTheSvg("linearGradient", {
        id: "gradient-vung-gpa",
        x1: "0%",
        y1: "0%",
        x2: "0%",
        y2: "100%"
    });
    gradient.appendChild(kichHoatTheSvg("stop", {
        offset: "0%",
        "stop-color": "#4f46e5",
        "stop-opacity": "0.26"
    }));
    gradient.appendChild(kichHoatTheSvg("stop", {
        offset: "100%",
        "stop-color": "#4f46e5",
        "stop-opacity": "0.02"
    }));
    defs.appendChild(gradient);
    svg.appendChild(defs);

    function tinhY(diemHe4) {
        var gioiHan = Math.max(0, Math.min(4, diemHe4));
        return leTren + vungCao - (gioiHan / 4) * vungCao;
    }

    function tinhX(chiSo, tongSo) {
        if (tongSo <= 1) return leTrai + vungRong / 2;
        return leTrai + (chiSo * vungRong) / (tongSo - 1);
    }

    var cacMocNgangHe4 = [1.0, 2.0, 3.0, 4.0];
    for (var g = 0; g < cacMocNgangHe4.length; g++) {
        var giaTriHe4 = cacMocNgangHe4[g];
        var yMoc = tinhY(giaTriHe4);
        var laMocChinh = giaTriHe4 === 3.0 || giaTriHe4 === 4.0;
        var nhanMoc = doiDiemTheoThangBieuDo(giaTriHe4);

        svg.appendChild(kichHoatTheSvg("line", {
            x1: leTrai,
            y1: yMoc,
            x2: rong - lePhai,
            y2: yMoc,
            stroke: laMocChinh ? "#dbe3f0" : "#eef2f7",
            "stroke-width": laMocChinh ? "1.2" : "1",
            "stroke-dasharray": "4 4"
        }));

        var nhanY = kichHoatTheSvg("text", {
            x: leTrai - 10,
            y: yMoc + 4,
            "text-anchor": "end",
            fill: laMocChinh ? "#64748b" : "#94a3b8",
            "font-size": "11",
            "font-weight": laMocChinh ? "bold" : "normal"
        });
        nhanY.textContent = nhanMoc.toFixed(1).replace(".", ",");
        svg.appendChild(nhanY);
    }

    var danhSachToaDo = [];
    for (var i = 0; i < moc.length; i++) {
        danhSachToaDo.push({
            x: tinhX(i, moc.length),
            y: tinhY(moc[i].gpa),
            ten: moc[i].ten,
            gpaHe4: moc[i].gpa,
            gpaHienThi: doiDiemTheoThangBieuDo(moc[i].gpa)
        });
    }

    var dayY = leTren + vungCao;
    if (danhSachToaDo.length >= 2) {
        var diemDaGiac = danhSachToaDo[0].x + "," + dayY + " ";
        var diemDuong = "";
        for (var k = 0; k < danhSachToaDo.length; k++) {
            var diemHienTai = danhSachToaDo[k].x + "," + danhSachToaDo[k].y;
            diemDaGiac += diemHienTai + " ";
            diemDuong += (k === 0 ? "" : " ") + diemHienTai;
        }
        diemDaGiac += danhSachToaDo[danhSachToaDo.length - 1].x + "," + dayY;

        svg.appendChild(kichHoatTheSvg("polygon", {
            points: diemDaGiac,
            fill: "url(#gradient-vung-gpa)"
        }));

        svg.appendChild(kichHoatTheSvg("polyline", {
            points: diemDuong,
            fill: "none",
            stroke: "#4f46e5",
            "stroke-width": "3",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
        }));
    }

    for (var m = 0; m < danhSachToaDo.length; m++) {
        var nut = danhSachToaDo[m];
        var laNutCuoi = m === danhSachToaDo.length - 1;

        if (laNutCuoi) {
            svg.appendChild(kichHoatTheSvg("circle", {
                cx: nut.x,
                cy: nut.y,
                r: "11",
                fill: "#4f46e5",
                "fill-opacity": "0.15"
            }));
        }

        var vongTron = kichHoatTheSvg("circle", {
            cx: nut.x,
            cy: nut.y,
            r: "6",
            fill: "#ffffff",
            stroke: laNutCuoi ? "#4f46e5" : "#6366f1",
            "stroke-width": "3"
        });
        var chuThich = kichHoatTheSvg("title");
        chuThich.textContent = nut.ten + ": " + hienSo(nut.gpaHienThi) + " / " + (thangBieuDoTichLuy === 10 ? "10,00" : "4,00");
        vongTron.appendChild(chuThich);
        svg.appendChild(vongTron);

        var nhanDiem = kichHoatTheSvg("text", {
            x: nut.x,
            y: Math.max(15, nut.y - 12),
            "text-anchor": "middle",
            fill: laNutCuoi ? "#4f46e5" : "#334155",
            "font-size": "11",
            "font-weight": "bold"
        });
        nhanDiem.textContent = hienSo(nut.gpaHienThi);
        svg.appendChild(nhanDiem);

        var nhanKy = kichHoatTheSvg("text", {
            x: nut.x,
            y: cao - 12,
            "text-anchor": "middle",
            fill: laNutCuoi ? "#0f172a" : "#64748b",
            "font-size": "11",
            "font-weight": laNutCuoi ? "bold" : "normal"
        });
        nhanKy.textContent = nut.ten;
        svg.appendChild(nhanKy);
    }
}

function napDuLieuBieuDoMau() {
    danhSachMocTichLuy = [
        { ten: "HK1 24-25", gpa: 3.10 },
        { ten: "HK2 24-25", gpa: 3.18 },
        { ten: "HK1 25-26", gpa: 3.25 },
        { ten: "HK2 25-26", gpa: 3.28 },
        { ten: "HK mới", gpa: 3.32 }
    ];
    if (lay("gpa-cu")) lay("gpa-cu").value = "3,28";
    if (lay("tin-chi-cu")) lay("tin-chi-cu").value = "60";
    if (lay("gpa-moi")) lay("gpa-moi").value = "3,48";
    if (lay("tin-chi-moi")) lay("tin-chi-moi").value = "15";
    if (lay("co-hoc-lai")) lay("co-hoc-lai").checked = false;

    veBieuDoTichLuy(danhSachMocTichLuy, 3.32);
    if (lay("thong-bao-bieu-do")) {
        lay("thong-bao-bieu-do").innerText = "Đã nạp bộ dữ liệu biểu đồ mẫu gồm 5 mốc học kỳ.";
    }
    if (lay("ket-qua-tich-luy")) {
        lay("ket-qua-tich-luy").innerText = "GPA tích lũy mẫu: 3,32. Phép tính: (3,28 × 60 + 3,48 × 15) / 75.";
    }
}

function themMocBieuDo() {
    var oTen = lay("ten-moc-ky");
    var oDiem = lay("diem-moc-ky");
    var thongBao = lay("thong-bao-bieu-do");
    if (!oTen || !oDiem) return;

    var ten = oTen.value.trim();
    var diemNhap = docSo(oDiem.value);
    var gioiHanToiDa = thangBieuDoTichLuy === 10 ? 10 : 4;

    if (ten === "") {
        ten = "HK" + (danhSachMocTichLuy.length + 1);
    }
    if (!hopLe(diemNhap, 0, gioiHanToiDa)) {
        if (thongBao) {
            thongBao.innerText = "Vui lòng nhập GPA tích lũy mốc hợp lệ từ 0 đến " + gioiHanToiDa + ".";
        }
        oDiem.focus();
        return;
    }
    if (danhSachMocTichLuy.length >= 10) {
        if (thongBao) thongBao.innerText = "Biểu đồ hỗ trợ tối đa 10 mốc học kỳ để hiển thị rõ nét nhất.";
        return;
    }

    var diemHe4 = thangBieuDoTichLuy === 10 ? diemNhap / 2.5 : diemNhap;
    danhSachMocTichLuy.push({ ten: ten, gpa: diemHe4 });
    oTen.value = "";
    oDiem.value = "";
    veBieuDoTichLuy(danhSachMocTichLuy, diemHe4);
    if (thongBao) {
        thongBao.innerText = "Đã thêm mốc \"" + ten + "\" (" + hienSo(diemNhap) + ") vào biểu đồ.";
    }
}

function xoaMocCuoiBieuDo() {
    var thongBao = lay("thong-bao-bieu-do");
    if (danhSachMocTichLuy.length <= 1) {
        if (thongBao) thongBao.innerText = "Cần giữ lại ít nhất 1 mốc học kỳ trên biểu đồ.";
        return;
    }
    var daXoa = danhSachMocTichLuy.pop();
    var cuoi = danhSachMocTichLuy[danhSachMocTichLuy.length - 1];
    veBieuDoTichLuy(danhSachMocTichLuy, cuoi.gpa);
    if (thongBao) {
        thongBao.innerText = "Đã xóa mốc \"" + daXoa.ten + "\".";
    }
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

    if (tcCu > 0) {
        if (danhSachMocTichLuy.length >= 2) {
            danhSachMocTichLuy[danhSachMocTichLuy.length - 2] = { ten: "Kỳ hiện tại", gpa: gpaCu };
            danhSachMocTichLuy[danhSachMocTichLuy.length - 1] = { ten: "Kỳ mới", gpa: gpa };
        } else {
            danhSachMocTichLuy = [
                { ten: "Kỳ hiện tại", gpa: gpaCu },
                { ten: "Kỳ mới", gpa: gpa }
            ];
        }
    } else {
        danhSachMocTichLuy = [{ ten: "Kỳ mới", gpa: gpa }];
    }
    veBieuDoTichLuy(danhSachMocTichLuy, gpa);
    if (lay("thong-bao-bieu-do")) {
        lay("thong-bao-bieu-do").innerText = "Biểu đồ đã cập nhật theo kết quả GPA tích lũy mới (" + hienSo(gpa) + ").";
    }
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

function chuanBiNoiDungGopY() {
    var tieuDe = lay("tieu-de").value.trim();
    var noiDung = lay("noi-dung").value.trim();
    if (tieuDe === "" || noiDung === "") {
        lay("trang-thai-gop-y").innerText = "Vui lòng nhập đầy đủ tiêu đề và nội dung góp ý (không chỉ chứa khoảng trắng).";
        return null;
    }

    var nguoiDung = docNguoiDungDangNhap();
    var hoTenNhap = lay("ho-ten") ? lay("ho-ten").value.trim() : "";
    var tenNguoiGui = hoTenNhap !== ""
        ? hoTenNhap
        : (nguoiDung && nguoiDung.hoTen ? nguoiDung.hoTen : "Sinh viên (chưa để lại tên)");
    var emailNguoiGui = nguoiDung && nguoiDung.email ? " (" + nguoiDung.email + ")" : "";
    var thoiGianGui = new Date().toLocaleString("vi-VN");

    var noiDungThu =
        "GÓP Ý TỪ NGƯỜI DÙNG GPA UNI\n" +
        "----------------------------------------\n" +
        "Người gửi: " + tenNguoiGui + emailNguoiGui + "\n" +
        "Thời gian: " + thoiGianGui + "\n" +
        "Tiêu đề: " + tieuDe + "\n" +
        "----------------------------------------\n\n" +
        noiDung;

    if (lay("ban-gop-y")) {
        lay("ban-gop-y").value = noiDungThu;
    }

    return {
        tieuDe: tieuDe,
        noiDungThu: noiDungThu,
        tieuDeMaHoa: encodeURIComponent("[GPA Uni - Góp ý] " + tieuDe),
        noiDungMaHoa: encodeURIComponent(noiDungThu)
    };
}

function taoGopY() {
    var duLieu = chuanBiNoiDungGopY();
    if (!duLieu) return;

    window.location.href = "mailto:" + EMAIL_QUAN_TRI + "?subject=" + duLieu.tieuDeMaHoa + "&body=" + duLieu.noiDungMaHoa;
    lay("trang-thai-gop-y").innerText = "Đã mở ứng dụng Email mặc định để gửi góp ý tới " + EMAIL_QUAN_TRI + ".";
}

function guiQuaGmailWeb() {
    var duLieu = chuanBiNoiDungGopY();
    if (!duLieu) return;

    var urlGmail = "https://mail.google.com/mail/?view=cm&fs=1&to=" +
        encodeURIComponent(EMAIL_QUAN_TRI) +
        "&su=" + duLieu.tieuDeMaHoa +
        "&body=" + duLieu.noiDungMaHoa;

    window.open(urlGmail, "_blank", "noopener,noreferrer");
    lay("trang-thai-gop-y").innerText = "Đã mở tab Gmail trên Web để gửi góp ý trực tiếp tới " + EMAIL_QUAN_TRI + ".";
}

function saoChepGopY() {
    var duLieu = chuanBiNoiDungGopY();
    if (!duLieu) return;

    var oVanBan = lay("ban-gop-y");
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        navigator.clipboard.writeText(duLieu.noiDungThu).then(function () {
            lay("trang-thai-gop-y").innerText = "Đã sao chép nội dung góp ý. Bạn có thể dán gửi tới " + EMAIL_QUAN_TRI + ".";
        }).catch(function () {
            if (oVanBan) {
                oVanBan.focus();
                oVanBan.select();
            }
            lay("trang-thai-gop-y").innerText = "Đã tạo nội dung ở ô bên trên. Hãy nhấn Ctrl+C để sao chép.";
        });
    } else {
        if (oVanBan) {
            oVanBan.focus();
            oVanBan.select();
            try {
                document.execCommand("copy");
                lay("trang-thai-gop-y").innerText = "Đã sao chép nội dung góp ý. Bạn có thể dán gửi tới " + EMAIL_QUAN_TRI + ".";
                return;
            } catch (loi) {}
        }
        lay("trang-thai-gop-y").innerText = "Đã tạo nội dung ở ô bên trên. Hãy chọn văn bản và sao chép.";
    }
}

function dongMenuDiDong() {
    if (lay("thanh-ben")) {
        lay("thanh-ben").className = "thanh-ben";
    }
    if (lay("lop-phu-menu")) {
        lay("lop-phu-menu").className = "lop-phu-menu";
    }
    document.body.classList.remove("khoa-cuon-trang");
    if (lay("nut-menu")) {
        lay("nut-menu").setAttribute("aria-expanded", "false");
    }
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
    dongMenuDiDong();
    if (maTrang === "tich-luy") {
        veBieuDoTichLuy(danhSachMocTichLuy);
    }
    lay("noi-dung-chinh").focus();
    window.scrollTo(0, 0);
}

function batTatMenu() {
    var thanhBen = lay("thanh-ben");
    if (!thanhBen) return;
    var dangMo = thanhBen.className.indexOf("menu-mo") !== -1;
    if (dangMo) {
        dongMenuDiDong();
    } else {
        thanhBen.className = "thanh-ben menu-mo";
        if (lay("lop-phu-menu")) {
            lay("lop-phu-menu").className = "lop-phu-menu hien-lop-phu";
        }
        document.body.classList.add("khoa-cuon-trang");
        if (lay("nut-menu")) {
            lay("nut-menu").setAttribute("aria-expanded", "true");
        }
    }
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

document.addEventListener("keydown", function (suKien) {
    if (suKien.key === "Escape") {
        dongMenuDiDong();
    }
});

window.addEventListener("resize", function () {
    if (window.innerWidth > 760) {
        dongMenuDiDong();
    }
});

if (lay("danh-sach-mon")) {
    themMon();
    themMon();
    veBieuDoTichLuy(danhSachMocTichLuy, 3.32);
    moTrang("trang-chu");
    tuDongTaiHocKyCuaTaiKhoan();
}