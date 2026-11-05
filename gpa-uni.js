var soDong = 0;
var heDiemCu = "4";
var khoaLuu = "gpa-uni-co-ban";
var KHOA_PHIEN_DANG_NHAP = "gpa-uni-nguoi-dung-hien-tai";

function lay(id) {
    return document.getElementById(id);
}

function docLuuTru(khoa) {
    try {
        return localStorage.getItem(khoa);
    } catch (loi) {
        return null;
    }
}

function ghiLuuTru(khoa, giaTri) {
    localStorage.setItem(khoa, giaTri);
}

function xoaLuuTru(khoa) {
    localStorage.removeItem(khoa);
}

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

function layKhoaLuu() {
    var nguoiDung = docNguoiDungDangNhap();
    if (nguoiDung && typeof nguoiDung.email === "string" && nguoiDung.email.trim() !== "") {
        return "gpa-uni-du-lieu-" + nguoiDung.email.trim().toLowerCase();
    }
    return khoaLuu;
}

function layKhoaLuuDanhSachKy() {
    return layKhoaLuu() + "-tat-ca-hoc-ky";
}

function layKhoaLuuBieuDo() {
    return layKhoaLuu() + "-bieu-do-tich-luy";
}

function layKhoaLuuMucTieu() {
    return layKhoaLuu() + "-muc-tieu-tot-nghiep";
}

function hienSo(so) {
    return so.toFixed(2).replace(".", ",");
}

