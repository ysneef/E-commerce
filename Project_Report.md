# PHIẾU PHÂN CÔNG NHIỆM VỤ VÀ ĐÓNG GÓP CỦA THÀNH VIÊN

| MSSV | Họ và tên | Công việc được giao | % đóng góp |
| :--- | :--- | :--- | :--- |
| 2374802013422 | Võ Công Quang | Xây dựng Frontend (React/Vite), test hệ thống | 50% |
| 2174802010708 | Nguyễn Bảo Thiên | Xây dựng Backend (Node.js/Express, MongoDB), xử lý nghiệp vụ, tích hợp API thanh toán (Stripe) | 90% |
| 2174802010854 | Võ Huỳnh Như Ý | Phân tích yêu cầu, thiết kế hệ thống (UML), thiết kế UI/UX, viết báo cáo | 100% |

---

# LỜI CẢM ƠN
Nhóm em xin gửi lời cảm ơn chân thành đến Ban Giám hiệu và toàn thể Quý Thầy Cô Trường Đại học Văn Lang đã tạo điều kiện thuận lợi trong quá trình học tập và nghiên cứu.

Đặc biệt, nhóm em xin bày tỏ lòng biết ơn sâu sắc đến Thầy Đặng Đình Hòa và Thầy Võ Anh Tiến đã tận tình hướng dẫn, hỗ trợ và đóng góp nhiều ý kiến quý báu giúp nhóm hoàn thành đề tài này.

Nhóm em cũng xin cảm ơn Quý Thầy Cô trong khoa đã truyền đạt những kiến thức nền tảng quan trọng trong suốt quá trình học tập.

Do kiến thức và thời gian còn hạn chế, báo cáo không tránh khỏi những thiếu sót. Nhóm em rất mong nhận được sự góp ý từ Quý Thầy Cô để hoàn thiện hơn.

*TP. Hồ Chí Minh, tháng 3 năm 2026*

---

# MỤC LỤC
- LỜI CẢM ƠN
- DANH SÁCH TỪ VIẾT TẮT
- DANH SÁCH HÌNH ẢNH
- DANH SÁCH BẢNG
- CHƯƠNG 1: MỞ ĐẦU
- CHƯƠNG 2: CỞ SỞ LÝ THUYẾT
- CHƯƠNG 3: THỰC TRẠNG CHỦ ĐỀ NGHIÊN CỨU
- CHƯƠNG 4: KẾT QUẢ NGHIÊN CỨU
- CHƯƠNG 5: KẾT LUẬN
- TÀI LIỆU THAM KHẢO

---

# DANH SÁCH TỪ VIẾT TẮT

| STT | Từ viết tắt | Diễn giải |
| :---: | :--- | :--- |
| 1 | API | Application Programming Interface (Giao diện lập trình ứng dụng) |
| 2 | UI/UX | User Interface / User Experience (Giao diện người dùng / Trải nghiệm người dùng) |
| 3 | CSDL | Cơ sở dữ liệu |
| 4 | BFD | Business Function Diagram (Biểu đồ phân rã chức năng) |
| 5 | DFD | Data Flow Diagram (Biểu đồ luồng dữ liệu) |

---

# CHƯƠNG 1: MỞ ĐẦU

## 1.1 Lý do chọn đề tài/tính cấp thiết của đề tài
Trong thời đại công nghệ số 4.0, sự phát triển mạnh mẽ của Internet đã làm thay đổi hoàn toàn thói quen tiêu dùng của con người. Mua sắm trực tuyến (E-commerce) không chỉ đem lại sự tiện lợi, nhanh chóng cho khách hàng mà còn mở ra cơ hội kinh doanh hiệu quả cho các doanh nghiệp. Việc sử dụng một nền tảng thương mại điện tử giúp tối ưu hóa quy trình quản lý, tiết kiệm chi phí vận hành và dễ dàng tiếp cận với hàng triệu khách hàng tiềm năng. Vì những lý do trên, nhóm quyết định chọn đề tài xây dựng hệ thống E-commerce bán giày dép để giải quyết nhu cầu thực tiễn này.

