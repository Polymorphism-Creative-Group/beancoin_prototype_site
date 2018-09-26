var PROJECT = {
   TITLE_MAIN: "亞太智農聯盟",
   TITLE_ENGLISH: "BeanCoin Prototype",
   SUBTITLE: "BeanCoin Prototype",
   get TITLE() {
      return this.TITLE_MAIN + "—" + this.SUBTITLE;
   },
   LOGO_PATH: "./images/ct.png",
   VERSION: "0.53a-beta"
};

var JOIN = {
   URL: 'http://wm.localstudies.tw',
   FONT: "Times New Roman, DFKai-sb",
   TITLE_COLOR: 'Silver'
};

var LUNA = {
   COLUMN: 8, ROW: 4,
   FONT: 'Microsoft JhengHei',
   CARD: {
      BORDER_WIDTH: 10,
      BORDER_STYLE: 'inset',
      BORDER_COLOR: ['Silver', 'White'], //#cecece springgreen //#3333ff'
      COLOR: '#121212' //'DimGrey'//#373737'
   },
   FLIP_TIME_OUT: 5000, //ms
   SYSTEM_LOGO_TIME_OUT: 7000, //ms
   SHOW_INTERVAL: 2500, //ms
   SHOW_STAY: 1500, //ms
   QRCODE: '@QR_CODE_TOKEN',
   get MIN_LOGO() {
      return parseInt((LUNA.ROW * LUNA.COLUMN) / 8);
   },
   TITLE_RATIO: 0.6,
   TITLE_COLOR: 'Silver',
   TOP_HEIGHT_RATIO: 0.08,
   BOTTOM_HEIGHT_RATIO: 0.04,
   MOD: function (row) {
      return (row > 2) ? 1 : ((row === 1) ? 0.70 : 0.95);
   },
   Record_Display: function (str, img, txt) {
      this.query_str = str;
      this.img_path = img;
      this.content = txt;
      this.used = false;
   }
};

var DATA = {
   FILETYPES: ['jpg', 'png', 'JPG', 'PNG'],
   get LIMIT() {
      return parseInt((LUNA.ROW * LUNA.COLUMN) / 2);
   },
   TWDC: {
      URL: "http://data.digitalculture.tw/taichung/oai?verb=ListRecords&metadataPrefix=oai_dc"
   },
   IDEASQL: {
      URL: "http://designav.io/api/image/search/",
      MULTI_URL: "http://designav.io/api/image/search_multi/",
      WB_URL: "http://designav.io/api/image/wordbreak/"
   },
   Result: function (client, query_string) {
      this.client = client;
      this.query_str = query_string;
      this.record_set = [];
   },
   Record_Query: function (url, text) {
      this.img_url = url;
      this.content = text;
   }
};

if (typeof window === 'undefined') {
   module.exports = {PROJECT, LUNA, JOIN, DATA};
}
