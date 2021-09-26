// 主要選單
export const MenuGroup = [
  { gid: 1, name: '婚禮資訊', 
    subItems: [
      { id: 10, text: '婚禮報到基本設定' },
      { id: 11, text: '婚禮籌備即時資訊' },
      { id: 12, text: '婚禮報到即時資訊' },
      { id: 13, text: '設定電子邀請函' },
      { id: 14, text: '婚禮基本資料編輯' }
    ]
  },
  { gid: 2, name: '婚宴報名模組', 
    subItems: [
      { id: 20, text: '婚宴報名模組' },
      { id: 21, text: '報名網站設定' },
      { id: 22, text: '報名網站預覽' },
    ]
  },
  { gid: 3, name: '賓客名單管理', 
    subItems: [
      { id: 30, text: '賓客名單管理' },
      { id: 31, text: '完整名單管理' },
      { id: 32, text: '下載Excel範本' },
      { id: 33, text: '批次匯入名單' },
      { id: 34, text: '匯出賓客名單' },
      { id: 35, text: '報到簡訊通知' },
    ]
  },
  { gid: 4, name: '電子邀請函發送', 
    subItems: [
      { id: 40, text: '電子邀請函發送' },
      { id: 41, text: ['Email','電子邀請函發送'] },
      { id: 42, text: ['MMS圖文簡訊','電子邀請函發送'] },
      { id: 43, text: ['SMS文字簡訊','電子邀請函發送'] },
      { id: 44, text: ['傳統喜帖','QRC貼紙索取'] },
    ]
  },
  { gid: 5, name: '婚禮招待準備', 
    subItems: [
      { id: 50, text: '婚禮招待準備' },
      { id: 51, text: '下載婚禮招待APP' },
      { id: 52, text: '婚禮招待APP登入碼' },
    ]
  },
  { gid: 6, name: '數據統計即時分析', 
    subItems: [
      { id: 60, text: '數據統計即時分析' },
      { id: 61, text: '賓客資料分析圖' },
      { id: 62, text: '賓客報到分析圖' },
    ]
  },
  { gid: 7, name: '賓客賀詞', 
    subItems: [
      { id: 70, text: '賓客賀詞' },
      { id: 71, text: '賓客賀詞' },
    ]
  },
];

// 語系
export const Language = [
  { id: 1, name: 'TW', text: '繁體中文', },
  { id: 2, name: 'CN', text: '簡体中文' },
  { id: 3, name: 'EN', text: 'English' },
  { id: 4, name: 'JP', text: '日本語' },
  { id: 5, name: 'KO', text: '한국어' },
  { id: 6, name: 'FR', text: 'français' },
  { id: 7, name: 'ES', text: 'Español' },
  { id: 8, name: 'PT', text: 'Portugues' }
];

// 婚禮報到基本設定
export const IconCollection = [
  { gid: 1, 
    id: 10,
    title: '婚禮報到基本設定',
    icons: [
      {id: 13, text: '設定電子邀請函', link: '/edm.html', iconClass: 'mbr-iconfont mbrib-letter icon-primary'},
      {id: 14, text: '婚宴資料編輯', link: '/information.html', iconClass: 'mbr-iconfont mbri-edit icon-primary'},
    ]
  },
  { gid: 2, 
    id: 20,
    title: '婚宴報名模組',
    icons: [
      {id: 21, text: '報名網站設定', link: '#', introImg: 15, iconClass: 'mbri-globe mbr-iconfont mbr-iconfont-btn icon-primary'},
      {id: 22, text: '報名網站預覽', link: '#', introImg: 12, iconClass: 'mbri-globe mbr-iconfont mbr-iconfont-btn icon-primary'},
    ]
  },
  { gid: 3, 
    id: 30,
    title: '賓客名單管理',
    icons: [
      {id: 31, text: '完整名單管理', link: '#', introImg: 2, iconClass: 'mbr-icon-extra-css mbr-iconfont icon54-v1-numbered-list2'},
      {id: 32, text: '下載Excel範本', link: '#', introImg: 11, iconClass: 'mbr-icon-extra-css mbr-iconfont imind-file-excel'},
      {id: 33, text: '批次匯入名單', link: '#', introImg: 1, iconClass: 'mbr-icon-extra-css mbr-iconfont mbri-upload'},
      {id: 34, text: '匯出賓客名單', link: '#', introImg: 3, iconClass: 'mbr-icon-extra-css mbr-iconfont icon54-v1-excel'},
      {id: 35, text: '報到簡訊通知', link: '#', introImg: 10, iconClass: 'mbr-icon-extra-css mbr-iconfont icon54-v3-love-message-1'},
    ]
  },
  { gid: 4, 
    id: 40,
    title: '電子邀請函發送',
    icons: [
      {id: 41, text: ['Email', '電子邀請函發送'], link: '#', introImg: 4, iconClass: 'mbr-icon-extra-css mbr-iconfont mbrib-letter'},
      {id: 42, text: ['MMS圖文簡訊', '電子邀請函發送'], link: '#', introImg: 5, iconClass: 'mbr-icon-extra-css mbr-iconfont icon54-v3-love-message-1'},
      {id: 43, text: ['SMS文字簡訊', '電子邀請函發送'], link: '#', introImg: 6, iconClass: 'mbr-icon-extra-css mbr-iconfont mbri-paper-plane'},
      {id: 44, text: ['傳統喜帖', 'QRC貼紙索取'], link: '#', introImg: 7, iconClass: 'faQrcode'},
    ]
  },
  { gid: 5, 
    id: 50,
    title: '婚禮招待準備',
    icons: [
      {id: 51, text: ['下載婚禮', '招待APP'], link: '#', introImg: 51, iconClass: 'mbr-icon-extra-css mbr-iconfont mbri-touch'},
      {id: 52, text: ['婚禮招待', 'APP登入碼'], link: '#', introImg: 52, iconClass: 'mbr-icon-extra-css mbr-iconfont mbri-edit'},
    ]
  },
  { gid: 6, 
    id: 60,
    title: '數據統計即時分析',
    icons: [
      {id: 61, text: '賓客資料分析圖', link: '#', introImg: 8, iconClass: 'faQrcode'},
      {id: 62, text: '賓客報到分析圖', link: '#', introImg: 9, iconClass: 'faQrcode'},
    ]
  },
  { gid: 7, 
    id: 70,
    title: '賓客賀詞',
    icons: [
      {id: 71, text: '賓客賀詞', link: '#', introImg: 16, iconClass: 'mbr-icon-extra-css mbr-iconfont icon54-v1-excel'},
    ]
  }
];
