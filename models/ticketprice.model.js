const db = require("../common/db");

const TicketPriceRules = ( ticketprice) => {
  this.rule_id = ticketprice.rule_id;
  this.seat_type = ticketprice.seat_type;
  this.day_type = ticketprice.day_type;
  this.price = ticketprice.price;
  this.created_at = ticketprice.created_at;
};

// Danh sách ngày lễ lớn được nghỉ (cập nhật theo năm 2025)
const holidays = [
  { date: '2025-01-01', dayType: 'holiday' }, 
  { date: '2025-04-30', dayType: 'holiday' }, 
  { date: '2025-05-01', dayType: 'holiday' }, 
  { date: '2025-09-02', dayType: 'holiday' }, 
];

TicketPriceRules.getPriceBySeatAndScreening = (seat_type, screening_id, callback) => {
  const sqlScreening = "SELECT screening_date FROM screenings WHERE screening_id = ?";
  db.query(sqlScreening, [screening_id], (err, screeningResult) => {
    if (err || screeningResult.length === 0) {
      return callback(err || new Error('Không tìm thấy lịch chiếu'));
    }

    const screeningDate = screeningResult[0].screening_date;
    let dayType;

    // Xác định day_type
    const dayOfWeek = new Date(screeningResult[0].screening_date).getDay();
    const isHoliday = holidays.some(holiday => holiday.date === screeningDate);
    if (isHoliday) {
      dayType = 'holiday';
    } else if (dayOfWeek === 0 || dayOfWeek === 6) { 
      dayType = 'weekend';
    } else {
      dayType = 'weekday';
    }

    const sqlPrice = "SELECT price FROM TicketPriceRules WHERE seat_type = ? AND day_type = ?";
    db.query(sqlPrice, [seat_type, dayType], (err, priceResult) => {
      if (err || priceResult.length === 0) {
        return callback(err || new Error('Không tìm thấy quy tắc giá'));
      }
      callback(null, { seat_type, day_type: dayType, price: parseFloat(priceResult[0].price) });
    });
  });
}; 

TicketPriceRules.getById = (id, callback) => {
  const sqlString = "SELECT * FROM TicketPriceRules WHERE rule_id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

TicketPriceRules.getAll = (callback) => {
  const sqlString = "SELECT * FROM TicketPriceRules ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

TicketPriceRules.insert = (ticketprice, callBack) => {
  const sqlString = "INSERT INTO TicketPriceRules SET ?";
  db.query(sqlString, ticketprice, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...ticketprice });
  });
};

TicketPriceRules.update = (ticketprice, id, callBack) => {
  const sqlString = "UPDATE TicketPriceRules SET ? WHERE rule_id = ?";
  db.query(sqlString, [ticketprice, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật giá vé có id = " + id + " thành công");
  });
};

TicketPriceRules.delete = (id, callBack) => {
  db.query(`DELETE FROM TicketPriceRules WHERE price_id = ?`, id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa giá vé id = " + id + " thành công");
  });
};

module.exports = TicketPriceRules;