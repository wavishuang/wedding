import axios from 'axios';
import "core-js";
import "regenerator-runtime/runtime";

/*
// 配置公共的請求地址
axios.defaults.baseURL = 'http://backend.wedding-pass.com';

// 配置超過時間
axios.defaults.timeout = 2500;

// 配置公共的 headers
axios.defaults.headers['mytoken'] = AUTH_TOKEN;
axios.defaults.headers['Authorization'] = AUTH_TOKEN;

// 配置公共的 post 的 Content-Type
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
*/

const weddingUrl = 'http://backend.wedding-pass.com/WebService_SF_WEDDING_PASS.asmx';
const systemUrl = 'http://backend.wedding-pass.com/WebService_System_Ryan.asmx';

const weddingInstance = axios.create({
  baseURL: weddingUrl,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
  }
});

const systemInstance = axios.create({
  baseURL: systemUrl,
  timeout: 2000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
  }
});

/** 驗證 api */
// 取得簡訊驗證碼
export const api_login = formData => weddingInstance.post('/Login', formData);

// 送出簡訊驗證碼
export const api_check_login = formData => weddingInstance.post('/CheckLogin', formData);

// 檢查 Token 是否失效
export const api_check_token = formData => systemInstance.post('/CheckToken', formData);

/** 共用 */
// 取得圖片
export const api_query_intro_image = formData => weddingInstance.post('/QueryIntroImage', formData);

// 取得 Client欄位設置
export const api_query_client_column_setup = formData => weddingInstance.post('/QueryClientColumnSetup', formData);

// 取得 Order Info
export const api_query_order_info = formData => weddingInstance.post('/QueryOrderInfo', formData);




// 取得婚禮基本資料 Query Base Data
export const api_query_base_data = formData => weddingInstance.post('/QueryBaseData', formData);

// 取得 婚禮籌備即時資訊
export const api_query_client_list = formData => weddingInstance.post('/QueryClientList', formData);



// 取得 Dashboard Info Check in 資訊
export const api_query_dashboard_info_checkin = formData => weddingInstance.post('/QueryDashboardInfo_Checkin', formData);

// 取得 Dashboard Info Multi Check in 資訊
export const api_query_dashboard_info_multi_checkin = formData => weddingInstance.post('/QueryDashboardInfo_MultiCheckIn', formData);



// 儲存婚禮基本資料 1-4
export const api_save_base_data = formData => weddingInstance.post('/SaveBaseData', formData);

// Query PaymentInfo
export const api_query_payment_info = formData => weddingInstance.post('/QueryPaymentInfo', formData);

// Query Post Man Progress
export const api_query_postman_progress = formData => weddingInstance.post('/QueryPostManProgress', formData);

// Send Email Invite Card 發送電子邀請函(單一)
export const api_send_email_invite_card = formData => weddingInstance.post('/SendEmailInviteCard', formData);

// SendMMSInviteCard 發送 MMS 圖文簡訊(單一)
export const api_send_mms_invite_card = formData => weddingInstance.post('/SendMMSInviteCard', formData);

// SendSMSInviteCard 發送 ＳMS 文字簡訊(單一)
export const api_send_sms_invite_card = formData => weddingInstance.post('/SendSMSInviteCard', formData);

// AddStickerRequest 賓客專屬QRCode索取貼紙 - 送出索取
export const api_add_sticker_request = formData => weddingInstance.post('/AddStickerRequest', formData);

// SendAllEmailEDM 批次發送 Email 電子邀請函(全部)
export const api_send_all_email_edm = formData => weddingInstance.post('/SendAllEmailEDM', formData);

// QueryClientInviteCardImage 線上檢視
export const api_query_client_invite_card_image = formData => weddingInstance.post('/QueryClientInviteCardImage', formData);

// 婚宴報名模組 - 婚禮報名網站設定 QueryWebRegistrationSetup20101501
export const api_query_web_registration_setup_20101501 = formData => weddingInstance.post('/QueryWebRegistrationSetup20101501', formData);

// 婚宴報名模組 - 儲存婚禮報名網站設定 SaveWebRegistrationSetup20101501
export const api_save_web_registration_setup_20101501 = formData => weddingInstance.post('/SaveWebRegistrationSetup20101501', formData);

// 婚宴報名模組 - 婚禮報名網站設定 QueryWebRegistrationSetup20101501_PhotoList
export const api_query_web_registration_setup_20101501_photo_list = formData => weddingInstance.post('/QueryWebRegistrationSetup20101501_PhotoList', formData);

// 婚宴報名模組 - 婚禮報名網站設定 AddWebRegistrationSetup20101501_PhotoList
export const api_add_web_registration_setup_20101501_photo_list = formData => weddingInstance.post('/AddWebRegistrationSetup20101501_PhotoList', formData);

// 完整名單管理 - 修改 EventUpdateClient
export const  api_event_update_client = formData => weddingInstance.post('/EventUpdateClient', formData);

// 完整名單管理 - 新增 EventInsertClient
export const  api_event_insert_client = formData => weddingInstance.post('/EventInsertClient', formData);

// 賓客資料分析 - 資料 QueryEventColumnGroupStatistics
export const api_query_event_column_group_statistics = formData => weddingInstance.post('/QueryEventColumnGroupStatistics', formData);

// 賓客報到分析 - 資料 QueryCheckinStatistics
export const api_query_checkin_statistics = formData => weddingInstance.post('/QueryCheckinStatistics', formData);

// EDM QueryInviteCardSetup
export const api_query_invite_card_setup = formData => weddingInstance.post('/QueryInviteCardSetup', formData);

// UpdateActiveInviteCardSetup
export const api_update_active_invite_card_setup = formData => weddingInstance.post('/UpdateActiveInviteCardSetup', formData);

// SendEMailDemoEDM
export const api_send_email_demo_edm = formData => weddingInstance.post('/SendEMailDemoEDM', formData);

// SendMMSDemoEDM
export const api_send_mms_demo_edm = formData => weddingInstance.post('/SendMMSDemoEDM', formData);