function docSo(chuoi) {
    var giaTri = String(chuoi).trim().replace(",", ".");
    if (giaTri === "" || !/^\d+(\.\d+)?$/.test(giaTri)) return NaN;
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
    if (he === "4") {
        return hopLe(so, 0, 4) ? so : NaN;
    }

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

function hienThiKetQuaHocKy(ketQuaKy, he) {
    if (!lay("gpa-ky") || !ketQuaKy) return;
    var gpa = ketQuaKy.gpa;
    var soMon = ketQuaKy.soMon !== undefined ? ketQuaKy.soMon : 0;
    var tongTinChi = ketQuaKy.tongTinChi !== undefined ? ketQuaKy.tongTinChi : 0;
    var tongDiem = ketQuaKy.tongDiem !== undefined ? ketQuaKy.tongDiem : (gpa * tongTinChi);
    var tcHienThi = String(tongTinChi).replace(".", ",");

    lay("gpa-ky").innerText = hienSo(gpa);
    lay("xep-loai-ky").innerText = xepLoai(gpa);
    lay("tong-tin-chi").innerText = tcHienThi;
    lay("tong-so-mon").innerText = soMon;
    lay("thong-tin-ky").innerText = xepLoai(gpa) + " · " + soMon + " môn · " + tcHienThi + " tín chỉ";
    lay("phep-tinh").innerText = "Tổng điểm × tín chỉ: " + hienSo(tongDiem) + "; chia cho " + tcHienThi + " tín chỉ.";

    if (he === "10") {
        if (typeof ketQuaKy.diemHe10Tb === "number" && !isNaN(ketQuaKy.diemHe10Tb)) {
            lay("diem-he-10").innerText = "Trung bình hệ 10: " + hienSo(ketQuaKy.diemHe10Tb);
        } else {
            lay("diem-he-10").innerText = "Trung bình hệ 10: Chỉ tính được khi tất cả môn đều có điểm hệ 10.";
        }
    } else {
        lay("diem-he-10").innerText = "";
    }
    if (lay("loi-mon")) lay("loi-mon").innerText = "";
}

function timDiemChuTuDiemSo(chuoiDiem, he) {
    var so = docSo(chuoiDiem);
    if (isNaN(so)) return "";
    if (he === "10") {
        if (!hopLe(so, 0, 10)) return "";
        if (so >= 9.0) return "A+";
        if (so >= 8.5) return "A";
        if (so >= 8.0) return "B+";
        if (so >= 7.0) return "B";
        if (so >= 6.5) return "C+";
        if (so >= 5.5) return "C";
        if (so >= 5.0) return "D+";
        if (so >= 4.0) return "D";
        return "F";
    }
    if (!hopLe(so, 0, 4)) return "";
    if (so >= 3.85) return "A+";
    if (so >= 3.5) return "A";
    if (so >= 3.25) return "B+";
    if (so >= 2.75) return "B";
    if (so >= 2.25) return "C+";
    if (so >= 1.75) return "C";
    if (so >= 1.25) return "D+";
    if (so >= 1.0) return "D";
    return "F";
}

function lopMauHuyHieuChu(chu) {
    if (chu === "A+" || chu === "A") return "muc-a";
    if (chu === "B+" || chu === "B") return "muc-b";
    if (chu === "C+" || chu === "C") return "muc-c";
    if (chu === "D+" || chu === "D") return "muc-d";
    if (chu === "F") return "muc-f";
    return "muc-trong";
}

function capNhatHuyHieuHeChuDong(dong) {
    if (!dong) return;
    var oDiem = dong.querySelector(".diem");
    var oDiem10 = dong.querySelector(".diem-10");
    var huyHieu = dong.querySelector(".huy-hieu-he-chu");
    if (!oDiem || !huyHieu) return;
    var he = lay("he-diem") ? lay("he-diem").value : "4";
    var chu = "";
    if (he === "10" && oDiem10 && oDiem10.value.trim() !== "") {
        chu = timDiemChuTuDiemSo(oDiem10.value, "10");
    }
    if (chu === "") {
        chu = timDiemChuTuDiemSo(oDiem.value, "4");
    }
    if (chu === "") {
        huyHieu.innerText = "—";
        huyHieu.className = "huy-hieu-he-chu muc-trong";
    } else {
        huyHieu.innerText = chu;
        huyHieu.className = "huy-hieu-he-chu " + lopMauHuyHieuChu(chu);
    }
}

function capNhatTieuDeCotDiem() {
    var bang = document.querySelector(".bang-mon");
    var he = lay("he-diem") ? lay("he-diem").value : "4";
    var thDiem = lay("cot-tieu-de-diem");
    var thDiem10 = lay("cot-tieu-de-diem-10");
    if (he === "10") {
        if (bang) bang.classList.add("che-do-he-10");
        if (thDiem) thDiem.innerHTML = 'ĐIỂM HỆ 4 <span class="gioi-han-diem">(MAX 4.0)</span>';
        if (thDiem10) thDiem10.innerHTML = 'ĐIỂM HỆ 10 <span class="gioi-han-diem">(MAX 10)</span>';
    } else {
        if (bang) bang.classList.remove("che-do-he-10");
        if (thDiem) thDiem.innerHTML = 'ĐIỂM <span class="gioi-han-diem">(MAX 4.0)</span>';
    }
    if (bang) {
        var cacODiem = bang.querySelectorAll(".diem");
        for (var i = 0; i < cacODiem.length; i++) {
            cacODiem[i].readOnly = (he === "10");
        }
    }
}

function capNhatSoThuTuVaHeChuBangMon() {
    if (!lay("danh-sach-mon")) return;
    capNhatTieuDeCotDiem();
    var dong = lay("danh-sach-mon").getElementsByTagName("tr");
    for (var i = 0; i < dong.length; i++) {
        var oStt = dong[i].querySelector(".so-thu-tu-mon");
        if (oStt) oStt.innerText = i + 1;
        capNhatHuyHieuHeChuDong(dong[i]);
    }
}

function themMon(duLieu, khongTuLuu) {
    if (!lay("danh-sach-mon")) return;
    soDong++;
    var dong = document.createElement("tr");
    dong.innerHTML =
        '<td class="cot-stt"><span class="so-thu-tu-mon"></span></td>' +
        '<td class="cot-tinh"><input class="tinh" type="checkbox" checked aria-label="Tính môn vào GPA" name="tinh_mon_' + soDong + '" id="tinh-mon-' + soDong + '"></td>' +
        '<td class="cot-ten"><span class="nhan-di-dong">Tên môn học</span><input class="ten" type="text" placeholder="Tên môn (tùy chọn)..." maxlength="100" aria-label="Tên môn" name="ten_mon_' + soDong + '" id="ten-mon-' + soDong + '"></td>' +
        '<td class="cot-tc"><span class="nhan-di-dong">Tín chỉ</span><input class="tin-chi" type="text" inputmode="decimal" maxlength="10" aria-label="Số tín chỉ" name="tin_chi_' + soDong + '" id="tin-chi-' + soDong + '"><span class="loi loi-tin-chi"></span></td>' +
        '<td class="cot-diem"><span class="nhan-di-dong">Điểm hệ 4</span><input class="diem" type="text" inputmode="decimal" maxlength="10" aria-label="Điểm hệ 4" name="diem_he4_' + soDong + '" id="diem-he4-' + soDong + '"><span class="loi loi-diem"></span></td>' +
        '<td class="cot-diem-10"><span class="nhan-di-dong">Điểm hệ 10</span><input class="diem-10" type="text" inputmode="decimal" maxlength="10" aria-label="Điểm hệ 10" name="diem_he10_' + soDong + '" id="diem-he10-' + soDong + '"><span class="loi loi-diem-10"></span></td>' +
        '<td class="cot-he-chu"><span class="nhan-di-dong">Hệ chữ</span><span class="huy-hieu-he-chu muc-trong">—</span></td>' +
        '<td class="cot-xoa"><button type="button" class="xoa" aria-label="Xóa môn" title="Xóa môn">✕</button></td>';

    var oTinh = dong.querySelector(".tinh");
    var oTen = dong.querySelector(".ten");
    var oTc = dong.querySelector(".tin-chi");
    var oDiem = dong.querySelector(".diem");
    var oDiem10 = dong.querySelector(".diem-10");
    var loiTc = dong.querySelector(".loi-tin-chi");
    var loiDiem = dong.querySelector(".loi-diem");
    var loiDiem10 = dong.querySelector(".loi-diem-10");

    oTc.value = "3";
    if (duLieu) {
        oTinh.checked = duLieu.tinh;
        oTen.value = duLieu.ten || "";
        oTc.value = duLieu.tinChi || "3";
        var diemLuu = duLieu.diem || "";
        var diemQuyHe4 = quyDoi(diemLuu, "chu");
        if (!isNaN(diemQuyHe4) && isNaN(docSo(diemLuu))) {
            diemLuu = String(diemQuyHe4).replace(".", ",");
        }
        oDiem.value = diemLuu;
        oDiem10.value = duLieu.diem10 || "";
    }

    loiTc.id = "loi-tin-chi-" + soDong;
    loiDiem.id = "loi-diem-" + soDong;
    loiDiem10.id = "loi-diem-10-" + soDong;
    oTc.setAttribute("aria-describedby", loiTc.id);
    oDiem.setAttribute("aria-describedby", loiDiem.id);
    oDiem10.setAttribute("aria-describedby", loiDiem10.id);

    var heHienTai = lay("he-diem") ? lay("he-diem").value : "4";
    oDiem.readOnly = (heHienTai === "10");

    dong.querySelector(".xoa").onclick = function () {
        dong.parentNode.removeChild(dong);
        capNhatSoThuTuVaHeChuBangMon();
        tuDongLuuVaDongBoTichLuy();
    };

    oDiem10.oninput = function () {
        var chuoi10 = oDiem10.value.trim();
        if (chuoi10 !== "") {
            var so10 = docSo(chuoi10);
            if (!isNaN(so10) && hopLe(so10, 0, 10)) {
                var d4 = quyDoi(chuoi10, "10");
                if (!isNaN(d4)) {
                    oDiem.value = String(d4).replace(".", ",");
                }
            }
        }
        capNhatHuyHieuHeChuDong(dong);
        tuDongLuuVaDongBoTichLuy();
    };

    oDiem.oninput = function () {
        if (oDiem10.value.trim() !== "") {
            var q = quyDoi(oDiem10.value, "10");
            var d = docSo(oDiem.value);
            if (isNaN(q) || isNaN(d) || q !== d) {
                oDiem10.value = "";
            }
        }
        capNhatHuyHieuHeChuDong(dong);
        tuDongLuuVaDongBoTichLuy();
    };

    dong.oninput = function (e) {
        if (e.target !== oDiem && e.target !== oDiem10) {
            capNhatHuyHieuHeChuDong(dong);
            tuDongLuuVaDongBoTichLuy();
        }
    };
    dong.onchange = function () {
        capNhatHuyHieuHeChuDong(dong);
        tuDongLuuVaDongBoTichLuy();
    };

    lay("danh-sach-mon").appendChild(dong);
    capNhatSoThuTuVaHeChuBangMon();
    if (!khongTuLuu) {
        tuDongLuuVaDongBoTichLuy();
    }
}

function docTatCaHocKyDaLuu() {
    try {
        var chuoi = docLuuTru(layKhoaLuuDanhSachKy());
        if (!chuoi) return {};
        var duLieu = JSON.parse(chuoi);
        return (duLieu && typeof duLieu === "object" && !Array.isArray(duLieu)) ? duLieu : {};
    } catch (loi) {
        return {};
    }
}

function luuBieuDoTichLuyVaoBoNho() {
    try {
        ghiLuuTru(layKhoaLuuBieuDo(), JSON.stringify({
            dangDungMocMau: dangDungMocMau,
            moc: danhSachMocTichLuy,
            daXoa: danhSachKyDaXoaKhoiBieuDo
        }));
    } catch (loi) { }
}

function taiBieuDoTichLuyTuBoNho() {
    try {
        var chuoi = docLuuTru(layKhoaLuuBieuDo());
        if (!chuoi) return;
        var duLieu = JSON.parse(chuoi);
        if (duLieu && Array.isArray(duLieu.moc)) {
            dangDungMocMau = Boolean(duLieu.dangDungMocMau);
            danhSachMocTichLuy = duLieu.moc;
            if (Array.isArray(duLieu.daXoa)) {
                danhSachKyDaXoaKhoiBieuDo = duLieu.daXoa;
            }
        }
    } catch (loi) { }
}

function tinhGpaHopLeTuDanhSachMon(monList, he) {
    if (!Array.isArray(monList)) return null;
    var tongTinChi = 0;
    var tongDiem = 0;
    var tongHe10 = 0;
    var soMon = 0;
    var soMonCoDiem10 = 0;
    var coMon = false;
    var diemChuDaiDien = "";

    for (var i = 0; i < monList.length; i++) {
        var mon = monList[i];
        if (!mon || !mon.tinh) continue;
        var chuoiTc = String(mon.tinChi || "").trim();
        var chuoiDiem = String(mon.diem || "").trim();
        var chuoiDiem10 = String(mon.diem10 || "").trim();
        if (chuoiTc === "") continue;

        var tc = docSo(chuoiTc);
        if (!(tc > 0 && tc <= 100)) continue;

        var diem = NaN;
        if (he === "10" && chuoiDiem10 !== "") {
            diem = quyDoi(chuoiDiem10, "10");
        }
        if (isNaN(diem) && chuoiDiem !== "") {
            diem = quyDoi(chuoiDiem, "4");
        }
        if (!hopLe(diem, 0, 4)) continue;

        if (chuoiDiem10 !== "") {
            var so10 = docSo(chuoiDiem10);
            if (hopLe(so10, 0, 10)) {
                tongHe10 += so10 * tc;
                soMonCoDiem10++;
            }
        }

        tongTinChi += tc;
        tongDiem += diem * tc;
        soMon++;
        coMon = true;
        if (he === "chu") {
            diemChuDaiDien = chuoiDiem.toUpperCase();
        }
    }

    if (!coMon || tongTinChi <= 0) return null;
    var gpa = tongDiem / tongTinChi;

    if (he === "chu") {
        if (gpa >= 3.85) diemChuDaiDien = "A";
        else if (gpa >= 3.25) diemChuDaiDien = "B+";
        else if (gpa >= 2.75) diemChuDaiDien = "B";
        else if (gpa >= 2.25) diemChuDaiDien = "C+";
        else if (gpa >= 1.75) diemChuDaiDien = "C";
        else if (gpa >= 1.25) diemChuDaiDien = "D+";
        else if (gpa >= 0.5) diemChuDaiDien = "D";
        else diemChuDaiDien = "F";
    }

    var ketQua = {
        gpa: gpa,
        tongTinChi: tongTinChi,
        soMon: soMon,
        tongDiem: tongDiem,
        kieuNhap: he === "chu" ? "chu" : "so",
        diemChu: diemChuDaiDien
    };

    if (soMonCoDiem10 === soMon && soMon > 0) {
        ketQua.diemHe10Tb = tongHe10 / tongTinChi;
    }

    return ketQua;
}

function dongBoHocKySangTichLuy(tenKy, ketQuaKy) {
    if (!tenKy) return;

    if (ketQuaKy) {
        var viTriDaXoa = danhSachKyDaXoaKhoiBieuDo.indexOf(tenKy);
        if (viTriDaXoa !== -1) {
            danhSachKyDaXoaKhoiBieuDo.splice(viTriDaXoa, 1);
        }
        if (dangDungMocMau) {
            danhSachMocTichLuy = [];
            dangDungMocMau = false;
        }
        var viTri = -1;
        for (var i = 0; i < danhSachMocTichLuy.length; i++) {
            if (danhSachMocTichLuy[i].ten === tenKy) {
                viTri = i;
                break;
            }
        }
        var diem10Tb = (typeof ketQuaKy.diemHe10Tb === "number" && !isNaN(ketQuaKy.diemHe10Tb))
            ? ketQuaKy.diemHe10Tb
            : null;
        var mocMoi = {
            ten: tenKy,
            gpa: ketQuaKy.gpa,
            diemHe10: diem10Tb,
            tongTinChi: ketQuaKy.tongTinChi || 0,
            kieuNhap: ketQuaKy.kieuNhap,
            diemChu: ketQuaKy.diemChu || "",
            tuBangMon: true
        };
        if (viTri !== -1) {
            danhSachMocTichLuy[viTri] = mocMoi;
        } else {
            danhSachMocTichLuy.push(mocMoi);
        }
        sapXepMocTheoHocKy(danhSachMocTichLuy);
        luuBieuDoTichLuyVaoBoNho();
        veBieuDoTichLuy(danhSachMocTichLuy);
    } else if (!dangDungMocMau) {
        for (var j = danhSachMocTichLuy.length - 1; j >= 0; j--) {
            if (danhSachMocTichLuy[j].ten === tenKy && danhSachMocTichLuy[j].tuBangMon) {
                danhSachMocTichLuy.splice(j, 1);
            }
        }
        luuBieuDoTichLuyVaoBoNho();
        veBieuDoTichLuy(danhSachMocTichLuy);
    }
}

function tuDongLuuVaDongBoTichLuy() {
    if (!lay("danh-sach-mon") || !lay("ten-ky") || !lay("he-diem")) return;
    var tenKy = lay("ten-ky").value;
    var he = lay("he-diem").value;
    var danhSach = [];
    var dong = lay("danh-sach-mon").getElementsByTagName("tr");
    for (var i = 0; i < dong.length; i++) {
        var oTinh = dong[i].querySelector(".tinh");
        var oTen = dong[i].querySelector(".ten");
        var oTc = dong[i].querySelector(".tin-chi");
        var oDiem = dong[i].querySelector(".diem");
        var oDiem10 = dong[i].querySelector(".diem-10");
        if (!oTinh) continue;
        danhSach.push({
            tinh: oTinh.checked,
            ten: oTen ? oTen.value : "",
            tinChi: oTc ? oTc.value : "",
            diem: oDiem ? oDiem.value : "",
            diem10: oDiem10 ? oDiem10.value : ""
        });
    }

    var duLieuKy = { tenKy: tenKy, he: he, mon: danhSach };
    var tatCaKy = docTatCaHocKyDaLuu();
    tatCaKy[tenKy] = duLieuKy;

    try {
        ghiLuuTru(layKhoaLuu(), JSON.stringify(duLieuKy));
        ghiLuuTru(layKhoaLuuDanhSachKy(), JSON.stringify(tatCaKy));
    } catch (loi) { }

    var ketQuaKy = tinhGpaHopLeTuDanhSachMon(danhSach, he);
    dongBoHocKySangTichLuy(tenKy, ketQuaKy);

    if (ketQuaKy && ketQuaKy.soMon > 0) {
        hienThiKetQuaHocKy(ketQuaKy, he);
    } else {
        xoaKetQua();
    }

    capNhatHuyHieuDanhSachHocKy();

    if (lay("trang-thai-luu")) {
        lay("trang-thai-luu").innerText = ketQuaKy
            ? "Đã tự động lưu \"" + tenKy + "\" và đồng bộ điểm (" + hienSo(ketQuaKy.gpa) + ") sang mục GPA tích lũy."
            : "Đã tự động lưu danh sách môn của \"" + tenKy + "\".";
    }
}

function moCustomSelectHocKy() {
    var ds = lay("danh-sach-lua-chon-ky");
    var nut = lay("nut-kich-hoat-ten-ky");
    if (!ds || !nut) return;
    ds.removeAttribute("hidden");
    nut.setAttribute("aria-expanded", "true");
    var daChon = ds.querySelector('.muc-lua-chon-ky[aria-selected="true"]');
    if (daChon && typeof daChon.focus === "function") {
        daChon.focus();
    }
}

function dongCustomSelectHocKy() {
    var ds = lay("danh-sach-lua-chon-ky");
    var nut = lay("nut-kich-hoat-ten-ky");
    if (!ds || !nut) return;
    ds.setAttribute("hidden", "hidden");
    nut.setAttribute("aria-expanded", "false");
}

function moDongCustomSelectHocKy() {
    var nut = lay("nut-kich-hoat-ten-ky");
    if (!nut) return;
    var dangMo = nut.getAttribute("aria-expanded") === "true";
    if (dangMo) {
        dongCustomSelectHocKy();
    } else {
        moCustomSelectHocKy();
    }
}

function chonHocKyCustomSelect(tenKy) {
    if (!tenKy) return;
    var selectGoc = lay("ten-ky");
    if (selectGoc) {
        selectGoc.value = tenKy;
    }
    dongCustomSelectHocKy();
    chuyenHocKyTinhGpa();
}

function capNhatHuyHieuDanhSachHocKy() {
    var selectGoc = lay("ten-ky");
    var tenKyHienTai = selectGoc ? selectGoc.value : "";
    var nhanHienThi = lay("nhan-ky-dang-chon");
    if (nhanHienThi && tenKyHienTai) {
        nhanHienThi.innerText = tenKyHienTai;
    }

    var tatCaKy = docTatCaHocKyDaLuu();
    var ds = lay("danh-sach-lua-chon-ky");
    if (ds) {
        var items = ds.querySelectorAll(".muc-lua-chon-ky");
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var ten = item.getAttribute("data-value");
            var duLieuKy = tatCaKy[ten];
            var soMon = 0;
            if (duLieuKy && Array.isArray(duLieuKy.mon)) {
                var kq = tinhGpaHopLeTuDanhSachMon(duLieuKy.mon, duLieuKy.he);
                if (kq) soMon = kq.soMon;
            }

            var huyHieu = item.querySelector(".huy-hieu-so-mon-ky");
            if (huyHieu) {
                if (soMon > 0) {
                    huyHieu.innerText = soMon + " môn";
                    huyHieu.removeAttribute("hidden");
                } else {
                    huyHieu.innerText = "";
                    huyHieu.setAttribute("hidden", "hidden");
                }
            }

            if (ten === tenKyHienTai) {
                item.setAttribute("aria-selected", "true");
            } else {
                item.setAttribute("aria-selected", "false");
            }
        }
    }

    if (selectGoc && selectGoc.options) {
        for (var j = 0; j < selectGoc.options.length; j++) {
            var opt = selectGoc.options[j];
            var tenOpt = opt.value;
            var dl = tatCaKy[tenOpt];
            var sm = 0;
            if (dl && Array.isArray(dl.mon)) {
                var kqOpt = tinhGpaHopLeTuDanhSachMon(dl.mon, dl.he);
                if (kqOpt) sm = kqOpt.soMon;
            }
            if (sm > 0) {
                opt.text = tenOpt + " (" + sm + " môn)";
            } else {
                opt.text = tenOpt;
            }
        }
    }
}

