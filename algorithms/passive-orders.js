/*
  -----BEGIN ALGO DEFINITION-----
  {
    "id": "blinktrade",
    "description": "Implements passive orders for entry, stop gain and stop loss",
    "params": [
      {"name":"side", "label":"Buy(1) / Sell(2)", "type":"number", "value":"1", "filter":"positive_number", "validator":"required; validateMin 1; validateMax 2; validateNumber;" },
      {"name":"qty",    "label":"Qty",            "type":"number", "value":"" , "filter":"positive_number", "validator":"required; validateMin 0; validateNumber;" },
      {"name":"min_price", "label":"Minimum Price",   "type":"number", "value":"" , "filter":"positive_number", "validator":"required; validateMin 0; validateNumber;" },
      {"name":"max_price", "label":"Maximum Price",   "type":"number", "value":"" , "filter":"positive_number", "validator":"required; validateMin 0; validateNumber;" }
    ],
    "creator": "blinktrade.SmartOrderAlgo.create",
    "destructor": "blinktrade.SmartOrderAlgo.destroy",
    "permissions": ["notification", "balance", "execution_report", "new_order_limited", "cancel_order"],
    "tickers" : ["UOL:USDBRT","BITFINEX:BTCUSD", "OKCOIN:BTCCNY"]
}
-----END ALGO DEFINITION-----
-----BEGIN ALGO-----
*/

/**
  * Namespace.
  */
const blinktrade = {};

/**
  * @param {Object} application
  * @param {string} symbol
  * @constructor
  */
blinktrade.SmartOrderAlgo = function(application, symbol) {
    this.application_ = application;
    this.symbol_ = symbol;

    this.my_orders_prefix_ = `p${parseInt(1e4 * Math.random(), 10)}_`;
    this.price_increment_ = 0.01;
};

/**
 * @type {Object}
 */
blinktrade.SmartOrderAlgo.prototype.current_order_;


/**
 * @type {number}
 */
blinktrade.SmartOrderAlgo.prototype.target_price_;


/**
  * @param {Application} application
  * @param {string} symbol
  * @return {blinktrade.SmartOrderAlgo}
  */
blinktrade.SmartOrderAlgo.create = function(application, symbol) {
    return new blinktrade.SmartOrderAlgo(application, symbol);
};

/**
  * @param {Object} params
  */
blinktrade.SmartOrderAlgo.prototype.start = function(params) {
    // this.target_qty_ = params['qty'] * 1e8;

    // this.cancellAlgoOrders();
    // this.sendOrders();

    // this.timer_ = setInterval(goog.bind(this.logParams, this), 1000 ); // every 1 second
};

blinktrade.SmartOrderAlgo.prototype.logParams = function() {
    const params = this.application_.getParameters();
    console.log('params', params);
};

blinktrade.SmartOrderAlgo.prototype.stop = function() {
    clearInterval(this.timer_);
    // this.cancellAlgoOrders();
};

/**
  * @param {Object} msg
  */
blinktrade.SmartOrderAlgo.prototype.onTicker = function(msg) {
    console.log('ticker', msg);
};

/**
  * @param {Object.<string,*>} params
  */
// blinktrade.SmartOrderAlgo.prototype.onUpdateParams = function(params) {
//   if (params['qty'] * 1e8 !== this.target_qty_) {
//     this.target_qty_ = params['qty'] * 1e8;
//     this.cancellAlgoOrders();
//   }
//   this.sendOrders();
// };

/**
 *
 * @param {Object.<string,string|number>} msg
 */
blinktrade.SmartOrderAlgo.prototype.onExecutionReport = function(msg) {
    this.target_qty_ = msg.LeavesQty;
};


// blinktrade.SmartOrderAlgo.prototype.cancellAlgoOrders = function() {
//   if (goog.isDefAndNotNull(this.current_order_)) {
//     this.application_.cancelOrder(this.current_order_['ClOrdID']);
//   }
//   this.current_order_ = null;
// };


// blinktrade.SmartOrderAlgo.prototype.sendOrders = function() {
//   var params   = this.application_.getParameters();
//   var max_price = params["max_price"] * 1e8;
//   var min_price = params["min_price"] * 1e8;

//   if (this.target_qty_ < 10000) { // minimum qty
//     return;
//   }

