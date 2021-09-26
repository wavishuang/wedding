const initialState = {
  images: [
    {
      ID: 1,
      Image: "7b8f7957-c32e-c206-fee5-c43501f5cc4b.png",
      Lang: null,
      Type: 9,
      _SRT_CREATE_TIMESTAMP: "2020-11-01T02:12:35.43",
      _SRT_CREATOR_EMPLOYEE_ID: 1,
      _SRT_EDIT_TIMESTAMP: "2020-11-02T02:51:53.617",
      _SRT_FROMSTATUS: 1,
      _SRT_LAST_EDITOR_EMPLOYEE_ID: 1,
      _SRT_NOTE: null,
      _SRT_ORDER_IN_PARENT: null,
      _SRT_SN: "2020111.430-6441325",
    }
  ]
};

const introImages = (state = initialState, action) => {
  switch(action.type) {
    default:
      return state;
  }
}

export default introImages;