function khoiTaoCustomSelectHocKy() {
    var nut = lay("nut-kich-hoat-ten-ky");
    var ds = lay("danh-sach-lua-chon-ky");
    if (!nut || !ds) return;

    nut.onclick = function (e) {
        if (e && typeof e.stopPropagation === "function") e.stopPropagation();
        moDongCustomSelectHocKy();
    };

    nut.onkeydown = function (e) {
        if (!e) return;
        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
            if (typeof e.preventDefault === "function") e.preventDefault();
            moCustomSelectHocKy();
        } else if (e.key === "Escape") {
            dongCustomSelectHocKy();
        }
    };

    var items = ds.querySelectorAll(".muc-lua-chon-ky");
    for (var i = 0; i < items.length; i++) {
        (function (item) {
            item.onclick = function (e) {
                if (e && typeof e.stopPropagation === "function") e.stopPropagation();
                var val = item.getAttribute("data-value");
                if (val) chonHocKyCustomSelect(val);
            };
            item.onkeydown = function (e) {
                if (!e) return;
                if (e.key === "Enter" || e.key === " ") {
                    if (typeof e.preventDefault === "function") e.preventDefault();
                    var val = item.getAttribute("data-value");
                    if (val) chonHocKyCustomSelect(val);
                } else if (e.key === "ArrowDown") {
                    if (typeof e.preventDefault === "function") e.preventDefault();
                    var next = item.nextElementSibling;
                    if (next && typeof next.focus === "function") next.focus();
                } else if (e.key === "ArrowUp") {
                    if (typeof e.preventDefault === "function") e.preventDefault();
                    var prev = item.previousElementSibling;
                    if (prev && typeof prev.focus === "function") prev.focus();
                } else if (e.key === "Escape") {
                    dongCustomSelectHocKy();
                    if (typeof nut.focus === "function") nut.focus();
                }
            };
        })(items[i]);
    }

    capNhatHuyHieuDanhSachHocKy();
}

function chuyenHocKyTinhGpa() {
    if (!lay("ten-ky") || !lay("danh-sach-mon")) return;
    var tenKyMoi = lay("ten-ky").value;
    var tatCaKy = docTatCaHocKyDaLuu();
    var duLieuKy = tatCaKy[tenKyMoi];
    var heHienTai = lay("he-diem") ? lay("he-diem").value : "4";

    lay("danh-sach-mon").innerHTML = "";
    if (duLieuKy && Array.isArray(duLieuKy.mon) && duLieuKy.mon.length > 0) {
        lay("he-diem").value = heHienTai;
        heDiemCu = heHienTai;
        for (var i = 0; i < duLieuKy.mon.length; i++) {
            themMon(duLieuKy.mon[i], true);
        }
        capNhatSoThuTuVaHeChuBangMon();

        var ketQuaKy = tinhGpaHopLeTuDanhSachMon(duLieuKy.mon, heHienTai);
        if (ketQuaKy && ketQuaKy.soMon > 0) {
            hienThiKetQuaHocKy(ketQuaKy, heHienTai);
        } else {
            xoaKetQua();
        }

        if (lay("trang-thai-luu")) {
            lay("trang-thai-luu").innerText = "Đã tải dữ liệu môn học đã lưu của \"" + tenKyMoi + "\".";
        }
    } else {
        lay("he-diem").value = heHienTai;
        heDiemCu = heHienTai;
        themMon(null, true);
        themMon(null, true);
        capNhatSoThuTuVaHeChuBangMon();
        xoaKetQua();
        if (lay("trang-thai-luu")) {
            lay("trang-thai-luu").innerText = "Đang chọn \"" + tenKyMoi + "\". Dữ liệu sẽ tự động lưu khi bạn điền môn học.";
        }
    }
    dongBoTichLuySangMucTieu();
    capNhatHuyHieuDanhSachHocKy();
}

