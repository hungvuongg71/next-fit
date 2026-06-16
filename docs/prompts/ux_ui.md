## 1. Tổng quan dự án

- Web app này làm về ứng dụng gợi ý các bài tập gym và thay đổi các bài tập cảm thấy không bị nhàm chán ở buổi tập, các bài tập sẽ dựa trên các tiêu chí mà User lựa chọn để đưa ra kết quả gợi ý.
- Đối tượng tập trung vào các bạn gymer mọi trình độ.

---

## 2. Tính năng chính:

- Quản lý tiêu chí trước khi gợi ý bài tập. **_(Chỉ Admin)_**
- Quản lý danh sách bài tập có thể gợi ý. (Bao gồm: Tên bài tập, hình ảnh GIF động tác, mô tả động tác, video mô tả). **_(Chỉ Admin)_**
- Đề xuất các bài tập trong ngày hôm đó dựa trên các tiêu chí mà User đã lựa chọn, dùng AI APIs để gợi ý bài tập.
- Lưu lịch sử buổi tập hôm đó của User: Số sets, reps, thời gian nghỉ của từng bài (Dữ liệu này để cho AI gợi ý ở các buổi tập tiếp theo).

---

## 3. User Flow:

### 3.1. Flow Trang chính:

1. User khi vào Web App bằng Mobile/Tablet/Desktop
2. User lựa chọn tiêu chí theo 2 trường hợp sau:
   - Nếu User vào Web lần đầu tiên, hiển thị các tiêu chí + các lựa chọn của từng tiêu chí để User chọn.
   - Nếu User trở lại Web, Web hiển thị options cho User muốn chọn lại tiêu chí hay tiếp tục.
3. Ở màn hình chính, sẽ hiển thị cho User danh sách bài tập gợi ý dựa theo tiêu chí mà User đã chọn (Thông thường 4-5 bài tập). User nhấn nút Workout thì sẽ bắt đầu bài tập buổi hôm đó.
   - User có quyền thêm 1 bài tập khác hoặc thay đổi 1 bài tập khác tương đương
   - User có quyền hủy bỏ 1 bài tập bất kỳ.
   - Khi User có thể nhấn nút reset, hoàn tác lại các bài tập gợi ý của ngày hôm nay.

### 3.2. Flow vào Workout của ngày:

1. Khi User đã nhấn nút Workout, Web hiển thị từng bài tập.
2. Có nút cho User thêm 1 set và input nhập reps của set đó. Mặc định để 3 sets
3. Khi User nhập xong số reps và nhấn check thì sẽ hiển thị thời gian nghỉ. Mặc định là 60 giây, có 2 nút +15 giây hoặc -15 giây để tăng/giảm thời gian nghỉ.
4. Sau khi hết thời gian nghỉ, Web sẽ highlight vị trí set đang tập để User biết minh đang tập ở bài nào, set mấy.
5. Sau khi tập hết tất cả các bài tập trong ngày, có nút nhấn hoàn thành.
   - User chỉ được nhấn nút hoàn thành khi hoàn thành số lượng bài tập trong ngày.
   - Khi không hoàn thành, hiển thị nút Hủy bỏ để quay về màn hình chính.
   - Khi nhấn nút hoàn thành, hiển thị màn hình chúc mừng hoàn thành workout hôm nay.

### 3.3. Flow hiển thị chi tiết bài tập:

1. Khi nhấn vào 1 bài tập ở màn hình Workout, hoặc bài tập ở Trang chính, thì sẽ hiển thị modal chi tiết bài tập đó.
2. Modal chi tiết bao gồm:
   - Section 1: Có 2 tab là Hình ảnh GIF động tác bài tập / Video
   - Section 2: Mô tả động tác.
   - Section 3: Danh sách hiển thị hình ảnh các bài tập liên quan.

### 3.3. Flow Đăng ký/Đăng nhập + Popup cho phép lưu trữ thông tin workout:

**_(Đang phát triển)_**

### 3.4. Flow hiển thị cho phép sử dụng cookies và lưu trữ thông tin tại trình duyệt.

