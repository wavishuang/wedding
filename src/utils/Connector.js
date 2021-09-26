import axios from 'axios';
import "core-js";
import "regenerator-runtime/runtime";

export default class Connector {
  constructor() {
    const weddingUrl = 'http://backend.wedding-pass.com/WebService_SF_WEDDING_PASS.asmx';
    const weddingImpl = axios.create({
      baseURL: weddingUrl,
      timeout: 2500,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    });

    weddingImpl.interceptors.response.use((res) => {
      return res.data;
    }, (err) => {
      console.log('connector err:', err);
      return Promise.reject(err);
    });

    const systemUrl = 'http://backend.wedding-pass.com/WebService_System_Ryan.asmx';
    const systemImpl = axios.create({
      baseURL: systemUrl,
      timeout: 2500,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      }
    });

    systemImpl.interceptors.response.use((res) => {
      return res.data;
    }, (err) => {
      console.log('axios connector err:', err);
      return Promise.reject(err);
    });

    this.weddingImpl = weddingImpl;
    this.systemImpl = systemImpl;
  }

  // 取得簡訊驗證碼
  async login(payload, callback) {
    return this.weddingImpl
      .post('/Login', payload)
      .then((res) => callback(res, res.err));
  }

  // 送出簡訊驗證碼
  async check_login(payload, callback) {
    return this.weddingImpl
      .post('/CheckLogin', payload)
      .then((res) => callback(res, res.err));
  }

  // 檢查 Token 是否失效
  async check_token(payload, callback) {
    return this.systemImpl
      .post('/CheckToken', payload)
      .then((res) => callback(res, res.err));
  }

  // 取得 婚禮籌備即時資訊
  async query_client_list(payload, callback) {
    return this.weddingImpl
      .post('/QueryClientList', payload)
      .then((res) => callback(res, res.err));
  }

  // 取得 Client欄位設置
  async query_client_column_setup(payload, callback) {
    return this.weddingImpl
      .post('/QueryClientColumnSetup', payload)
      .then((res) => callback(res, res.err));
  }

  // 取得
  async query_order_info(payload, callback) {
    return this.weddingImpl
      .post('/QueryOrderInfo', payload)
      .then((res) => callback(res, res.err));
  }

  // 取得 Check in 資訊
  async query_dashboard_info_checkin(payload, callback) {
    return this.weddingImpl
      .post('/QueryDashboardInfo_Checkin', payload)
      .then((res) => callback(res, res.err));
  }

  async query_dashboard_info_multi_checkin(payload, callback) {
    return this.weddingImpl
      .post('/QueryDashboardInfo_MultiCheckIn', payload)
      .then((res) => callback(res, res.err));
  }

  // 取得圖片
  async query_intro_image(payload, callback) {
    return this.weddingImpl
      .post('/QueryIntroImage', payload)
      .then((res) => callback(res, res.err));
  }

  // Payment Info
  async query_payment_info(payload, callback) {
    return this.weddingImpl
      .post('/QueryPaymentInfo', payload)
      .then((res) => callback(res, res.err));
  }

  // 取得"婚禮資料"
  async query_base_data(payload, callback) {
    return this.weddingImpl
      .post('/QueryBaseData', payload)
      .then((res) => callback(res, res.err));
  }

  // 儲存婚禮基本資料 1-4
  async save_base_data(payload, callback) {
    return this.weddingImpl
      .post('/SaveBaseData', payload)
      .then((res) => callback(res, res.err));
  }
}