function tinhGPA() {
    var dong = lay("danh-sach-mon").getElementsByTagName("tr");
    var he = lay("he-diem").value;
    var tongTinChi = 0, tongDiem = 0, tongHe10 = 0, soMon = 0;
    var soMonCoDiem10 = 0;
    var coLoi = false;
    for (var i = 0; i < dong.length; i++) {
        var oTinh = dong[i].querySelector(".tinh");
        var oTc = dong[i].querySelector(".tin-chi");
        var oDiem = dong[i].querySelector(".diem");
        var oDiem10 = dong[i].querySelector(".diem-10");
        var loiTc = dong[i].querySelector(".loi-tin-chi");
        var loiDiem = dong[i].querySelector(".loi-diem");
        var loiDiem10 = dong[i].querySelector(".loi-diem-10");

        if (loiTc) loiTc.innerText = "";
        if (loiDiem) loiDiem.innerText = "";
        if (loiDiem10) loiDiem10.innerText = "";
        if (oTc) oTc.setAttribute("aria-invalid", "false");
        if (oDiem) oDiem.setAttribute("aria-invalid", "false");
        if (oDiem10) oDiem10.setAttribute("aria-invalid", "false");

        if (!oTinh || !oTinh.checked) continue;

        var tinChi = docSo(oTc.value);
        if (!(tinChi > 0 && tinChi <= 100)) {
            if (loiTc) loiTc.innerText = "Nhập tín chỉ > 0 và ≤ 100.";
            if (oTc) oTc.setAttribute("aria-invalid", "true");
            coLoi = true;
        }

        var diemHe4 = NaN;
        if (he === "10") {
            var chuoi10 = oDiem10 ? oDiem10.value.trim() : "";
            if (chuoi10 !== "") {
                var so10 = docSo(chuoi10);
                if (hopLe(so10, 0, 10)) {
                    diemHe4 = quyDoi(chuoi10, "10");
                    tongHe10 += so10 * tinChi;
                    soMonCoDiem10++;
                } else {
                    if (loiDiem10) loiDiem10.innerText = "Nhập điểm từ 0 đến 10.";
                    if (oDiem10) oDiem10.setAttribute("aria-invalid", "true");
                    coLoi = true;
                }
            } else {
                diemHe4 = quyDoi(oDiem.value, "4");
                if (!hopLe(diemHe4, 0, 4)) {
                    if (loiDiem10) loiDiem10.innerText = "Nhập điểm hệ 10 từ 0 đến 10.";
                    if (oDiem10) oDiem10.setAttribute("aria-invalid", "true");
                    coLoi = true;
                }
            }
        } else {
            diemHe4 = quyDoi(oDiem.value, "4");
            if (!hopLe(diemHe4, 0, 4)) {
                if (loiDiem) loiDiem.innerText = "Nhập điểm từ 0 đến 4.";
                if (oDiem) oDiem.setAttribute("aria-invalid", "true");
                coLoi = true;
            }
        }

        if (hopLe(diemHe4, 0, 4) && tinChi > 0 && tinChi <= 100) {
            tongTinChi += tinChi;
            tongDiem += diemHe4 * tinChi;
            soMon++;
        }
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
    var ketQua = {
        gpa: gpa,
        tongTinChi: tongTinChi,
        soMon: soMon,
        tongDiem: tongDiem
    };
    if (he === "10" && soMonCoDiem10 === soMon && soMon > 0) {
        ketQua.diemHe10Tb = tongHe10 / tongTinChi;
    }
    hienThiKetQuaHocKy(ketQua, he);
    tuDongLuuVaDongBoTichLuy();
    capNhatHuyHieuDanhSachHocKy();
}

function doiHeDiem() {
    heDiemCu = lay("he-diem").value;
    capNhatSoThuTuVaHeChuBangMon();
    tuDongLuuVaDongBoTichLuy();
    capNhatHuyHieuDanhSachHocKy();
}

function lamMoi() {
    if (!confirm("Xóa danh sách môn đang nhập của học kỳ này?")) return;
    lay("danh-sach-mon").innerHTML = "";
    themMon();
}

function duLieuMau() {
    if (!confirm("Thay danh sách đang nhập bằng dữ liệu mẫu?")) return;
    lay("danh-sach-mon").innerHTML = "";
    lay("he-diem").value = "4";
    heDiemCu = "4";
    if (!lay("ten-ky").value) {
        lay("ten-ky").value = "HK1 2024-2025";
    }
    themMon({ tinh: true, ten: "Marketing Dịch vụ", tinChi: "3", diem: "4" }, true);
    themMon({ tinh: true, ten: "Social Media Marketing", tinChi: "3", diem: "3,5" }, true);
    themMon({ tinh: true, ten: "Quản trị bán hàng", tinChi: "2", diem: "3" }, true);
    themMon({ tinh: true, ten: "Khoa học dữ liệu", tinChi: "3", diem: "3,5" }, true);
    themMon({ tinh: true, ten: "Thiết kế Web", tinChi: "3", diem: "4" }, true);
    themMon({ tinh: true, ten: "Tiếng Anh ngành Marketing", tinChi: "4", diem: "3,5" }, true);
    tinhGPA();
}

var EMAIL_QUAN_TRI = "ducanh05012k6@gmail.com";
var thangBieuDoTichLuy = 4;
var dangDungMocMau = true;

var THU_TU_HOC_KY = [
    "HK1 2023-2024",
    "HK2 2023-2024",
    "HK1 2024-2025",
    "HK2 2024-2025",
    "HK hè 2024-2025",
    "HK1 2025-2026",
    "HK2 2025-2026",
    "HK hè 2025-2026",
    "HK1 2026-2027"
];

var danhSachMocTichLuy = [
    { ten: "HK1 2024-2025", gpa: 3.10, diemHe10: 7.75, tongTinChi: 12, kieuNhap: "so" },
    { ten: "HK2 2024-2025", gpa: 3.18, diemHe10: 7.95, tongTinChi: 12, kieuNhap: "so" },
    { ten: "HK1 2025-2026", gpa: 3.25, diemHe10: 8.12, tongTinChi: 12, kieuNhap: "so" },
    { ten: "HK2 2025-2026", gpa: 3.28, diemHe10: 8.20, tongTinChi: 12, kieuNhap: "so" },
    { ten: "HK1 2026-2027", gpa: 3.32, diemHe10: 8.30, tongTinChi: 12, kieuNhap: "so" }
];
var tenMocDangChon = null;
var danhSachKyDaXoaKhoiBieuDo = [];

function layTinChiCuaHocKy(tenKy, mocItem) {
    if (mocItem && typeof mocItem.tongTinChi === "number" && mocItem.tongTinChi > 0) {
        return mocItem.tongTinChi;
    }
    try {
        var tatCaKy = docTatCaHocKyDaLuu();
        if (tatCaKy && tatCaKy[tenKy] && Array.isArray(tatCaKy[tenKy].mon)) {
            var kq = tinhGpaHopLeTuDanhSachMon(tatCaKy[tenKy].mon, tatCaKy[tenKy].he);
            if (kq && typeof kq.tongTinChi === "number" && kq.tongTinChi > 0) {
                return kq.tongTinChi;
            }
        }
    } catch (loi) { }
    return 0;
}

function layDiemHe10CuaHocKy(tenKy, mocItem) {
    if (mocItem && typeof mocItem.diemHe10 === "number" && !isNaN(mocItem.diemHe10)) {
        return mocItem.diemHe10;
    }
    try {
        var tatCaKy = docTatCaHocKyDaLuu();
        if (tatCaKy && tatCaKy[tenKy] && Array.isArray(tatCaKy[tenKy].mon)) {
            var kq = tinhGpaHopLeTuDanhSachMon(tatCaKy[tenKy].mon, tatCaKy[tenKy].he || "10");
            if (kq && typeof kq.diemHe10Tb === "number" && !isNaN(kq.diemHe10Tb)) {
                return kq.diemHe10Tb;
            }
        }
    } catch (loi) { }
    return null;
}

function sapXepMocTheoHocKy(danhSach) {
    danhSach.sort(function (a, b) {
        var viTriA = THU_TU_HOC_KY.indexOf(a.ten);
        var viTriB = THU_TU_HOC_KY.indexOf(b.ten);
        if (viTriA === -1 && viTriB === -1) return 0;
        if (viTriA === -1) return 1;
        if (viTriB === -1) return -1;
        return viTriA - viTriB;
    });
}

function layMocHienThiTheoThang(danhSach) {
    if (!Array.isArray(danhSach)) return [];
    if (thangBieuDoTichLuy === 10) {
        var ketQua = [];
        for (var i = 0; i < danhSach.length; i++) {
            if (danhSach[i].kieuNhap !== "chu") {
                var d10 = layDiemHe10CuaHocKy(danhSach[i].ten, danhSach[i]);
                if (typeof d10 === "number" && !isNaN(d10)) {
                    ketQua.push(danhSach[i]);
                }
            }
        }
        return ketQua;
    }
    return danhSach.slice();
}

function coMocDiemSo() {
    for (var i = 0; i < danhSachMocTichLuy.length; i++) {
        if (danhSachMocTichLuy[i].kieuNhap !== "chu") {
            return true;
        }
    }
    return false;
}

function coMocHe10() {
    for (var i = 0; i < danhSachMocTichLuy.length; i++) {
        if (danhSachMocTichLuy[i].kieuNhap !== "chu") {
            var d10 = layDiemHe10CuaHocKy(danhSachMocTichLuy[i].ten, danhSachMocTichLuy[i]);
            if (typeof d10 === "number" && !isNaN(d10)) {
                return true;
            }
        }
    }
    return false;
}

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

function doiDiemTheoThangBieuDo(diemHe4, diemHe10) {
    if (thangBieuDoTichLuy === 10) {
        if (typeof diemHe10 === "number" && !isNaN(diemHe10)) {
            return diemHe10;
        }
        return diemHe4 * 2.5;
    }
    return diemHe4;
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

function capNhatNhanOInputMoc() {
    var kieuNhap = lay("kieu-nhap-moc-ky") ? lay("kieu-nhap-moc-ky").value : "so";
    var nhanMoc = layNhanDiemMocKy();
    var oDiem = lay("diem-moc-ky");
    var nutThang = layNutDoiThangBieuDo();

    if (kieuNhap === "chu") {
        if (nhanMoc) {
            nhanMoc.innerText = "Điểm chữ học kỳ (A+, A, B+... F)";
        }
        if (oDiem) {
            oDiem.placeholder = "Ví dụ: A, B+, C...";
            oDiem.setAttribute("inputmode", "text");
        }
        if (nutThang) {
            nutThang.classList.add("bi-khoa");
            nutThang.title = "Chế độ Nhập theo điểm chữ chỉ sử dụng Thang 4.0";
        }
    } else {
        if (nhanMoc) {
            nhanMoc.innerText = thangBieuDoTichLuy === 10
                ? "GPA học kỳ (0–10)"
                : "GPA học kỳ (0–4)";
        }
        if (oDiem) {
            oDiem.placeholder = thangBieuDoTichLuy === 10 ? "Ví dụ: 8,30" : "Ví dụ: 3,45";
            oDiem.setAttribute("inputmode", "decimal");
        }
        if (nutThang) {
            if (coMocHe10()) {
                nutThang.classList.remove("bi-khoa");
                nutThang.title = "Bấm để chuyển đổi hiển thị giữa Thang 4.0 và Thang 10.0";
            } else {
                nutThang.classList.add("bi-khoa");
                nutThang.title = "Cần có ít nhất 1 mốc có điểm hệ 10 để đổi sang Thang 10.0";
            }
        }
    }
}

function doiKieuNhapMocBieuDo() {
    var kieuNhap = lay("kieu-nhap-moc-ky") ? lay("kieu-nhap-moc-ky").value : "so";
    var oDiem = lay("diem-moc-ky");
    if (oDiem) {
        oDiem.value = "";
    }
    if (kieuNhap === "chu" && thangBieuDoTichLuy === 10) {
        thangBieuDoTichLuy = 4;
    }
    capNhatNhanOInputMoc();
    veBieuDoTichLuy(danhSachMocTichLuy);
    if (lay("thong-bao-bieu-do")) {
        lay("thong-bao-bieu-do").innerText = kieuNhap === "chu"
            ? "Đang chọn Nhập theo điểm chữ (A+, A, B+, B, C+, C, D+, D, F) — chỉ áp dụng trên Thang 4.0."
            : "Đang chọn Nhập theo điểm số — hỗ trợ chuyển đổi qua lại giữa Thang 4.0 và Thang 10.0.";
    }
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
    var kieuNhap = lay("kieu-nhap-moc-ky") ? lay("kieu-nhap-moc-ky").value : "so";
    if (thangBieuDoTichLuy === 4) {
        if (kieuNhap === "chu") {
            if (lay("thong-bao-bieu-do")) {
                lay("thong-bao-bieu-do").innerText = "Chỉ hỗ trợ đổi sang Thang 10.0 khi bạn chọn 'Nhập theo điểm số'.";
            }
            return;
        }
        if (!coMocHe10()) {
            if (lay("thong-bao-bieu-do")) {
                lay("thong-bao-bieu-do").innerText = "Chưa có mốc nào có dữ liệu điểm hệ 10 từ bảng môn học để hiển thị trên Thang 10.0.";
            }
            return;
        }
        thangBieuDoTichLuy = 10;
    } else {
        thangBieuDoTichLuy = 4;
    }

    capNhatNhanOInputMoc();
    veBieuDoTichLuy(danhSachMocTichLuy);
    if (lay("thong-bao-bieu-do")) {
        lay("thong-bao-bieu-do").innerText = thangBieuDoTichLuy === 10
            ? "Đã chuyển sang Thang 10.0 (chỉ tính và hiển thị các mốc học kỳ có điểm hệ 10 thực tế)."
            : "Đã chuyển biểu đồ về hiển thị chuẩn theo Thang 4.0.";
    }
}

function tinhTrungBinhMocBieuDo(moc) {
    if (!Array.isArray(moc) || moc.length === 0) return null;
    var tongHe4 = 0;
    var tongHienThi = 0;
    for (var i = 0; i < moc.length; i++) {
        var diemMocHe4 = Math.round(moc[i].gpa * 100) / 100;
        var d10 = layDiemHe10CuaHocKy(moc[i].ten, moc[i]);
        var diemMocHienThi = Math.round(doiDiemTheoThangBieuDo(moc[i].gpa, d10) * 100) / 100;
        tongHe4 += diemMocHe4;
        tongHienThi += diemMocHienThi;
    }
    var tbHe4 = tongHe4 / moc.length;
    var tbHienThi = tongHienThi / moc.length;
    return {
        gpaHe4: tbHe4,
        gpaXepLoaiHe4: Math.round(tbHe4 * 100) / 100,
        gpaHienThi: tbHienThi,
        soHocKy: moc.length
    };
}

function veBieuDoTichLuy(danhSachMoc, gpaTichLuyChung) {
    ganSuKienNutDoiThang();
    capNhatNhanOInputMoc();
    var svg = lay("bieu-do-gpa-svg");
    if (!svg) return;

    var moc = layMocHienThiTheoThang(danhSachMoc);

    var mauSo = layMauSoThangBieuDo();
    if (mauSo) {
        mauSo.innerText = thangBieuDoTichLuy === 10 ? "/ 10,0" : "/ 4,0";
    }
    var nutThang = layNutDoiThangBieuDo();
    if (nutThang) {
        nutThang.innerText = thangBieuDoTichLuy === 10 ? "↻ Thang 10.0" : "↻ Thang 4.0";
    }

    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }

    var laDiDong = (typeof window !== "undefined" && window.innerWidth <= 640) ||
                   (svg.clientWidth > 0 && svg.clientWidth <= 480);
    var rong = laDiDong ? 420 : 740;
    var cao = laDiDong ? 230 : 300;
    svg.setAttribute("viewBox", "0 0 " + rong + " " + cao);

    var leTrucTrai = laDiDong ? 34 : 48;
    var leTrucPhai = laDiDong ? 16 : 30;
    var leTren = laDiDong ? 32 : 48;
    var leDuoi = laDiDong ? 38 : 52;
    var vungCao = cao - leTren - leDuoi;

    var leTraiMoc = laDiDong ? 52 : 90;
    var lePhaiMoc = laDiDong ? 26 : 50;
    var vungRongMoc = rong - leTraiMoc - lePhaiMoc;

    function tinhY(diemHe4, diemHe10) {
        if (thangBieuDoTichLuy === 10 && typeof diemHe10 === "number" && !isNaN(diemHe10)) {
            var gioiHan10 = Math.max(0, Math.min(10, diemHe10));
            return leTren + vungCao - (gioiHan10 / 10) * vungCao;
        }
        var gioiHan = Math.max(0, Math.min(4, diemHe4));
        return leTren + vungCao - (gioiHan / 4) * vungCao;
    }

    function tinhX(chiSo, tongSo) {
        if (tongSo <= 1) return leTraiMoc + vungRongMoc / 2;
        return leTraiMoc + (chiSo * vungRongMoc) / (tongSo - 1);
    }

    var cacMocNgangHe4 = [1.0, 2.0, 3.0, 4.0];
    for (var g = 0; g < cacMocNgangHe4.length; g++) {
        var giaTriHe4 = cacMocNgangHe4[g];
        var yMoc = tinhY(giaTriHe4);
        var laMocChinh = giaTriHe4 === 3.0 || giaTriHe4 === 4.0;
        var nhanMoc = doiDiemTheoThangBieuDo(giaTriHe4);

        svg.appendChild(kichHoatTheSvg("line", {
            x1: leTrucTrai,
            y1: yMoc,
            x2: rong - leTrucPhai,
            y2: yMoc,
            stroke: laMocChinh ? "#cbd5e1" : "#e2e8f0",
            "stroke-width": laMocChinh ? "1.2" : "1",
            "stroke-dasharray": "4 4"
        }));

        var nhanY = kichHoatTheSvg("text", {
            x: leTrucTrai - (laDiDong ? 6 : 10),
            y: yMoc + 4,
            "text-anchor": "end",
            fill: laMocChinh ? "#475569" : "#94a3b8",
            "font-size": laDiDong ? "12" : "11",
            "font-weight": laMocChinh ? "bold" : "600"
        });
        nhanY.textContent = nhanMoc.toFixed(1).replace(".", ",");
        svg.appendChild(nhanY);
    }

    var theChenhLech = lay("chenh-lech-gpa-tich-luy");

    if (moc.length === 0) {
        boChonMocBieuDo();
        if (lay("so-gpa-tich-luy-lon")) {
            lay("so-gpa-tich-luy-lon").innerText = "—";
        }
        if (theChenhLech) {
            theChenhLech.className = "nhan-chenh-lech";
            theChenhLech.innerText = "Chưa có mốc học kỳ trên biểu đồ";
        }
        dongBoTichLuySangMucTieu(null);
        var chuTrong = kichHoatTheSvg("text", {
            x: leTraiMoc + vungRongMoc / 2,
            y: leTren + vungCao / 2 + 4,
            "text-anchor": "middle",
            fill: "#94a3b8",
            "font-size": "13"
        });
        chuTrong.textContent = "Biểu đồ đang trống — hãy chọn học kỳ bên dưới và bấm + Thêm mốc";
        svg.appendChild(chuTrong);
        return;
    }

    var ketQuaTb = tinhTrungBinhMocBieuDo(moc);
    var gpaHienThi = 0;
    var gpaXepLoaiHe4 = 0;

    if (typeof gpaTichLuyChung === "number" && !isNaN(gpaTichLuyChung)) {
        gpaHienThi = doiDiemTheoThangBieuDo(gpaTichLuyChung);
        gpaXepLoaiHe4 = gpaTichLuyChung;
    } else if (ketQuaTb) {
        gpaHienThi = ketQuaTb.gpaHienThi;
        gpaXepLoaiHe4 = ketQuaTb.gpaXepLoaiHe4;
    }

    if (lay("so-gpa-tich-luy-lon")) {
        lay("so-gpa-tich-luy-lon").innerText = hienSo(gpaHienThi);
    }

    if (theChenhLech) {
        theChenhLech.className = "nhan-chenh-lech";
        theChenhLech.innerText = "Tính trên " + moc.length + " học kỳ · Xếp loại: " + xepLoai(gpaXepLoaiHe4);
    }

    dongBoTichLuySangMucTieu(tinhTrungBinhMocBieuDo(danhSachMoc));

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
        "stop-opacity": "0.22"
    }));
    gradient.appendChild(kichHoatTheSvg("stop", {
        offset: "100%",
        "stop-color": "#4f46e5",
        "stop-opacity": "0.02"
    }));
    defs.appendChild(gradient);
    svg.insertBefore(defs, svg.firstChild);

    var dayY = leTren + vungCao;

    svg.appendChild(kichHoatTheSvg("line", {
        x1: leTrucTrai,
        y1: dayY,
        x2: rong - leTrucPhai,
        y2: dayY,
        stroke: "#f1f5f9",
        "stroke-width": "1"
    }));

    var danhSachToaDo = [];
    for (var i = 0; i < moc.length; i++) {
        var tcMoc = layTinChiCuaHocKy(moc[i].ten, moc[i]);
        var d10Moc = layDiemHe10CuaHocKy(moc[i].ten, moc[i]);
        danhSachToaDo.push({
            x: tinhX(i, moc.length),
            y: tinhY(moc[i].gpa, d10Moc),
            ten: moc[i].ten,
            gpaHe4: moc[i].gpa,
            diemHe10: d10Moc,
            tongTinChi: tcMoc,
            kieuNhap: moc[i].kieuNhap || "so",
            diemChu: moc[i].diemChu || "",
            gpaHienThi: doiDiemTheoThangBieuDo(moc[i].gpa, d10Moc)
        });
    }

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
            "stroke-width": laDiDong ? "4" : "3.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
        }));
    }

    for (var j = 0; j < danhSachToaDo.length; j++) {
        var diemNut = danhSachToaDo[j];
        var laDiemCuoi = j === danhSachToaDo.length - 1;
        var laDiemChon = tenMocDangChon === diemNut.ten;
        svg.appendChild(kichHoatTheSvg("line", {
            x1: diemNut.x,
            y1: diemNut.y + (laDiemChon ? 11 : 8),
            x2: diemNut.x,
            y2: dayY,
            stroke: laDiemChon ? "#fca5a5" : (laDiemCuoi ? "#c7d2fe" : "#e2e8f0"),
            "stroke-width": "1.2",
            "stroke-dasharray": "3 3"
        }));
    }

    for (var m = 0; m < danhSachToaDo.length; m++) {
        var nut = danhSachToaDo[m];
        var laNutCuoi = m === danhSachToaDo.length - 1;
        var dangChon = tenMocDangChon === nut.ten;

        var moTaTc = nut.tongTinChi > 0 ? ", " + String(nut.tongTinChi).replace(".", ",") + " tín chỉ" : "";
        var nhomNut = kichHoatTheSvg("g", {
            "class": "nhom-nut-moc-gpa" + (dangChon ? " dang-chon" : "") + (laNutCuoi ? " nut-cuoi" : ""),
            "data-ten-moc": nut.ten,
            "tabindex": "0",
            "role": "button",
            "aria-label": "Mốc học kỳ " + nut.ten + ", điểm GPA " + hienSo(nut.gpaHienThi) + moTaTc + ". Bấm để chọn và xóa."
        });

        var vongHit = kichHoatTheSvg("circle", {
            cx: nut.x,
            cy: nut.y,
            r: laDiDong ? "22" : "18",
            fill: "transparent",
            "class": "vong-hit-moc"
        });
        nhomNut.appendChild(vongHit);

        var vongSang = kichHoatTheSvg("circle", {
            cx: nut.x,
            cy: nut.y,
            r: dangChon ? (laDiDong ? "17" : "16") : (laNutCuoi ? (laDiDong ? "14" : "13") : "11"),
            fill: dangChon ? "#e11d48" : (laNutCuoi ? "#4f46e5" : "transparent"),
            "fill-opacity": dangChon ? "0.22" : (laNutCuoi ? "0.15" : "0"),
            "class": "vong-sang-moc"
        });
        nhomNut.appendChild(vongSang);

        var vongTron = kichHoatTheSvg("circle", {
            cx: nut.x,
            cy: nut.y,
            r: dangChon ? "8" : (laDiDong ? "7" : "6.5"),
            fill: dangChon ? "#fff1f2" : "#ffffff",
            stroke: dangChon ? "#e11d48" : (laNutCuoi ? "#4f46e5" : "#6366f1"),
            "stroke-width": dangChon ? "3.5" : (laDiDong ? "3.5" : "3.2"),
            "class": "cham-moc-gpa"
        });
        var chuThich = kichHoatTheSvg("title");
        chuThich.textContent = nut.ten + ": " + hienSo(nut.gpaHienThi) + " / " + (thangBieuDoTichLuy === 10 ? "10,00" : "4,00") +
            (nut.diemChu ? " (" + nut.diemChu + ")" : "") + moTaTc + " — Bấm để chọn và xóa";
        vongTron.appendChild(chuThich);
        nhomNut.appendChild(vongTron);

        if (nhomNut.addEventListener) {
            nhomNut.addEventListener("click", (function (tTen, nX, nY, nDiem, nChu, nTc) {
                return function (suKien) {
                    suKien.stopPropagation();
                    chonMocBieuDo(tTen, nX, nY, nDiem, nChu, nTc);
                };
            })(nut.ten, nut.x, nut.y, nut.gpaHienThi, nut.diemChu, nut.tongTinChi));

            nhomNut.addEventListener("keydown", (function (tTen, nX, nY, nDiem, nChu, nTc) {
                return function (suKien) {
                    if (suKien.key === "Enter" || suKien.key === " ") {
                        suKien.preventDefault();
                        suKien.stopPropagation();
                        chonMocBieuDo(tTen, nX, nY, nDiem, nChu, nTc);
                    } else if (suKien.key === "Delete" || suKien.key === "Backspace") {
                        suKien.preventDefault();
                        suKien.stopPropagation();
                        xoaMocTheoTen(tTen);
                    } else if (suKien.key === "Escape") {
                        suKien.preventDefault();
                        boChonMocBieuDo();
                    }
                };
            })(nut.ten, nut.x, nut.y, nut.gpaHienThi, nut.diemChu, nut.tongTinChi));
        } else {
            nhomNut.onclick = (function (tTen, nX, nY, nDiem, nChu, nTc) {
                return function (suKien) {
                    if (suKien && suKien.stopPropagation) suKien.stopPropagation();
                    chonMocBieuDo(tTen, nX, nY, nDiem, nChu, nTc);
                };
            })(nut.ten, nut.x, nut.y, nut.gpaHienThi, nut.diemChu, nut.tongTinChi);
        }

        svg.appendChild(nhomNut);

        var nhanDiem = kichHoatTheSvg("text", {
            x: nut.x,
            y: Math.max(laDiDong ? 16 : 20, nut.y - (laDiDong ? 10 : 14)),
            "text-anchor": "middle",
            fill: dangChon ? "#e11d48" : (laNutCuoi ? "#4338ca" : "#334155"),
            "font-size": laDiDong ? "13.5" : "11.5",
            "font-weight": "bold"
        });
        nhanDiem.textContent = nut.kieuNhap === "chu" && nut.diemChu && thangBieuDoTichLuy === 4
            ? hienSo(nut.gpaHienThi) + " (" + nut.diemChu + ")"
            : hienSo(nut.gpaHienThi);
        svg.appendChild(nhanDiem);

        var nhanKy = kichHoatTheSvg("text", {
            x: nut.x,
            y: cao - (laDiDong ? 12 : 16),
            "text-anchor": "middle",
            fill: dangChon ? "#e11d48" : (laNutCuoi ? "#1e1b4b" : "#64748b"),
            "font-size": laDiDong ? (danhSachToaDo.length > 5 ? "11" : "12.5") : (danhSachToaDo.length > 6 ? "10" : "11"),
            "font-weight": (laNutCuoi || dangChon) ? "bold" : "600"
        });
        var tenNhan = String(nut.ten || "");
        if (danhSachToaDo.length >= 4 && tenNhan) {
            tenNhan = tenNhan
                .replace(/\b20(\d{2})-20(\d{2})\b/g, "$1-$2")
                .replace(/\bHK\s+hè\b/gi, "Hè");
        }
        nhanKy.textContent = tenNhan;
        svg.appendChild(nhanKy);
    }

    svg.onclick = function (suKien) {
        if (!suKien.target.closest || !suKien.target.closest(".nhom-nut-moc-gpa")) {
            boChonMocBieuDo();
        }
    };

    var timThayMocChon = null;
    if (tenMocDangChon) {
        for (var n = 0; n < danhSachToaDo.length; n++) {
            if (danhSachToaDo[n].ten === tenMocDangChon) {
                timThayMocChon = danhSachToaDo[n];
                break;
            }
        }
    }
    if (timThayMocChon) {
        capNhatViTriHopXoaMoc(timThayMocChon);
    } else {
        boChonMocBieuDo();
    }
}