//   var order_book = this.application_.getOrderBook();

//   var best_market_price;
//   var order_at_top_of_the_book;
//   var counter_order_at_top_of_the_book;


//   if (params["side"] == 1) {
//     order_at_top_of_the_book = order_book["bids"][0];
//     counter_order_at_top_of_the_book = order_book["asks"][0];
//   } else {
//     order_at_top_of_the_book = order_book["asks"][0];
//     counter_order_at_top_of_the_book = order_book["bids"][0];
//   }

//   var do_i_have_the_best_order = false;
//   if (goog.isDefAndNotNull(this.current_order_)) {
//     do_i_have_the_best_order =  (this.current_order_['Price'] == order_at_top_of_the_book[0] &&
//                                 this.current_order_['Qty'] == order_at_top_of_the_book[1]);
//   }

//   var price_better_than_the_current_order_price =  order_at_top_of_the_book[0];
//   if (do_i_have_the_best_order) {
//     var book_side = "bids";
//     if (params["side"] == 2) {
//       book_side = "asks";
//     }

//     for (var i =1; i < order_book[book_side].length; ++i ) {
//       if (   (book_side == "bids" && order_book[book_side][i][0] < price_better_than_the_current_order_price)
//           || (book_side == "asks" && order_book[book_side][i][0] > price_better_than_the_current_order_price) ) {
//         price_better_than_the_current_order_price = order_book[book_side][i][0];
//         break;
//       }
//     }
//   }


//   if (params["side"] == 1 ) { // BUY
//     price_better_than_the_current_order_price =
//         price_better_than_the_current_order_price + (this.price_increment_ * 1e8);
//   } else if (params["side"] == 2 ) { // SELL
//     price_better_than_the_current_order_price =
//         price_better_than_the_current_order_price - (this.price_increment_ * 1e8);
//   }

//   // find the target price now
//   if (params["side"] == 1 ) { // BUY
//     if (price_better_than_the_current_order_price <= max_price && price_better_than_the_current_order_price >= min_price ){
//       this.target_price_ = price_better_than_the_current_order_price;
//     } else if (price_better_than_the_current_order_price >= max_price ) {
//       this.target_price_ = max_price;
//     } else {
//       this.target_price_ = min_price;
//     }
//   } else {
//     if (price_better_than_the_current_order_price <= max_price && price_better_than_the_current_order_price >= min_price ){
//       this.target_price_ = price_better_than_the_current_order_price;
//     } else if (price_better_than_the_current_order_price <= min_price ) {
//       this.target_price_ = min_price;
//     } else {
//       this.target_price_ = max_price;
//     }
//   }

//   if (params["side"] == 1 && this.target_price_ >= counter_order_at_top_of_the_book[0] ||
//       params["side"] == 2 && this.target_price_ <= counter_order_at_top_of_the_book[0]) {
//     return;  // we don't want to cause an execution.
//   }


//   var should_send_new_order = false;
//   if (goog.isDefAndNotNull(this.current_order_)) {
//     if ((this.current_order_["Side"] != params["side"] ))  {
//       this.application_.cancelOrder(this.current_order_['ClOrdID']);
//       should_send_new_order = true;
//     }
//     if (this.current_order_["Price"] !== this.target_price_ ) {
//       this.application_.cancelOrder(this.current_order_['ClOrdID']);
//       should_send_new_order = true;
//     }
//   } else {
//     should_send_new_order = true;
//   }

//   if (should_send_new_order) {
//     this.current_order_ = {
//       'Side'      : params["side"],
//       'ClOrdID'   : this.my_orders_prefix_  + parseInt( 1e7 * Math.random() , 10 ),
//       'Qty'       : this.target_qty_,
//       'Price'     : this.target_price_
//     };

//     if (this.current_order_['Side'] == 1 ) {
//       this.application_.sendBuyLimitedOrder(this.current_order_['Qty'],
//                                             this.current_order_['Price'],
//                                             this.current_order_['ClOrdID']);

//     } else {
//       this.application_.sendSellLimitedOrder(this.current_order_['Qty'],
//                                             this.current_order_['Price'],
//                                             this.current_order_['ClOrdID']);
//     }
//   }
// };


// -----END ALGO-----
