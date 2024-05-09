import db from '../connect.js';

export const postCard = (req, res) => {
  const { item, user, quantity } = req.body;

  const insertQuery = 'INSERT INTO card (item, user, quantity) VALUES (?, ?, ?)';
  const values = [item, user, quantity];

  db.query(insertQuery, values, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } else {
      return res.status(200).json({ message: 'Card created successfully', card: req.body });
    }
  });
};


export const getCards = (req, res) => {
    const { user } = req.params;
  
    const selectQuery = `
    SELECT card.*, item.*
    FROM card
    JOIN item ON card.item = item.itemid
    WHERE card.user = ?
`    
  
    db.query(selectQuery, [user], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.status(200).json({ items: results });
      }
    });
  };
  
  export const updateCardQuantity = (req, res) => {
    const { idcard } = req.params;
    const { quantity } = req.body;
  
    const updateQuery = 'UPDATE card SET quantity = ? WHERE idcard = ?';
    const values = [quantity, idcard];
  
    db.query(updateQuery, values, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.status(200).json({ message: 'Card quantity updated successfully' });
      }
    });
  };
  
  
export const deleteCard = (req, res) => {
  const { idcard } = req.params;

  const deleteQuery = 'DELETE FROM card WHERE idcard = ?';

  db.query(deleteQuery, [idcard], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } else {
      return res.status(200).json({ message: 'Card deleted successfully' });
    }
  });
};