## 1.2 Mục tiêu của đề tài
- Xây dựng một website thương mại điện tử với giao diện trực quan, thân thiện cho khách hàng mua sắm với hiệu năng cao bằng React và Vite.
- Cung cấp hệ thống quản trị (Admin Panel) tách biệt giúp cửa hàng quản lý sản phẩm, đơn hàng, người dùng một cách hiệu quả.
- Ứng dụng các công nghệ hiện đại ở phía Backend bằng Node.js (Express), tích hợp thanh toán (Stripe) và gửi mail báo cáo tự động (Nodemailer), kết nối CSDL NoSQL (MongoDB) để đảm bảo độ co giãn và bảo trì linh hoạt.

## 1.3 Nội dung và phạm vi nghiên cứu
- **Nội dung:** Phân tích, thiết kế hệ thống, thiết kế UI/UX; Xây dựng REST API; Lập trình giao diện Frontend cho Client Web và Admin Dashboard; Tích hợp giỏ hàng và công cụ thanh toán Stripe.
- **Phạm vi:** Hệ thống tập trung phục vụ mô hình kinh doanh B2C (Business to Consumer), phục vụ khách hàng mua sắm trực tuyến lẻ các sản phẩm với đa dạng thuộc tính (màu sắc, size) và cung cấp công cụ quản trị.

## 1.4 Phương pháp nghiên cứu
### 1.4.1 Phương pháp nghiên cứu lý thuyết
- Tìm hiểu các khái niệm về thương mại điện tử, các tiêu chuẩn thiết kế UI/UX hiện đại cho web mua sắm.
- Đọc các tài liệu chính thống về công nghệ React, Vite, Node.js (Express) và MongoDB (Mongoose).

### 1.4.2 Phương pháp nghiên cứu thực tiễn
- Khảo sát các website hãng giày lớn như Nike, Adidas để phân tích tính năng bộ lọc, hiển thị size, số lượng.
- Xây dựng cấu trúc Monorepo (Turbo) quản lý nhiều service đồng thời, kiểm thử và triển khai các chức năng hệ thống theo chuẩn thực tế.

## 1.5 Cơ sở khoa học và thực tiễn
- **Cơ sở khoa học:** Nền tảng thiết kế cấu trúc Client - Server, kiến trúc RESTful API, quản trị CSDL NoSQL linh hoạt, cùng với phương pháp thiết kế Component Based (React).
- **Cơ sở thực tiễn:** Nhu cầu mua sắm mặt hàng giày/thời trang yêu cầu khắt khe về việc theo dõi số lượng tồn kho dựa trên nhiều biến thể khác nhau (size). Hệ thống đáp ứng cực tốt việc quản ly trực quan trên không gian mạng.

## 1.6 Nội dung của báo cáo
Nội dung của báo cáo sẽ bao gồm:
- Chương 1: Mở đầu
- Chương 2: Phương pháp luận, cơ sở khoa học và thực tiễn
- Chương 3: Phân tích, thiết kế hệ thống
- Chương 4: Kết quả đạt được
- Chương 5: Kết luận và hướng phát triển

---

# CHƯƠNG 2: CỞ SỞ LÝ THUYẾT

## 2.1 Giới thiệu lĩnh vực nghiên cứu
Lĩnh vực nghiên cứu là Thương mại điện tử (E-commerce), cụ thể hóa vào ngách doanh nghiệp vừa và nhỏ kinh doanh phân phối giày thể thao/giày thời trang.

## 2.2 Phương pháp tiếp cận
Dự án được ứng dụng phương pháp phát triển linh hoạt (Agile). Frontend chia nhỏ giao diện thành các thành phần tái sử dụng (components UI bằng Ant Design + Tailwind CSS). Backend sử dụng kết cấu quản lý Route - Controller - Model theo Design Pattern MVC rõ ràng.

## 2.3 Phân tích đánh giá chủ đề nghiên cứu
Hệ thống thương mại điện tử bán giày thường có tính đặc thù là yêu cầu quản lý biến thể (Size/Số lượng). Vì vậy, cơ sở dữ liệu cần một cấu trúc lồng nhau mềm dẻo. MongoDB là một sự lựa chọn tuyệt vời trong việc giải quyết biến thể mảng (array lồng records) một cách trực quan.