- Khi User vào bất kỳ link nào trên Web, nếu chưa check chọn cho phép sử dụng cookies và lưu trữ thông tin thì hiển thị popup ở footer, User xác nhận cho phép sử dụng cookies.

---

## 4. Giao diện UI & Phong cách thiết kế

- Áp dụng quy tắc 60-30-10: 60% cho màu nền tối để làm nổi bật video bài tập, 30% màu phụ cho các khung (cards) chứa thông tin nhóm cơ, và 10% màu chủ đạo cho các nút hành động (Start, Next, Done) để kích thích người dùng bấm chọn.
- **Phong cách chủ đạo**: Tối giản và sạch sẽ
- **Bảng màu**:
  - Màu chủ đạo (Primary): `#2979FF`
  - Màu phụ (Secondary): `#0F0F14`
  - Màu nền (Background): `#000000`
  - Màu nhấn (Accent): `#FF007F`
  - Màu chữ & Chi tiết: `#E0E0E0`
- **Typography (Font chữ)**:
  - Tiêu đề lớn: Syne (Extra Bold)
  - Các đề mục: Space Grotesk
  - Văn bản: Plus Jakarta Sans
  - Hiển thị số: Rubik Mono One

---

## 5. Quy chuẩn Responsive

- Thiết kế theo tư duy Mobile-First. Khi chuyển sang Desktop, layout tự động mở rộng từ 1 cột thành lưới 3 cột; các nút hành động (CTA) thu gọn lại từ dạng tràn màn hình (full-width) trên mobile thành các nút bo góc tinh tế nằm gọn trong các thẻ bài tập.
- Hành vi Layout:
  - **Desktop**:
    - Màn hình rộng là không gian lý tưởng để người dùng xem tổng quan lộ trình, quản lý lịch trình, hoặc xem video hướng dẫn động tác với góc nhìn lớn nhất.
    - **Bố cục dạng lưới (Grid System):** Sử dụng hệ thống lưới nhiều cột (thường là 3 hoặc 4 cột) để hiển thị đồng thời nhiều thẻ (cards) bài tập.
    - **Thanh điều hướng (Navigation):** Menu điều hướng được hiển thị đầy đủ, nằm ngang ở trên cùng (Top Navigation) hoặc cố định ở cạnh trái (Sidebar Navigation) giúp quản lý tài khoản, lịch sử tập và cài đặt thuận tiện.
    - **Khu vực hiển thị nội dung:** Chia không gian theo tỷ lệ (ví dụ: 70% bên trái hiển thị video bài tập lớn hoặc biểu đồ nhịp tim/calo; 30% bên phải là danh sách các động tác tiếp theo hoặc thông số chi tiết).
    - **Trải nghiệm tương tác:** Các hiệu ứng rê chuột (Hover states) hiển thị rõ ràng trên các nút hành động, thẻ bài tập.
  - **Mobile**:
    - **Bố cục 1 cột dọc (Single Column Layout):** Toàn bộ các thẻ bài tập, biểu đồ và thông tin sẽ xếp chồng theo một cột dọc duy nhất để người dùng dễ dàng cuộn bằng một tay.
    - **Menu rút gọn (Hamburger Menu / Bottom Navigation):** Thanh menu ngang biến mất, thay thế bằng nút ba gạch (Hamburger menu) ở góc trên.
      - Sử dụng thanh điều hướng dạng tab nằm sát đáy màn hình (Bottom Navigation Bar) chứa 3-4 biểu tượng chính (Home, Workout, Analytics, Profile) để người dùng dễ dàng chạm tới bằng ngón tay cái.
    - **Nút hành động lớn (Bold CTA Buttons):** Các nút điều khiển như Bắt đầu (Start), Tiếp theo (Next), Hoàn thành (Done) được thiết kế to, kéo dài toàn độ rộng màn hình, sử dụng các màu nhấn rực rỡ để kích thích và giúp người dùng dễ dàng chạm trúng ngay cả khi tay đang run hoặc ra mồ hôi do tập nặng.
