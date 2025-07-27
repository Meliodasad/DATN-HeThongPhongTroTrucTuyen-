export interface Post {
    id: string;
    title: string;
    price: string;
    area: string;
    address: string;
    fullAddress: string;
    district: string;
    province: string;
    postedDate: string;
    expiredDate: string;
    images: string[];
    description: string;
    authorId: string;
}

export interface User {
    id: string;
    name: string;
    phone: string;
    zalo: string;
    joinedDate: string;
    avatar: string;
    status: string;
}

export interface Bookings {
    id: string;
    roomId: string;
    tenantId: string;
    bookingDate: string;
    note: string;
    status: 'pending' | 'accepted' | 'rejected';
}

export interface Contracts {
    id: string;
    tenantId: string;
    postId: string;
    startDate: string;
    endDate: string;
    status: 'pending' | 'accepted' | 'rejected' | 'ended';
}

const db: { posts: Post[]; users: User[]; bookings: Bookings[], contracts: Contracts[] } = {
    posts: [
        {
            id: '1',
            title: 'Cho thuê phòng trọ mới sơn sửa 05/2025 - Lương Thế Vinh, P. Tân Thới Hòa, Quận Tân Phú',
            price: '4.9 triệu/tháng',
            area: '35 m²',
            address: 'Tân Phú, Hồ Chí Minh',
            fullAddress: '48/13 Đường Lương Thế Vinh, Quận Tân Phú, Hồ Chí Minh',
            district: 'Tân Phú',
            province: 'Hồ Chí Minh',
            postedDate: 'Thứ 6, 18:07 10/07/2025',
            expiredDate: 'Thứ 7, 18:07 09/08/2025',
            images: [
                'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2025/07/12/img-1752220603373-1752302969144_1752303909.jpg',
                'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2025/07/12/img-1752220603390-1752302990742_1752303916.jpg',
                'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2025/07/12/img-1752220635031-1752303054480_1752303945.jpg',
            ],
            description:
                `Phòng trọ mới sơn sửa, cực kỳ sạch sẽ và thoáng mát, phù hợp cho sinh viên, người đi làm hoặc cặp vợ chồng trẻ. 
    Phòng nằm ở hẻm xe hơi, an ninh yên tĩnh, gần chợ, siêu thị, các tuyến xe buýt, chỉ mất vài phút để di chuyển đến công viên Đầm Sen, Big C Tân Phú, Aeon Mall. 
    Diện tích 35m², có cửa sổ lớn đón ánh sáng tự nhiên. Nhà vệ sinh riêng, đồng hồ điện nước riêng biệt. Giờ giấc tự do, không chung chủ. 
    Giá thuê: chỉ 4.900.000đ/tháng. Ưu đãi khi cọc trong tuần này.Miễn phí: wifi, truyền hình cáp, Internet, không tính phí quản lý
    Không chung chủ, đảm bảo riêng tư & thoải mái
    15 camera an ninh, không góc chết, có người trông xe tận tâm
    Lối đi 1m2, sân phơi thoáng mát, bãi giữ xe chứa 40 xe máy
    Phòng cháy chữa cháy lắp đặt từng phòng, cầu thang & sân
    Nhà trong hẻm xe hơi – lộ giới 5m, khu dân cư an toàn
    Gần chợ, shop tiện lợi 24h, trường ĐH CN Thực Phẩm, trường Ánh Việt, công ty – xí nghiệp
    Thuận tiện di chuyển qua Q.11, Q.6, Đầm Sen
    Đặc biệt: Không thu thêm phí quản lý, không phát sinh lặt vặt. Giá điện nước rõ ràng:
    Điện: 4.000đ/kWh
    Nước: 100.000đ/người
    Xe: 100.000đ/chiếc
    Liên hệ: 0938 864 405 để gặp Cường Phạm (phone/zalo), Để biết thêm thông tin chi tiết và xem nhà trong ngày. Thiện chí đón tiếp khách thuê 24/7.
        Xem phòng trực tiếp – chốt phòng nhanh – hỗ trợ nhiệt tình 24/7`,
            authorId: 'user1'
        },
        {
            id: '2',
            title: 'Phòng trọ ngay Thành Thái, trung tâm Quận 10, đẹp, trang bị đầy đủ nội thất',
            price: '4.5 triệu/tháng',
            area: '25 m²',
            address: 'Quận 10, Hồ Chí Minh',
            fullAddress: '23A Thành Thái, Quận 10, Hồ Chí Minh',
            district: 'Quận 10',
            province: 'Hồ Chí Minh',
            postedDate: 'Thứ 5, 10:45 09/07/2025',
            expiredDate: 'Thứ 6, 10:45 09/08/2025',
            images: [
                'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/01/27/z4064025740041-0c32a1d0197c20b63c64a57df8c64959_1674785592.jpg',
                'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/01/27/z4064025765105-04e4c8e3b0c79ad50f7c6b1939162823_1674785595.jpg',
                'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/01/27/z4064025759263-7ca73cc7c52cfc53a6b4a9960f37d3f8_1674785596.jpg',
            ],
            description:
                `Cho thuê phòng trọ ngay trung tâm Quận 10, gần ngay Vạn Hạnh Mall, trường đại học Bách Khoa, Huflit (5 phút đi bộ là tới), trường Đại học Y Dược Phạm Ngọc Thạch (bước qua đường là tới) Đại học Hoa Sen, trường Quốc Tế Việt Úc, bệnh viện 115, Nhi Đồng...các nhà thuốc lớn ở HCM... full nội thất đầy đủ tiện nghi, giờ giấc tự do, phòng ốc sạch sẽ và an ninh. Thích hợp cho thuê công tác dài và ngắn hạn, việt Kiều, SV...
        Giá phòng: 4.5 triệu - 7 triệu/tháng.
        Phòng rộng: từ 25m2 - 35m2.
        Phòng đẹp như ảnh, cho thuê tại các địa chỉ sau:
        - Địa chỉ 1: 7A/19/19 Thành Thái, P.14, Q.10.
        - Địa chỉ 2: 128 Thành Thái, P.12, Q.10
        - Địa chỉ 3: 43/3 Thành Thái, P14, Q.10.
        Liên hệ thuê phòng: 0938297275 Anh Việt`,
            authorId: 'user2'
        },
        {
            id: '3',
            title: 'Phòng trọ mới xây, nội thất cơ bản, gần Aeon Mall Tân Phú',
            price: '3 triệu/tháng',
            area: '22 m²',
            address: 'Tân Phú, Hồ Chí Minh',
            fullAddress: '35/8 Tân Kỳ Tân Quý, Quận Tân Phú, Hồ Chí Minh',
            district: 'Tân Phú',
            province: 'Hồ Chí Minh',
            postedDate: 'Thứ 4, 11:30 08/07/2025',
            expiredDate: 'Thứ 4, 11:30 08/08/2025',
            images: [
                'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2020/08/07/acf799e4-fc67-47ff-a25d-311a214acebe_1596818135.jpg',
                'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2020/08/07/2fe60a0d-b6d5-4d17-800c-09394f1f97f5_1596818137.jpg',
                'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2020/08/07/1a1c7b84-c260-4b24-9dd0-32032b7453fc_1596818158.jpg',
            ],
            description: `Phòng trọ mới xây cực kỳ sạch sẽ, thiết kế hiện đại với nội thất cơ bản như giường, kệ bếp, máy lạnh. Không gian thoáng mát, có cửa sổ lớn lấy ánh sáng tự nhiên. 
    Nhà vệ sinh riêng, khu nấu ăn riêng, chỗ để xe rộng rãi, camera an ninh 24/24, cửa cổng vân tay an toàn tuyệt đối. 
    Gần Aeon Mall, chợ Sơn Kỳ, siêu thị, thuận tiện di chuyển sang các quận trung tâm như Tân Bình, Gò Vấp.
    Điện 3.500đ/kWh, nước 100.000đ/người. Ưu tiên sinh viên, người đi làm. Có thể chuyển vào ở ngay.`,
            authorId: 'user3'
        },
        {
            id: '4',
            title: 'Phòng trọ mini full nội thất, giờ giấc tự do, gần ĐH Hutech',
            price: '4 triệu/tháng',
            area: '20 m²',
            address: 'Bình Thạnh, Hồ Chí Minh',
            fullAddress: '25/3 Ung Văn Khiêm, Quận Bình Thạnh, Hồ Chí Minh',
            district: 'Bình Thạnh',
            province: 'Hồ Chí Minh',
            postedDate: 'Thứ 3, 09:00 08/07/2025',
            expiredDate: 'Thứ 4, 09:00 08/08/2025',
            images: [
                'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2021/03/10/z2372642429419-09c9c7a541863ae55ad41b3e267136f4_1615391265.jpg',
                'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2021/03/10/z2372642437841-822f1ef2ee0e57e9073bb921a39a822e_1615391264.jpg',
                'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2021/03/10/z2372642433596-7e519ebc494eafa72380f69ed2be6f5c_1615391263.jpg',
            ],
            description: `Phòng mini cao cấp cho thuê gần đại học Hutech. Diện tích 20m², phòng đã trang bị giường, nệm, tủ lạnh, máy lạnh, bàn học, máy nước nóng. 
    Giờ giấc tự do, ra vào bằng khóa vân tay. Không chung chủ, khu vực yên tĩnh, an ninh tuyệt đối.
    Gần nhiều tiện ích như trường học, chợ, Vinmart, quán ăn, trạm xe buýt. Phù hợp với sinh viên, người đi làm. 
    Internet tốc độ cao, miễn phí truyền hình cáp. Điện nước tính riêng theo giá nhà nước. Hỗ trợ dọn vào nhanh chóng.`,
            authorId: 'user4'
        },
        {
            id: '5',
            title: 'Phòng trọ giá rẻ dành cho sinh viên, gần ĐH Công Nghiệp',
            price: '1.7 triệu/tháng',
            area: '14 m²',
            address: 'Gò Vấp, Hồ Chí Minh',
            fullAddress: '234 Nguyễn Văn Khối, Gò Vấp, Hồ Chí Minh',
            district: 'Gò Vấp',
            province: 'Hồ Chí Minh',
            postedDate: 'Thứ 4, 16:00 09/07/2025',
            expiredDate: 'Thứ 5, 16:00 09/08/2025',
            images: [
                'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2021/03/10/z2372635816674-545794dbbc111cba4b6b0b4ed0d7d184_1615391076.jpg',
                'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2021/03/10/z2372635826038-769d9bd0dd2792181969064d8f6a345d_1615391069.jpg',
                'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2021/03/10/z2372635826037-cb2941c7a54c4dcf36e7847007f6ab34_1615391060.jpg',
            ],
            description: `Phòng trọ nhỏ gọn, sạch sẽ, đầy đủ ánh sáng. Nhà vệ sinh riêng, bếp chung. Gần nhiều tiện ích như siêu thị, tiệm tạp hóa.
    Phù hợp sinh viên, người đi làm thu nhập trung bình.
    Giá cả hợp lý, hợp đồng lâu dài ổn định.`,
            authorId: 'user5'
        },
        {
            id: '6',
            title: 'Phòng trọ ban công, máy lạnh, gần Công viên Gia Định',
            price: '3.2 triệu/tháng',
            area: '22 m²',
            address: 'Phú Nhuận, Hồ Chí Minh',
            fullAddress: '89/7 Phan Đình Phùng, Phú Nhuận, Hồ Chí Minh',
            district: 'Phú Nhuận',
            province: 'Hồ Chí Minh',
            postedDate: 'Thứ 5, 08:30 10/07/2025',
            expiredDate: 'Thứ 6, 08:30 10/08/2025',
            images: [
                'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2024/07/26/z5663646861408-0b6364646a2473b5624578f1c6c5f187_1721959591.jpg',
                'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2024/03/29/1_1711684797.jpg',
                'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2024/03/29/2_1711684797.jpg',
            ],
            description: `Phòng có ban công rộng, thoáng mát, có sẵn máy lạnh, toilet riêng. Khu dân cư văn minh, nhiều cây xanh.
    Cách công viên Gia Định chỉ 3 phút đi bộ. Có bảo vệ và camera 24/7.
    Phù hợp người đi làm, thuê ở lâu dài.`,
            authorId: 'user6'
        },
        {
            id: '7',
            title: 'GẦN GTVT, NGOẠI THƯƠNG, HUTECH, HỒNG BÀNG, UEF, VietVision, Ga Metro- TT Q.BÌNH THẠNH UNG VĂN KHIÊM',
            price: '4 triệu/tháng',
            area: '20 m²',
            address: 'Bình Thạnh, Hồ Chí Minh',
            fullAddress: '12/5 Điện Biên Phủ, Bình Thạnh, Hồ Chí Minh',
            district: 'Bình Thạnh',
            province: 'Hồ Chí Minh',
            postedDate: 'Thứ 5, 11:00 10/07/2025',
            expiredDate: 'Thứ 6, 11:00 10/08/2025',
            images: [
                'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2025/03/28/h1_1743143258.jpg',
                'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2025/03/28/h6_1743143297.jpg',
                'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2025/03/28/h4_1743143308.jpg',
            ],
            description: `- Để đảm bảo an ninh cho Sinh Viên ở Ngõ Sen giờ hoạt động từ 6h - 24h (không có giờ tự do), ra vào cổng bằng khóa vân tay. Chính chủ cho thuê, không qua trung gian.
- Đ/c: Ngõ Sen 97/15, Ung Văn Khiêm, Phường 25, Bình Thạnh (vào hẻm 97 Ung Văn Khiêm chạy thẳng là gặp Ngõ Sen)
- Vị trí rất thuận tiện, gần các trường ĐH GTVT (cách 600m đi bộ 8', đi xe 2'), ĐH Ngoại Thương (cách 800m đi bộ 10', đi xe 3'), ĐH Hutech, VietVision translation & education (cách 100m đi bộ 3') ĐH Quốc tế Hồng Bàng, Landmark 81...
- Tiện ích xung quanh đầy đủ: chợ, cửa hàng tiện lợi, cây xăng, ATM, quán xá,...
- Hẻm xe hơi, khuôn viên rộng rãi thoáng mát.
- Hệ thống PCCC, an ninh đầy đủ.
- Thích hợp cho sinh viên và NVVP.
-----------------------------
TIỆN ÍCH
- Phòng thoáng mát, sạch sẽ, cộng đồng sống văn minh, lịch sự và khu dân cư yên tĩnh
- Có kệ bếp, bồn rửa, nhà vệ sinh rộng rãi. Đồng hồ điện nước riêng, có gác
- Khu phòng có thang máy, chỗ để xe, cửa vân tay, bảo vệ,...
- Miễn phí internet, nhân viên vệ sinh lau dọn khu vực chung hàng ngày.
- Phòng mới trống sẵn, vào ở được liền.
- PHÒNG VIP 6tr5
- CẦN 1 BẠN NỮ Ở GHÉP
-------------------------------
GIÁ THUÊ:
- Phòng 4tr - 5tr đồ cơ bản (25m - 35m)
- Phòng 5tr5 - 6tr5 đầy đủ tiện nghi: có máy lạnh, tủ lạnh, bếp nấu ăn,... (20m - 30m)
----------------------------
LH hotline: 0909814679 (Chị Ánh), 0909281128 (Chị Ly)
Clip video phòng giá 6tr5`,
            authorId: 'user7'
        },
    ],

    users: [
        {
            id: 'user1',
            name: 'Cường Phạm',
            phone: '0938864405',
            zalo: 'https://zalo.me/0938864405',
            joinedDate: '10/06/2025',
            avatar: 'https://phongtro123.com/images/default-user.png',
            status: 'Đang hoạt động'
        },
        {
            id: 'user2',
            name: 'Anh Việt',
            phone: '0938297275',
            zalo: 'https://zalo.me/0938297275',
            joinedDate: '12/06/2025',
            avatar: 'https://phongtro123.com/images/default-user.png',
            status: 'Đang hoạt động'
        },
        {
            id: 'user3',
            name: 'Hồng Thu',
            phone: '093829890',
            zalo: 'https://zalo.me/093829890',
            joinedDate: '12/06/2025',
            avatar: 'https://phongtro123.com/images/default-user.png',
            status: 'Đang hoạt động'
        },
        {
            id: 'user4',
            name: 'Nguyễn Đăng Xin',
            phone: '093826523',
            zalo: 'https://zalo.me/093826523',
            joinedDate: '12/06/2025',
            avatar: 'https://phongtro123.com/images/default-user.png',
            status: 'Đang hoạt động'
        },
        {
            id: 'user5',
            name: 'Thùy Linh',
            phone: '0938261353',
            zalo: 'https://zalo.me/0938261353',
            joinedDate: '12/06/2025',
            avatar: 'https://phongtro123.com/images/default-user.png',
            status: 'Đang hoạt động'
        },
        {
            id: 'user6',
            name: 'Trọng Khải',
            phone: '0938268421',
            zalo: 'https://zalo.me/0938268421',
            joinedDate: '12/06/2025',
            avatar: 'https://phongtro123.com/images/default-user.png',
            status: 'Đang hoạt động'
        },
        {
            id: 'user7',
            name: 'Trung Hiếu',
            phone: '0938268935',
            zalo: 'https://zalo.me/0938268935',
            joinedDate: '12/06/2025',
            avatar: 'https://phongtro123.com/images/default-user.png',
            status: 'Đang hoạt động'
        },
    ],

    bookings: [
        {
            id: 'b1',
            roomId: '3',
            tenantId: 'u1',
            bookingDate: '2025-07-26T10:00:00.000Z',
            note: 'Tôi muốn thuê phòng này trong 6 tháng, bắt đầu từ tháng 8.',
            status: 'pending',
        },
        {
            id: 'b2',
            roomId: '4',
            tenantId: 'u1',
            bookingDate: '2025-07-25T15:30:00.000Z',
            note: 'Thuê ngắn hạn 3 tháng.',
            status: 'pending',
        },
    ],
    contracts: [
        {
            id: 'c1',
            tenantId: 'u1',
            postId: '1',
            startDate: '2025-07-01',
            endDate: '2025-12-31',
            status: 'pending'
        },
        {
            id: 'c2',
            tenantId: 'u1',
            postId: '2',
            startDate: '2025-08-15',
            endDate: '2026-02-15',
            status: 'rejected'
        }
    ]
};

export default db;