## 2.4 Công nghệ sử dụng
- **Frontend (Client Web & Admin):** React, Vite và Tailwind CSS giúp xử lý load app nhanh, dàn trang linh hoạt, thiết kế chuẩn di động. Redux-toolkit quản lý giỏ hàng và dữ liệu nội bộ.
- **Backend:** Node.js, Express.js. Tích hợp Stripe để thực hiện nghiệp vụ thanh toán, Nodemailer để gửi mail nhận đơn hàng / lấy lại mật khẩu.
- **Database:** MongoDB (sử dụng Mongoose ORM/ODM) để quản lý data Schema với các Collection riêng biệt.

---

# CHƯƠNG 3: THỰC TRẠNG CHỦ ĐỀ NGHIÊN CỨU

## 3.1 Khái quát nội dung lý thuyết căn bản
Trình bày về nguyên lý giỏ hàng (Cart) trong E-commerce, quản lý hàng tồn, Flash Sale kích cầu, cũng như tiến trình đặt hàng với nhiều biến số động (như size 40, size 42, v.v.).

## 3.2 Trình bày các dữ liệu, quy trình liên quan
- **Quy trình mua hàng:** Khách hàng tìm kiếm kiểu giày -> Truy cập chi tiết giày (Chọn Size và Số lượng phù hợp) -> Thêm vào giỏ hàng -> Check-out (Chọn phương thức COD hoặc Stripe Credit Card) -> Email thông báo được gửi -> Website lưu đơn và cập nhật doanh thu -> Admin kiểm duyệt và xử lý trạng thái.

## 3.3 Phân tích hệ thống thương mại điện tử hiện có tại Việt Nam
Các sàn TMĐT và chuỗi cung ứng lớn đang làm rất tốt khâu phân phối. Tuy vậy, các thương hiệu nội địa (Local Brand) hoặc nhà buôn tư nhân cần nền tảng web cửa hàng độc lập không phụ thuộc để tăng nhận diện, bảo mật thông tin tệp khách và tránh mất phí sàn cao.

## 3.4 Phân tích yêu cầu và hành vi người dùng
Khi mua giày, khách hàng đặc biệt quan tâm tới hình ảnh sắc nét từ nhiều góc độ (System định hình ít nhất 3 hình ảnh cho mỗi giày), bảng quy đổi kích cỡ (Size guide) chân thực, bộ lọc nhanh theo Brand/Price và cả Review của người mua trước.

## 3.5 Phân tích bài toán thực tế và giải pháp
- **Bài toán:** Quản lý kho hàng giày dép qua Excel thủ công hay bị nhầm lẫn giữa các Size đôi khi dẫn đến tình trạng sai kho (Size 41 đã hết nhưng vẫn cho khách đặt online). Quá trình đối soát giá sale thường bị nhầm.
- **Giải pháp:** Hệ thống website cung cấp quy trình chặt chẽ để hiển thị tồn kho chính xác theo từng số size trực tiếp từ MongoDB. Hệ thống tách biệt logic Admin và Client giúp độc lập quá trình vận hành, tự tính toán `discountPrice`.

## 3.6 Kết luận
Việc xây dựng một hệ thống E-commerce bằng React và NodeJS chuyên biệt cho mô hình giày dép sẽ tối ưu triệt để nhân lực vận hành và cho hiệu suất cao.

---

# CHƯƠNG 4: KẾT QUẢ NGHIÊN CỨU

## 4.1 Đặc tả yêu cầu bài toán
- **Khách hàng:** Tìm kiếm giày theo danh mục (Men, Women, Kids), hãng (Brand), bộ lọc (Filter); Quản lý Profile, mã OTP, giỏ hàng Cart linh hoạt đa size; Đặt hàng, theo dõi lịch sử đơn, đánh giá sản phẩm.
- **Quản trị viên (Admin):** Bảng dashboard thống kê doanh thu; Quản lý thông tin User; Quản lý tồn kho Product qua biến thể Size; Tổ chức chương trình Flash Sale tự động bật tắt theo giờ, xét duyệt thay đổi trạng thái Order (pending, processing, shipped, delivered).

