import http from 'k6/http';
import { check, sleep } from 'k6';

// Cấu hình Load Test & Stress Test
export const options = {
  stages: [
    // 1. Ramp up (Khởi động nhẹ): Lên 100 users trong 30s
    { duration: '30s', target: 100 }, 
    
    // 2. Load Test (Tải trung bình): Giữ 100 users trong 1 phút
    { duration: '1m', target: 100 },
    
    // 3. Stress Test (Tải nặng - Breaking Point): Tăng vọt lên 500 rồi 1000 users
    { duration: '1m', target: 500 },
    { duration: '1m', target: 1000 }, // Đỉnh điểm 1000 users
    
    // 4. Ramp down (Hạ nhiệt): Giảm về 0
    { duration: '30s', target: 0 },
  ],
  // Thiết lập ngưỡng (Thresholds) để đánh giá Đạt/Không Đạt
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% request phải phản hồi dưới 500ms
    http_req_failed: ['rate<0.01'],   // Tỷ lệ lỗi phải dưới 1%
  },
};

export default function () {
  // URL của API Login backend (Lưu ý: Nếu chạy localhost thì dùng IP máy hoặc host.docker.internal)
  const url = 'http://localhost:8080/api/auth/login';
  
  const payload = JSON.stringify({
    username: 'admin',
    password: 'Admin123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Gửi Request
  const res = http.post(url, payload, params);

  // Kiểm tra kết quả (Check)
  check(res, {
    'status is 200': (r) => r.status === 200, // Login thành công
    'token exists': (r) => r.json('token') !== '', // Có trả về token
  });

  sleep(1); // Nghỉ 1s giữa các lần gửi để mô phỏng người dùng thật
}