function capNhatViTriHopXoaMoc(nut) {
    var hop = lay("hop-xoa-moc-bieu-do");
    if (!hop || !nut) return;
    var oTen = lay("ten-moc-dang-chon");
    var oDiem = lay("diem-moc-dang-chon");
    var oTinChi = lay("tin-chi-moc-dang-chon");
    if (oTen) {
        var tenHien = String(nut.ten || "");
        oTen.innerText = tenHien.replace(/\b20(\d{2})-20(\d{2})\b/g, "$1-$2");
        oTen.title = nut.ten;
    }
    if (oDiem) {
        oDiem.innerText = hienSo(nut.gpaHienThi) + (nut.diemChu && thangBieuDoTichLuy === 4 ? " (" + nut.diemChu + ")" : "");
    }
    if (oTinChi) {
        if (typeof nut.tongTinChi === "number" && nut.tongTinChi > 0) {
            oTinChi.innerText = String(nut.tongTinChi).replace(".", ",") + " TC";
            oTinChi.style.display = "";
        } else {
            oTinChi.innerText = "— TC";
            oTinChi.style.display = "";
        }
    }
    var phanTramX = (nut.x / 740) * 100;
    var phanTramY = (nut.y / 300) * 100;
    hop.style.left = phanTramX.toFixed(2) + "%";
    hop.style.top = phanTramY.toFixed(2) + "%";

    hop.classList.remove("lech-trai", "lech-phai", "o-duoi");
    if (nut.x < 135) {
        hop.classList.add("lech-trai");
    } else if (nut.x > 740 - 135) {
        hop.classList.add("lech-phai");
    }
    if (nut.y < 75) {
        hop.classList.add("o-duoi");
    }
    hop.removeAttribute("hidden");
}

function boChonMocBieuDo() {
    tenMocDangChon = null;
    var hop = lay("hop-xoa-moc-bieu-do");
    if (hop) {
        hop.setAttribute("hidden", "until-found");
    }
    var cacNut = document.querySelectorAll ? document.querySelectorAll(".nhom-nut-moc-gpa.dang-chon") : [];
    for (var i = 0; i < cacNut.length; i++) {
        cacNut[i].classList.remove("dang-chon");
    }
}

function chonMocBieuDo(tenMoc, x, y, diemHienThi, diemChu, tongTinChi) {
    if (tenMocDangChon === tenMoc) {
        boChonMocBieuDo();
        return;
    }
    tenMocDangChon = tenMoc;
    capNhatViTriHopXoaMoc({
        x: x,
        y: y,
        ten: tenMoc,
        gpaHienThi: diemHienThi,
        diemChu: diemChu,
        tongTinChi: tongTinChi
    });
    var cacNut = document.querySelectorAll ? document.querySelectorAll(".nhom-nut-moc-gpa") : [];
    for (var i = 0; i < cacNut.length; i++) {
        if (cacNut[i].getAttribute("data-ten-moc") === tenMoc) {
            cacNut[i].classList.add("dang-chon");
            if (typeof cacNut[i].focus === "function") {
                cacNut[i].focus();
            }
        } else {
            cacNut[i].classList.remove("dang-chon");
        }
    }
}

function xoaMocTheoTen(tenMoc) {
    var thongBao = lay("thong-bao-bieu-do");
    if (!tenMoc) return;
    dangDungMocMau = false;

    var viTri = -1;
    for (var i = 0; i < danhSachMocTichLuy.length; i++) {
        if (danhSachMocTichLuy[i].ten === tenMoc) {
            viTri = i;
            break;
        }
    }
    if (viTri === -1) {
        if (thongBao) thongBao.innerText = "Không tìm thấy mốc \"" + tenMoc + "\" trên biểu đồ.";
        return;
    }

    var daXoa = danhSachMocTichLuy.splice(viTri, 1)[0];
    if (danhSachKyDaXoaKhoiBieuDo.indexOf(tenMoc) === -1) {
        danhSachKyDaXoaKhoiBieuDo.push(tenMoc);
    }

    if (thangBieuDoTichLuy === 10 && !coMocHe10()) {
        thangBieuDoTichLuy = 4;
    }

    boChonMocBieuDo();
    luuBieuDoTichLuyVaoBoNho();
    veBieuDoTichLuy(danhSachMocTichLuy);

    if (thongBao) {
        thongBao.innerText = danhSachMocTichLuy.length > 0
            ? "Đã xóa mốc \"" + daXoa.ten + "\" khỏi biểu đồ."
            : "Đã xóa hết các mốc học kỳ trên biểu đồ.";
    }
}