## 4.2 Phân tích hệ thống
### 4.2.1 Kiến trúc hệ thống và môi trường
- **Cấu trúc tổng thể:** Mô hình Client - Server dưới dạng Workspace Monorepo độc lập các gói front, admin và api. Chuẩn giao thức trao đổi RESTful JSON.
- **Công nghệ sử dụng:** React/Vite, Express.js backend, Mongoose quản trị CSDL, JWT xác thực bảo mật, Stripe xử lý thanh toán dòng tiền.

### 4.2.2 Các bên liên quan
- **Người dùng cuối:** Khách hàng.
- **Quản trị viên:** Nhân sự Shop.

### 4.2.3 BFD (Business Function Diagram)
1. Quản lý tài khoản và OTP Reset Password (Auth).
2. Quản lý hàng hóa giày dép (Sản phẩm, Bộ sưu tập hình, Thuộc tính Size).
3. Quản lý Đơn hàng - Giao dịch - Thanh toán.
4. Quản lý Flash Sale.
5. Review và phân loại.

### 4.2.4 DFD (Data Flow Diagram) / Thiết kế giao diện
*(Hình ảnh thiết kế luồng dữ liệu và giao diện thực tế của App, luồng thanh toán Stripe sẽ được đính kèm vào bản cứng/bản in)*

## 4.3 Đặc tả mô hình Cơ sở Dữ liệu (MongoDB - Mongoose)

### Bảng (Collection) Users
Lưu thông tin đăng nhập và trạng thái giỏ hàng nội bộ.

| Field (Thuộc tính) | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| **_id** | String (ObjectId) | Id định danh riêng |
| **userName** | String | Tên hiển thị người dùng |
| **email** | String (Unique) | Email đăng nhập |
| **password** | String | Mật khẩu băm (bcrypt) |
| **phone / address / avatar** | String | Thông tin liên lạc/hiển thị |
| **role** | Enum("user", "admin") | Quyền truy cập hệ thống |
| **cart** | Array of Objects | Lưu trực tiếp các món đã thêm giỏ bao gồm productId, giá trị gốc/giảm, size, số lượng, v.v |
| **order** | Array of ObjectIds | Tham chiếu tới các Order đã đặt |
| **resetPasswordOTP** | String | OTP dùng khi lấy lại mật khẩu |

### Bảng (Collection) Products
Lưu cấu trúc về đôi giày.

| Field (Thuộc tính) | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| **_id** | String (ObjectId) | Id sản phẩm |
| **name** / **description** | String | Thông tin chung |
| **price** | Number | Giá niêm yết ban đầu |
| **discountPercent**| Number | % Khuyến mãi mặc định |
| **discountPrice** | Number | Giá sau khi đã tính discount |
| **category** | Enum(...) | Phân loại mảng (Men, Women, Kids) |
| **brand** | Enum(...) | Thương hiệu (Nike, Adidas, Puma, v.v) |
| **image** | Array of String | Array bắt buộc 3 URLs hình ảnh |
| **sizes** | Array of Objects | Mảng theo dõi `{size: "40", quantity: 15}`... |
| **rating** | Number | Điểm đánh giá (1-5) |
| **status** | Boolean | Trạng thái Mở/Tắt bán |

### Bảng (Collection) Orders
Thông tin hóa đơn giao dịch.

| Field (Thuộc tính) | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| **_id** | String (ObjectId) | Id biên lai |
| **user** | Object | Chứa thông tin rút gọn: name, phone, email.. của khách lúc đặt hàng nhằm cố định record |
| **items** | Array of Objects | Mảng hàng hóa đã mua (kèm fields size, số lượng, giá tiền lúc mua) |
| **totalPrice** / **discount**| Number | Phân tách giá tiền và tổng chiết khấu |
| **status** | Enum(...) | Trạng thái (pending, processing, shipped, delivered, cancelled) |
| **shippingAddress** | String | Văn bản chứa địa chỉ giao hàng |
| **paymentMethod** | String | "cod" hoặc "stripe" |

### Bảng (Collection) Reviews
| Field (Thuộc tính) | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| **productId** / **userId**| String | Khóa ngoại tham chiếu lên User và Product |
| **rating** | Number | Điểm số đánh giá tổng thể |
| **comment** | String | Lời nhận xét về giày |

