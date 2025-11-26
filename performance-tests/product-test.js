import http from 'k6/http';
import { check, sleep } from 'k6';

// Cấu hình kịch bản tải (Nhẹ hơn Login chút vì API này nặng hơn)
// export const options = {
//   stages: [
//     { duration: '30s', target: 50 },  // Ramp up: Tăng dần lên 50 user
//     { duration: '1m', target: 200 },  // Load test: Giữ 200 user liên tục
//     { duration: '30s', target: 0 },   // Ramp down: Giảm về 0
//   ],
//   thresholds: {
//     http_req_duration: ['p(95)<1000'], // API lấy danh sách sản phẩm cho phép chậm hơn (1s)
//     http_req_failed: ['rate<0.01'],    // Tỷ lệ lỗi vẫn phải dưới 1%
//   },
// };

// Cấu hình Stress Test
export const options = {
  stages: [
    // Giai đoạn 1: Tăng từ từ lên 500 users trong 2 phút
    // (Để xem hệ thống phản ứng thế nào khi tải tăng dần)
    { duration: '2m', target: 500 }, 
    
    // Giai đoạn 2: Ép xung lên 1500 users trong 2 phút tiếp theo
    // (Đây là lúc tìm điểm gãy. Login gãy ở 1000, ta thử ép Product lên 1500 xem sao)
    { duration: '2m', target: 1500 },
    
    // Giai đoạn 3: Giữ đỉnh 1500 trong 1 phút (Để chắc chắn sập hẳn)
    { duration: '1m', target: 1500 },
    
    // Giai đoạn 4: Giảm dần về 0
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // Vẫn giữ tiêu chuẩn 1s
    http_req_failed: ['rate<0.01'],    // Chấp nhận lỗi < 1%
  },
};

export default function () {
  // --- BƯỚC 1: ĐĂNG NHẬP ĐỂ LẤY TOKEN ---
  // (Vì API Product yêu cầu phải đăng nhập mới gọi được)
  
  const loginUrl = 'http://localhost:8080/api/auth/login';
  const payload = JSON.stringify({
    username: 'admin',    // Dùng user thật trong DB của bạn
    password: 'Admin123', 
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const loginRes = http.post(loginUrl, payload, params);

  // Kiểm tra nếu login lỗi thì dừng luôn lượt này
  if (loginRes.status !== 200) {
      console.error('Login failed');
      return;
  }

  // Lấy token từ phản hồi (Giả sử backend trả về json: { "token": "eyJhb..." })
  // Bạn cần kiểm tra lại cấu trúc JSON thực tế của backend bạn
  const token = loginRes.json('token'); 

  // --- BƯỚC 2: GỌI API PRODUCT ---
  
  const productUrl = 'http://localhost:8080/api/products';
  
  // Gắn Token vào Header (Bearer Token)
  const productParams = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
  };

  const res = http.get(productUrl, productParams);

  // --- BƯỚC 3: KIỂM TRA KẾT QUẢ ---
  check(res, {
    'status is 200': (r) => r.status === 200,
    'loaded products': (r) => r.json().length >= 0, // Đảm bảo trả về danh sách (mảng)
  });

  sleep(1);
}