function xoaMocDangChonBieuDo() {
    if (tenMocDangChon) {
        xoaMocTheoTen(tenMocDangChon);
    }
}

function napDuLieuBieuDoMau() {
    dangDungMocMau = true;
    danhSachKyDaXoaKhoiBieuDo = [];
    boChonMocBieuDo();
    danhSachMocTichLuy = [
        { ten: "HK1 2024-2025", gpa: 3.10, diemHe10: 7.75, tongTinChi: 12, kieuNhap: "so" },
        { ten: "HK2 2024-2025", gpa: 3.18, diemHe10: 7.95, tongTinChi: 12, kieuNhap: "so" },
        { ten: "HK1 2025-2026", gpa: 3.25, diemHe10: 8.12, tongTinChi: 12, kieuNhap: "so" },
        { ten: "HK2 2025-2026", gpa: 3.28, diemHe10: 8.20, tongTinChi: 12, kieuNhap: "so" },
        { ten: "HK1 2026-2027", gpa: 3.32, diemHe10: 8.30, tongTinChi: 12, kieuNhap: "so" }
    ];
    if (lay("gpa-cu")) lay("gpa-cu").value = "3,28";
    if (lay("tin-chi-cu")) lay("tin-chi-cu").value = "60";
    if (lay("gpa-moi")) lay("gpa-moi").value = "3,48";
    if (lay("tin-chi-moi")) lay("tin-chi-moi").value = "15";
    if (lay("co-hoc-lai")) lay("co-hoc-lai").checked = false;

    luuBieuDoTichLuyVaoBoNho();
    veBieuDoTichLuy(danhSachMocTichLuy);
    if (lay("thong-bao-bieu-do")) {
        lay("thong-bao-bieu-do").innerText = "Đã nạp bộ dữ liệu biểu đồ mẫu gồm 5 mốc học kỳ.";
    }
    if (lay("ket-qua-tich-luy")) {
        lay("ket-qua-tich-luy").innerText = "GPA tích lũy mẫu: 3,23. Phép tính: (3,10 + 3,18 + 3,25 + 3,28 + 3,32) / 5.";
    }
}

function themMocBieuDo() {
    var oTen = lay("ten-moc-ky");
    var oDiem = lay("diem-moc-ky");
    var oKieu = lay("kieu-nhap-moc-ky");
    var thongBao = lay("thong-bao-bieu-do");
    if (!oTen || !oDiem) return;

    var ten = oTen.value.trim();
    var kieuNhap = oKieu ? oKieu.value : "so";
    var chuoiDiem = oDiem.value.trim();
    var diemHe4 = NaN;
    var diemChuChuan = "";
    var moTaDiem = "";

    if (kieuNhap === "chu") {
        diemHe4 = quyDoi(chuoiDiem, "chu");
        if (isNaN(diemHe4)) {
            if (thongBao) {
                thongBao.innerText = "Vui lòng nhập điểm chữ hợp lệ: A+, A, B+, B, C+, C, D+, D hoặc F.";
            }
            oDiem.focus();
            return;
        }
        diemChuChuan = chuoiDiem.toUpperCase();
        moTaDiem = diemChuChuan + " → " + hienSo(diemHe4);
        thangBieuDoTichLuy = 4;
    } else {
        var diemNhap = docSo(chuoiDiem);
        var gioiHanToiDa = thangBieuDoTichLuy === 10 ? 10 : 4;
        if (!hopLe(diemNhap, 0, gioiHanToiDa)) {
            if (thongBao) {
                thongBao.innerText = "Vui lòng nhập điểm số hợp lệ từ 0 đến " + gioiHanToiDa + ".";
            }
            oDiem.focus();
            return;
        }
        diemHe4 = thangBieuDoTichLuy === 10 ? diemNhap / 2.5 : diemNhap;
        moTaDiem = hienSo(diemNhap);
    }

    if (dangDungMocMau) {
        danhSachMocTichLuy = [];
        dangDungMocMau = false;
    }

    var viTriDaXoa = danhSachKyDaXoaKhoiBieuDo.indexOf(ten);
    if (viTriDaXoa !== -1) {
        danhSachKyDaXoaKhoiBieuDo.splice(viTriDaXoa, 1);
    }

    var viTriTrung = -1;
    for (var i = 0; i < danhSachMocTichLuy.length; i++) {
        if (danhSachMocTichLuy[i].ten === ten) {
            viTriTrung = i;
            break;
        }
    }

    var tongTcDaLuu = layTinChiCuaHocKy(ten, null);
    var diemHe10Moi = null;
    if (kieuNhap !== "chu") {
        if (thangBieuDoTichLuy === 10) {
            diemHe10Moi = docSo(chuoiDiem);
        } else {
            var d10CoSan = layDiemHe10CuaHocKy(ten, null);
            if (typeof d10CoSan === "number" && !isNaN(d10CoSan)) {
                diemHe10Moi = d10CoSan;
            }
        }
    }

    var daCapNhat = false;
    if (viTriTrung !== -1) {
        danhSachMocTichLuy[viTriTrung].gpa = diemHe4;
        if (diemHe10Moi !== null) {
            danhSachMocTichLuy[viTriTrung].diemHe10 = diemHe10Moi;
        }
        danhSachMocTichLuy[viTriTrung].kieuNhap = kieuNhap;
        danhSachMocTichLuy[viTriTrung].diemChu = diemChuChuan;
        if (tongTcDaLuu > 0) {
            danhSachMocTichLuy[viTriTrung].tongTinChi = tongTcDaLuu;
        }
        danhSachMocTichLuy[viTriTrung].tuBangMon = false;
        daCapNhat = true;
    } else {
        if (danhSachMocTichLuy.length >= 10) {
            if (thongBao) thongBao.innerText = "Biểu đồ hỗ trợ tối đa 10 mốc học kỳ.";
            return;
        }
        danhSachMocTichLuy.push({
            ten: ten,
            gpa: diemHe4,
            diemHe10: diemHe10Moi,
            tongTinChi: tongTcDaLuu,
            kieuNhap: kieuNhap,
            diemChu: diemChuChuan,
            tuBangMon: false
        });
    }

    sapXepMocTheoHocKy(danhSachMocTichLuy);
    luuBieuDoTichLuyVaoBoNho();

    if (oTen.tagName === "SELECT" && oTen.selectedIndex < oTen.options.length - 1) {
        oTen.selectedIndex = oTen.selectedIndex + 1;
    }
    oDiem.value = "";
    veBieuDoTichLuy(danhSachMocTichLuy);
    if (thongBao) {
        thongBao.innerText = (daCapNhat ? "Đã cập nhật điểm mốc \"" : "Đã thêm mốc \"") +
            ten + "\" (" + moTaDiem + ") trên biểu đồ.";
    }
}

function xoaMocCuoiBieuDo() {
    if (tenMocDangChon) {
        xoaMocTheoTen(tenMocDangChon);
    } else if (danhSachMocTichLuy.length > 0) {
        xoaMocTheoTen(danhSachMocTichLuy[danhSachMocTichLuy.length - 1].ten);
    } else {
        var thongBao = lay("thong-bao-bieu-do");
        if (thongBao) thongBao.innerText = "Biểu đồ hiện không còn mốc học kỳ nào để xóa.";
    }
}

function tinhTichLuy() {
    if (!lay("gpa-cu") || !lay("tin-chi-cu") || !lay("gpa-moi") || !lay("tin-chi-moi")) return;
    var gpaCu = docSo(lay("gpa-cu").value);
    var tcCu = docSo(lay("tin-chi-cu").value);
    var gpaMoi = docSo(lay("gpa-moi").value);
    var tcMoi = docSo(lay("tin-chi-moi").value);
    var ketQua = lay("ket-qua-tich-luy");
    if (lay("co-hoc-lai") && lay("co-hoc-lai").checked) {
        if (ketQua) ketQua.innerText = "Không cộng dồn khi thay thế điểm học lại. Cần tính lại từ danh sách đầy đủ các môn và chỉ chọn lần học được trường công nhận.";
        return;
    }
    if (!hopLe(gpaCu, 0, 4) || !hopLe(gpaMoi, 0, 4) ||
        !hopLe(tcCu, 0, 10000) || !(tcMoi > 0 && tcMoi <= 10000)) {
        if (ketQua) ketQua.innerText = "Hãy nhập đủ GPA từ 0 đến 4; tín chỉ cũ từ 0 đến 10.000; tín chỉ mới lớn hơn 0 và không quá 10.000.";
        return;
    }
    var gpa = (gpaCu * tcCu + gpaMoi * tcMoi) / (tcCu + tcMoi);
    var tcCuHienThi = String(tcCu).replace(".", ",");
    var tcMoiHienThi = String(tcMoi).replace(".", ",");
    var tongTcHienThi = String(tcCu + tcMoi).replace(".", ",");
    if (ketQua) {
        ketQua.innerText = "GPA tích lũy mới: " + hienSo(gpa) + ". Phép tính: (" +
            hienSo(gpaCu) + " × " + tcCuHienThi + " + " + hienSo(gpaMoi) + " × " + tcMoiHienThi + ") / " + tongTcHienThi + ".";
    }

    if (tcCu > 0) {
        if (dangDungMocMau || danhSachMocTichLuy.length < 2) {
            danhSachMocTichLuy = [
                { ten: "Kỳ hiện tại", gpa: gpaCu, kieuNhap: "so" },
                { ten: "Kỳ mới", gpa: gpa, kieuNhap: "so" }
            ];
        } else {
            danhSachMocTichLuy[danhSachMocTichLuy.length - 2] = { ten: "Kỳ hiện tại", gpa: gpaCu, kieuNhap: "so" };
            danhSachMocTichLuy[danhSachMocTichLuy.length - 1] = { ten: "Kỳ mới", gpa: gpa, kieuNhap: "so" };
        }
    } else {
        danhSachMocTichLuy = [{ ten: "Kỳ mới", gpa: gpa, kieuNhap: "so" }];
    }
    dangDungMocMau = false;
    veBieuDoTichLuy(danhSachMocTichLuy, gpa);
    if (lay("thong-bao-bieu-do")) {
        lay("thong-bao-bieu-do").innerText = "Biểu đồ đã cập nhật theo kết quả GPA tích lũy mới (" +
            hienSo(doiDiemTheoThangBieuDo(gpa)) + ").";
    }
}

function chonLoaiTotNghiepMucTieu() {
    var oLoai = lay("loai-tot-nghiep-muc-tieu");
    var oGpaMucTieu = lay("gpa-muc-tieu");
    if (!oLoai || !oGpaMucTieu) return;
    if (oLoai.value !== "") {
        var soMucTieu = Number(oLoai.value);
        oGpaMucTieu.value = hienSo(soMucTieu);
    }
    luuMucTieuVaoBoNho();
}

function luuMucTieuVaoBoNho() {
    try {
        var duLieu = {
            loai: lay("loai-tot-nghiep-muc-tieu") ? lay("loai-tot-nghiep-muc-tieu").value : "",
            gpaHienTai: lay("gpa-hien-tai") ? lay("gpa-hien-tai").value : "",
            gpaMucTieu: lay("gpa-muc-tieu") ? lay("gpa-muc-tieu").value : "",
            tongTcToanKhoa: lay("tong-tc-toan-khoa") ? lay("tong-tc-toan-khoa").value : "",
            tinChiHienTai: lay("tin-chi-hien-tai") ? lay("tin-chi-hien-tai").value : "",
            tinChiConLai: lay("tin-chi-con-lai") ? lay("tin-chi-con-lai").value : ""
        };
        ghiLuuTru(layKhoaLuuMucTieu(), JSON.stringify(duLieu));
    } catch (loi) { }
}