### Bảng (Collection) FlashSales
| Field (Thuộc tính) | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| **name** | String | Tên chương trình |
| **startTime / endTime** | Date | Quỹ thời gian diễn ra hiệu lực sự kiện |
| **products** | Array of Objects| Danh sách hàng tham gia Flash Sale gồm: productId được gán chiết khấu riêng và giới hạn độ lớn tồn kho. |
| **status** | Boolean | Kích hoạt hiệu lực |

## 4.4 Xây dựng chương trình
### 4.4.1 Các chức năng đã xây dựng được
- **Hệ thống đa luồng Admin/Client:** Tách biệt ứng dụng giúp giảm tải máy chủ, cho phép UI tối ưu hóa trải nghiệm riêng.
- **Thanh toán Trực tuyến (Stripe Integration):** Xây dựng luồng Check-out tiền tệ quốc tế an toàn với webhook linh hoạt. 
- **Quản lý Giỏ Hàng theo Size Lồng Khớp:** Xử lý logic 1 chiếc giày khác màu, khác size vào cùng một giỏ hàng mà không bị nhầm lẫn tính năng cộng đồn.
- **Gửi Email Xác nhận:** Trigger Nodemailer API tự động báo cáo Bill qua Mail cho người đặt.

### 4.4.2 Các chức năng trong dự kiến nhưng chưa xây dựng được
- Thêm chức năng xem giày xoay 360 độ hoặc thử giày bằng công nghệ AR (Thực tế ảo tăng cường).
- Tích hợp thêm các bộ quy đổi size chung giữa chuẩn EU/US/VN để khách hàng hạn chế băn khoăn khi lựa chọn do MongoDB Array đôi khi phức tạp trong việc filter.

---

# CHƯƠNG 5: KẾT LUẬN
## 5.1 Tóm tắt kết quả đạt được
Đề tài đã triển khai thành công một website thương mại điện tử chuyên dụng cho việc kinh doanh mặt hàng giày dép; giải quyết được bài toán phân loại sản phẩm theo kích cỡ phức tạp. Hệ thống ứng dụng tốt những kỹ thuật tối ưu hóa luồng linh hoạt của React/Vite kết hợp ExpressJS/MongoDB thay cho các công nghệ cũ kỹ truyền thống.

## 5.2 Đánh giá và hạn chế
### 5.2.1 Đánh giá
Cấu trúc Monorepo dễ dàng triển khai, tốc độ tải SPA của ứng dụng Web cũng như Admin Dashboard rất nhanh và thân thiện. Việc ứng dụng Mongoose tạo tính chặt chẽ trong Validate dữ liệu. Hệ thống đảm bảo được tính trọn vẹn của nghiệp vụ tài khoản - kho - giao dịch.

### 5.2.2 Hạn chế
Tính linh hoạt về Caching chưa sử dụng Redis nên đối với trường hợp Flash Sale diện rộng có tốc độ request đồng loạt (Concurrency) lớn có thể làm nghẽn DB.

### 5.2.3 Bài học kinh nghiệm
Nắm vững cách cấu trúc Mongoose Schemas với dữ liệu lồng nhau (Sub-documents) để xử lý lượng Size/Cart linh hoạt. Cải thiện đáng kể kỹ năng React Hook & Redux đối với tệp dữ liệu lớn. Tổ chức thư mục API bảo mật thông minh.

## 5.3 Hướng phát triển trong tương lai
Cải thiện phân cụm máy chủ và áp dụng Redis để caching lượt xem giày, giỏ hàng, thông tin Flash Sale.

---

# TÀI LIỆU THAM KHẢO

**Tiếng Việt**
[1] F8 Fullstack, "Kiến trúc React Component & Redux", fullstack.edu.vn, 2024.
[2] Nguyễn Minh Tâm, "Hướng dẫn lập trình hệ thống RESTful API với Express.js & MongoDB", Tạp chí CNTT, 2023.
[3] Stripe Inc., "Tài liệu kỹ thuật và cổng Checkout Integration", stripe.com, 2025.
