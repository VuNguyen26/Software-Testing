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

export const options = {
  stages: [
    { duration: '2m', target: 500 }, 

    { duration: '2m', target: 1500 },
    
    { duration: '1m', target: 1500 },
    
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],   
  },
};

export default function () {
  const loginUrl = 'http://localhost:8080/api/auth/login';
  const payload = JSON.stringify({
    username: 'admin',    
    password: 'Admin123', 
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const loginRes = http.post(loginUrl, payload, params);

  if (loginRes.status !== 200) {
      console.error('Login failed');
      return;
  }

  const token = loginRes.json('token'); 

  const productUrl = 'http://localhost:8080/api/products';
  
  const productParams = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
  };

  const res = http.get(productUrl, productParams);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'loaded products': (r) => r.json().length >= 0, 
  });

  sleep(1);
}