function taiMucTieuTuBoNho() {
    try {
        var chuoi = docLuuTru(layKhoaLuuMucTieu());
        if (!chuoi) return;
        var duLieu = JSON.parse(chuoi);
        if (!duLieu || typeof duLieu !== "object") return;
        if (lay("loai-tot-nghiep-muc-tieu") && typeof duLieu.loai === "string") {
            lay("loai-tot-nghiep-muc-tieu").value = duLieu.loai;
        }
        if (lay("gpa-hien-tai") && typeof duLieu.gpaHienTai === "string") {
            lay("gpa-hien-tai").value = duLieu.gpaHienTai;
        }
        if (lay("gpa-muc-tieu") && typeof duLieu.gpaMucTieu === "string") {
            lay("gpa-muc-tieu").value = duLieu.gpaMucTieu;
        }
        if (lay("tong-tc-toan-khoa") && typeof duLieu.tongTcToanKhoa === "string") {
            lay("tong-tc-toan-khoa").value = duLieu.tongTcToanKhoa;
        }
        if (lay("tin-chi-hien-tai") && typeof duLieu.tinChiHienTai === "string") {
            lay("tin-chi-hien-tai").value = duLieu.tinChiHienTai;
        }
        if (lay("tin-chi-con-lai") && typeof duLieu.tinChiConLai === "string") {
            lay("tin-chi-con-lai").value = duLieu.tinChiConLai;
        }
    } catch (loi) { }
}

function dongBoLoaiTotNghiepTuGpa() {
    var oLoai = lay("loai-tot-nghiep-muc-tieu");
    var oGpaMucTieu = lay("gpa-muc-tieu");
    if (!oLoai || !oGpaMucTieu) return;
    var diem = docSo(oGpaMucTieu.value);
    if (isNaN(diem)) {
        oLoai.value = "";
        return;
    }
    var cacMuc = ["3.60", "3.20", "2.50", "2.00", "1.00", "0.00"];
    var khop = "";
    for (var i = 0; i < cacMuc.length; i++) {
        if (Math.abs(diem - Number(cacMuc[i])) < 0.001) {
            khop = cacMuc[i];
            break;
        }
    }
    oLoai.value = khop;
}

function capNhatTinChiTuToanKhoa() {
    var oToanKhoa = lay("tong-tc-toan-khoa");
    var oHienTai = lay("tin-chi-hien-tai");
    var oConLai = lay("tin-chi-con-lai");
    if (!oToanKhoa || !oHienTai || !oConLai) return;

    var chuoiToanKhoa = oToanKhoa.value.trim();
    if (chuoiToanKhoa === "") return;

    var tcToanKhoa = docSo(chuoiToanKhoa);
    var tcHienTai = oHienTai.value.trim() === "" ? 0 : docSo(oHienTai.value);
    if (!isNaN(tcToanKhoa) && !isNaN(tcHienTai) && tcToanKhoa >= tcHienTai) {
        var conLai = Math.round((tcToanKhoa - tcHienTai) * 100) / 100;
        oConLai.value = String(conLai).replace(".", ",");
    }
}

function capNhatToanKhoaTuTinChiConLai() {
    var oToanKhoa = lay("tong-tc-toan-khoa");
    var oHienTai = lay("tin-chi-hien-tai");
    var oConLai = lay("tin-chi-con-lai");
    if (!oToanKhoa || !oHienTai || !oConLai) return;

    var chuoiConLai = oConLai.value.trim();
    if (chuoiConLai === "") return;

    var tcConLai = docSo(chuoiConLai);
    var tcHienTai = oHienTai.value.trim() === "" ? 0 : docSo(oHienTai.value);
    if (!isNaN(tcConLai) && !isNaN(tcHienTai) && tcConLai >= 0 && tcHienTai >= 0) {
        var tongTc = Math.round((tcHienTai + tcConLai) * 100) / 100;
        oToanKhoa.value = String(tongTc).replace(".", ",");
    }
}

function dongBoTichLuySangMucTieu(ketQuaTb) {
    if (!ketQuaTb && Array.isArray(danhSachMocTichLuy) && danhSachMocTichLuy.length > 0) {
        var mocHienThi = layMocHienThiTheoThang(danhSachMocTichLuy);
        ketQuaTb = tinhTrungBinhMocBieuDo(mocHienThi);
    }
    var oGpaHienTai = lay("gpa-hien-tai");
    var oTcHienTai = lay("tin-chi-hien-tai");

    if (oGpaHienTai) {
        if (ketQuaTb && ketQuaTb.soHocKy > 0) {
            oGpaHienTai.value = hienSo(ketQuaTb.gpaXepLoaiHe4);
        } else if (danhSachMocTichLuy.length === 0) {
            oGpaHienTai.value = "";
        }
    }

    if (oTcHienTai) {
        var tongTinChiTichLuy = 0;
        var coTc = false;
        var tatCaKy = docTatCaHocKyDaLuu();
        for (var i = 0; i < danhSachMocTichLuy.length; i++) {
            var item = danhSachMocTichLuy[i];
            var tc = item.tongTinChi || 0;
            if (tc <= 0 && tatCaKy[item.ten] && Array.isArray(tatCaKy[item.ten].mon)) {
                var kq = tinhGpaHopLeTuDanhSachMon(tatCaKy[item.ten].mon, tatCaKy[item.ten].he);
                if (kq && kq.tongTinChi > 0) {
                    tc = kq.tongTinChi;
                    item.tongTinChi = tc;
                }
            }
            if (tc > 0) {
                tongTinChiTichLuy += tc;
                coTc = true;
            }
        }

        if (coTc) {
            oTcHienTai.value = String(tongTinChiTichLuy).replace(".", ",");
            capNhatTinChiTuToanKhoa();
        } else if (danhSachMocTichLuy.length === 0) {
            oTcHienTai.value = "";
            capNhatTinChiTuToanKhoa();
        }
    }

    luuMucTieuVaoBoNho();
}

function goiYToHopDiemChu(diemCanDat) {
    if (diemCanDat > 4) return [];
    if (diemCanDat >= 3.995) {
        return ["100% điểm A / A+"];
    }
    if (diemCanDat <= 1.0) {
        return ["100% điểm D trở lên"];
    }
    var bacDiem = [
        { ten: "A", diem: 4.0 },
        { ten: "B+", diem: 3.5 },
        { ten: "B", diem: 3.0 },
        { ten: "C+", diem: 2.5 },
        { ten: "C", diem: 2.0 },
        { ten: "D+", diem: 1.5 },
        { ten: "D", diem: 1.0 }
    ];
    for (var i = 0; i < bacDiem.length - 1; i++) {
        var cao = bacDiem[i];
        var thap = bacDiem[i + 1];
        if (diemCanDat <= cao.diem && diemCanDat >= thap.diem) {
            var tyLeCao = Math.round(((diemCanDat - thap.diem) / (cao.diem - thap.diem)) * 100);
            tyLeCao = Math.ceil(tyLeCao / 5) * 5;
            if (tyLeCao > 100) tyLeCao = 100;
            if (tyLeCao < 0) tyLeCao = 0;
            var tyLeThap = 100 - tyLeCao;
            if (tyLeCao === 100) {
                return ["100% điểm " + cao.ten];
            }
            if (tyLeThap === 100) {
                return ["100% điểm " + thap.ten];
            }
            return [tyLeCao + "% điểm " + cao.ten, tyLeThap + "% điểm " + thap.ten];
        }
    }
    return ["100% điểm D"];
}

function tinhMucTieu() {
    var chuoiGpaHienTai = lay("gpa-hien-tai").value.trim();
    var chuoiTcHienTai = lay("tin-chi-hien-tai").value.trim();
    var tc = chuoiTcHienTai === "" ? 0 : docSo(chuoiTcHienTai);
    var gpa = (tc === 0 && chuoiGpaHienTai === "") ? 0 : docSo(chuoiGpaHienTai);
    var mucTieu = docSo(lay("gpa-muc-tieu").value);

    var chuoiConLai = lay("tin-chi-con-lai").value.trim();
    var chuoiToanKhoa = lay("tong-tc-toan-khoa") ? lay("tong-tc-toan-khoa").value.trim() : "";
    var conLai = NaN;

    if (chuoiConLai !== "") {
        conLai = docSo(chuoiConLai);
    } else if (chuoiToanKhoa !== "") {
        var tcToanKhoa = docSo(chuoiToanKhoa);
        if (!isNaN(tcToanKhoa) && !isNaN(tc) && tcToanKhoa >= tc) {
            conLai = Math.round((tcToanKhoa - tc) * 100) / 100;
            lay("tin-chi-con-lai").value = String(conLai).replace(".", ",");
        }
    }

    if (chuoiToanKhoa === "" && !isNaN(tc) && !isNaN(conLai) && lay("tong-tc-toan-khoa")) {
        lay("tong-tc-toan-khoa").value = String(Math.round((tc + conLai) * 100) / 100).replace(".", ",");
    }

    var ketQua = lay("ket-qua-muc-tieu");
    if (!hopLe(gpa, 0, 4) || !hopLe(mucTieu, 0, 4) ||
        !hopLe(tc, 0, 10000) || !hopLe(conLai, 0, 10000)) {
        ketQua.innerText = "Hãy nhập đủ GPA từ 0 đến 4 và số tín chỉ hợp lệ từ 0 đến 10.000.";
        return;
    }
    if (tc + conLai === 0) {
        ketQua.innerText = "Chưa có tín chỉ để dự đoán mục tiêu tốt nghiệp.";
        return;
    }

    var loaiMucTieu = xepLoai(mucTieu);
    var nhanBangMucTieu = mucTieu >= 2.0 ? "bằng " + loaiMucTieu : "xếp loại " + loaiMucTieu;
    var tcHienThi = String(tc).replace(".", ",");
    var conLaiHienThi = String(conLai).replace(".", ",");

    if (conLai === 0) {
        ketQua.innerText = gpa >= mucTieu
            ? "Không còn tín chỉ mới. GPA hiện tại (" + hienSo(gpa) + ") đã đạt mục tiêu " + nhanBangMucTieu + " (GPA ≥ " + hienSo(mucTieu) + ")."
            : "Không còn tín chỉ mới. GPA hiện tại (" + hienSo(gpa) + ") chưa đạt mục tiêu " + nhanBangMucTieu + " (GPA ≥ " + hienSo(mucTieu) + ").";
        return;
    }

    var canDat = (mucTieu * (tc + conLai) - gpa * tc) / conLai;
    var toiDa = (gpa * tc + 4 * conLai) / (tc + conLai);
    var canDatHienThi = canDat < 0 ? 0 : canDat;
    var xepLoaiConLai = xepLoai(canDatHienThi);
    var dsGoiYDiem = goiYToHopDiemChu(canDatHienThi);

    ketQua.innerHTML = "";

    var dongMoDau = document.createElement("p");
    dongMoDau.className = "dong-mo-dau-du-doan";
    dongMoDau.innerHTML = "Để tốt nghiệp <strong>" + nhanBangMucTieu + "</strong> (GPA ≥ " + hienSo(mucTieu) + "), với <strong>" + conLaiHienThi + " tín chỉ</strong> còn lại bạn phải đạt GPA trung bình:";
    ketQua.appendChild(dongMoDau);

    var soLon = document.createElement("div");
    soLon.className = "so-gpa-du-doan" + (canDat > 4 ? " vuot-nguong" : "");
    soLon.innerText = hienSo(canDatHienThi);
    ketQua.appendChild(soLon);

    var dongTuongDuong = document.createElement("p");
    dongTuongDuong.className = "mo-ta-xep-loai-du-doan";
    if (canDat > 4) {
        dongTuongDuong.innerHTML = "Vượt mức tối đa <strong>4,00</strong>. Mục tiêu không khả thi nếu chỉ cộng thêm tín chỉ mới (GPA tối đa có thể đạt: <strong>" + hienSo(toiDa) + "</strong>).";
    } else if (canDat <= 0) {
        dongTuongDuong.innerHTML = "GPA tích lũy hiện tại đã đủ đảm bảo mục tiêu nếu hoàn thành số tín chỉ còn lại (GPA tối đa có thể đạt: <strong>" + hienSo(toiDa) + "</strong>).";
    } else {
        dongTuongDuong.innerHTML = "Tương đương xếp loại <strong>" + xepLoaiConLai + "</strong> cho phần còn lại.";
    }
    ketQua.appendChild(dongTuongDuong);

    if (canDat > 0 && canDat <= 4 && dsGoiYDiem.length > 0) {
        var nhanToHop = document.createElement("p");
        nhanToHop.className = "tieu-de-to-hop-diem";
        nhanToHop.innerText = "Tương đương ít nhất:";
        ketQua.appendChild(nhanToHop);

        var khungHuyHieu = document.createElement("div");
        khungHuyHieu.className = "danh-sach-huy-hieu-diem";
        for (var i = 0; i < dsGoiYDiem.length; i++) {
            var huyHieu = document.createElement("span");
            huyHieu.className = "huy-hieu-diem-du-doan";
            huyHieu.innerText = dsGoiYDiem[i];
            khungHuyHieu.appendChild(huyHieu);
        }
        ketQua.appendChild(khungHuyHieu);
    }

    var dongChan = document.createElement("p");
    dongChan.className = "chan-ket-qua-du-doan";
    dongChan.innerHTML = "Đang tính trên GPA tích lũy <strong>" + hienSo(gpa) + "</strong> của " + tcHienThi + " TC đã có điểm.";
    ketQua.appendChild(dongChan);
}

function luuDuLieu() {
    var danhSach = [];
    var dong = lay("danh-sach-mon").getElementsByTagName("tr");
    for (var i = 0; i < dong.length; i++) {
        var oTinh = dong[i].querySelector(".tinh");
        var oTen = dong[i].querySelector(".ten");
        var oTc = dong[i].querySelector(".tin-chi");
        var oDiem = dong[i].querySelector(".diem");
        var oDiem10 = dong[i].querySelector(".diem-10");
        if (!oTinh) continue;
        danhSach.push({
            tinh: oTinh.checked,
            ten: oTen ? oTen.value : "",
            tinChi: oTc ? oTc.value : "",
            diem: oDiem ? oDiem.value : "",
            diem10: oDiem10 ? oDiem10.value : ""
        });
    }
    var tenKy = lay("ten-ky").value;
    var he = lay("he-diem").value;
    var duLieu = { tenKy: tenKy, he: he, mon: danhSach };
    var tatCaKy = docTatCaHocKyDaLuu();
    tatCaKy[tenKy] = duLieu;
    var khoaHienTai = layKhoaLuu();
    var nguoiDung = docNguoiDungDangNhap();
    try {
        ghiLuuTru(khoaHienTai, JSON.stringify(duLieu));
        ghiLuuTru(layKhoaLuuDanhSachKy(), JSON.stringify(tatCaKy));
        var ketQuaKy = tinhGpaHopLeTuDanhSachMon(danhSach, he);
        dongBoHocKySangTichLuy(tenKy, ketQuaKy);
        if (nguoiDung && nguoiDung.email) {
            lay("trang-thai-luu").innerText = "Đã lưu học kỳ \"" + duLieu.tenKy + "\" và đồng bộ sang mục GPA tích lũy (" + nguoiDung.email + ").";
        } else {
            lay("trang-thai-luu").innerText = "Đã lưu học kỳ \"" + duLieu.tenKy + "\" và đồng bộ sang mục GPA tích lũy.";
        }
    } catch (loi) {
        lay("trang-thai-luu").innerText = "Không lưu được. Trình duyệt có thể đang chặn lưu trữ hoặc đã hết dung lượng.";
    }
}

function taiDuLieu() {
    var khoaHienTai = layKhoaLuu();
    var nguoiDung = docNguoiDungDangNhap();
    try {
        var tenKyDangChon = lay("ten-ky") ? lay("ten-ky").value : "";
        var tatCaKy = docTatCaHocKyDaLuu();
        var duLieu = (tenKyDangChon && tatCaKy[tenKyDangChon]) ? tatCaKy[tenKyDangChon] : null;
        if (!duLieu) {
            var banLuu = docLuuTru(khoaHienTai);
            if (!banLuu) {
                lay("trang-thai-luu").innerText = nguoiDung
                    ? "Tài khoản " + nguoiDung.email + " chưa có học kỳ nào được lưu."
                    : "Chưa có học kỳ được lưu.";
                return;
            }
            duLieu = JSON.parse(banLuu);
        }
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
        if (THU_TU_HOC_KY.indexOf(duLieu.tenKy) !== -1) {
            lay("ten-ky").value = duLieu.tenKy;
        }
        lay("he-diem").value = duLieu.he;
        heDiemCu = duLieu.he;
        for (var j = 0; j < duLieu.mon.length; j++) themMon(duLieu.mon[j], true);
        var kqMo = tinhGpaHopLeTuDanhSachMon(duLieu.mon, duLieu.he);
        if (kqMo && kqMo.soMon > 0) {
            hienThiKetQuaHocKy(kqMo, duLieu.he);
        } else {
            xoaKetQua();
        }
        capNhatHuyHieuDanhSachHocKy();
        lay("trang-thai-luu").innerText = "Đã mở học kỳ \"" + duLieu.tenKy + "\". Bấm tính để kiểm tra kết quả.";
    } catch (loi) {
        lay("trang-thai-luu").innerText = "Không đọc được dữ liệu. Bản đã lưu được giữ nguyên.";
    }
}

function xoaDuLieu() {
    var khoaHienTai = layKhoaLuu();
    if (!confirm("Xóa bản học kỳ đã lưu trên thiết bị này?")) return;
    try {
        var tenKy = lay("ten-ky") ? lay("ten-ky").value : "";
        var tatCaKy = docTatCaHocKyDaLuu();
        if (tenKy && tatCaKy[tenKy]) {
            delete tatCaKy[tenKy];
            ghiLuuTru(layKhoaLuuDanhSachKy(), JSON.stringify(tatCaKy));
            dongBoHocKySangTichLuy(tenKy, null);
            capNhatHuyHieuDanhSachHocKy();
        }
        xoaLuuTru(khoaHienTai);
        lay("trang-thai-luu").innerText = "Đã xóa bản lưu của \"" + tenKy + "\". Danh sách đang nhập vẫn được giữ lại.";
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
            } catch (loi) { }
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
    if (maTrang === "tich-luy") maTrang = "tinh-gpa";
    if (!lay(maTrang)) return;
    var trang = document.getElementsByClassName("trang");
    for (var i = 0; i < trang.length; i++) trang[i].style.display = "none";
    lay(maTrang).style.display = "block";
    if (maTrang === "trang-chu") lay("tinh-gpa").style.display = "block";
    lay("dau-trang-tinh").style.display = maTrang === "trang-chu" ? "none" : "flex";
    var bieuDo = lay("khung-bieu-do-tich-luy");
    if (bieuDo) {
        bieuDo.style.display = maTrang === "trang-chu" ? "none" : "block";
    }
    lay("tieu-de-bang").innerText = maTrang === "trang-chu" ? "Tính nhanh GPA của bạn" : "Danh sách môn học";
    var menu = lay("menu").getElementsByTagName("a");
    for (var j = 0; j < menu.length; j++) {
        menu[j].className = "";
        menu[j].removeAttribute("aria-current");
    }
    if (lay("menu-" + maTrang)) {
        lay("menu-" + maTrang).className = "dang-chon";
        lay("menu-" + maTrang).setAttribute("aria-current", "page");
    }
    var tenTrang = {
        "trang-chu": "Trang chủ",
        "tinh-gpa": "Tính GPA kỳ",
        "muc-tieu": "Mục tiêu GPA",
        "thang-diem": "Quy chế & Thang điểm",
        "huong-dan": "Hướng dẫn",
        "gop-y": "Liên hệ / Góp ý"
    };
    if (tenTrang[maTrang]) {
        lay("ten-trang").innerText = tenTrang[maTrang];
        document.title = tenTrang[maTrang] + " — GPA Uni";
    }
    dongMenuDiDong();
    if (maTrang === "tinh-gpa" || maTrang === "trang-chu") {
        veBieuDoTichLuy(danhSachMocTichLuy);
    } else if (maTrang === "muc-tieu") {
        dongBoTichLuySangMucTieu();
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
    if (lay("luu-du-lieu")) {
        lay("luu-du-lieu").scrollIntoView();
        var nut = lay("luu-du-lieu").getElementsByTagName("button");
        if (nut.length > 0) nut[0].focus();
    }
}

function tuDongTaiHocKyCuaTaiKhoan() {
    if (!lay("danh-sach-mon")) return;
    taiBieuDoTichLuyTuBoNho();
    taiMucTieuTuBoNho();
    try {
        var tatCaKy = docTatCaHocKyDaLuu();
        for (var k = 0; k < THU_TU_HOC_KY.length; k++) {
            var tenKy = THU_TU_HOC_KY[k];
            if (danhSachKyDaXoaKhoiBieuDo.indexOf(tenKy) !== -1) {
                continue;
            }
            if (tatCaKy[tenKy] && Array.isArray(tatCaKy[tenKy].mon)) {
                var ketQuaKy = tinhGpaHopLeTuDanhSachMon(tatCaKy[tenKy].mon, tatCaKy[tenKy].he);
                if (ketQuaKy) {
                    dongBoHocKySangTichLuy(tenKy, ketQuaKy);
                }
            }
        }

        var khoaHienTai = layKhoaLuu();
        var banLuu = docLuuTru(khoaHienTai);
        if (!banLuu) return;

        var duLieu = JSON.parse(banLuu);
        if (!duLieu || typeof duLieu.tenKy !== "string" ||
            (duLieu.he !== "4" && duLieu.he !== "10" && duLieu.he !== "chu") ||
            !Array.isArray(duLieu.mon) || duLieu.mon.length === 0) return;

        lay("danh-sach-mon").innerHTML = "";
        if (THU_TU_HOC_KY.indexOf(duLieu.tenKy) !== -1) {
            lay("ten-ky").value = duLieu.tenKy;
        }
        var heKhoiPhuc = duLieu.he === "10" ? "10" : "4";
        lay("he-diem").value = heKhoiPhuc;
        heDiemCu = heKhoiPhuc;
        for (var j = 0; j < duLieu.mon.length; j++) {
            themMon(duLieu.mon[j], true);
        }
        capNhatSoThuTuVaHeChuBangMon();
        var ketQuaKhoiPhuc = tinhGpaHopLeTuDanhSachMon(duLieu.mon, heKhoiPhuc);
        if (ketQuaKhoiPhuc && ketQuaKhoiPhuc.soMon > 0) {
            hienThiKetQuaHocKy(ketQuaKhoiPhuc, heKhoiPhuc);
        } else {
            xoaKetQua();
        }
        if (lay("trang-thai-luu")) {
            lay("trang-thai-luu").innerText = "Đã khôi phục học kỳ \"" + lay("ten-ky").value + "\" đã lưu của bạn.";
        }
        dongBoTichLuySangMucTieu();
        capNhatHuyHieuDanhSachHocKy();
    } catch (loi) { }
}

document.addEventListener("keydown", function (suKien) {
    if (suKien.key === "Escape") {
        dongMenuDiDong();
        boChonMocBieuDo();
        dongCustomSelectHocKy();
    }
});

document.addEventListener("click", function (suKien) {
    var mucTieu = suKien.target;
    if (mucTieu && typeof mucTieu.closest === "function") {
        if (!mucTieu.closest("#khung-tuy-bien-ky")) {
            dongCustomSelectHocKy();
        }
        if (tenMocDangChon) {
            if (!mucTieu.closest("#hop-xoa-moc-bieu-do") && !mucTieu.closest(".nhom-nut-moc-gpa")) {
                boChonMocBieuDo();
            }
        }
    } else {
        dongCustomSelectHocKy();
        if (tenMocDangChon) boChonMocBieuDo();
    }
});

window.addEventListener("resize", function () {
    if (window.innerWidth > 760) {
        dongMenuDiDong();
    }
    if (lay("khung-bieu-do-tich-luy") && lay("khung-bieu-do-tich-luy").style.display !== "none") {
        veBieuDoTichLuy(danhSachMocTichLuy);
    }
});

if (lay("danh-sach-mon")) {
    themMon(null, true);
    themMon(null, true);
    tuDongTaiHocKyCuaTaiKhoan();
    khoiTaoCustomSelectHocKy();
    veBieuDoTichLuy(danhSachMocTichLuy);
    var hashBanDau = window.location.hash ? window.location.hash.substring(1) : "";
    if (hashBanDau && (lay(hashBanDau) || hashBanDau === "tinh-gpa")) {
        moTrang(hashBanDau);
    } else {
        moTrang("trang-chu");
    }
}

window.addEventListener("hashchange", function () {
    var h = window.location.hash ? window.location.hash.substring(1) : "";
    if (h && (lay(h) || h === "tinh-gpa")) {
        moTrang(h);
    }
});