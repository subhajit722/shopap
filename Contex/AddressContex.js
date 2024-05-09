import db from '../connect.js';

export const addAddress = (req, res) => {
  const { address, landmark, phonenumber, alphonenumber, iduser, usname, zipcode } = req.body; // Added 'usname' and 'zipcode' from req.body
  console.log(req.body);
  const insertQuery = 'INSERT INTO address (address, landmark, phonenumber, alphonenumber, iduser, usname, zipcode) VALUES (?, ?, ?, ?, ?, ?, ?)'; // Added 'usname' and 'zipcode' in the INSERT query
  const values = [address, landmark, phonenumber, alphonenumber, iduser, usname, zipcode];

  db.query(insertQuery, values, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } else {
      return res.status(200).json({ message: 'address created successfully', address: req.body });
    }
  });
};


export const getAddress = (req, res) => {
  const { iduser } = req.params;
  console.log(iduser)
  const selectQuery = 'SELECT * FROM address WHERE iduser = ?';

  db.query(selectQuery, [iduser], (err, results) => {
    if (err) {
      console.error('Error retrieving addresses:', err); // Log the error for debugging
      return res.status(500).json({ error: err.message });
    } else {
      console.log('Addresses retrieved successfully:', results); // Log the results for debugging
      return res.status(200).json({ addresses: results });
    }
  });
};  



  export const updateAddress = (req, res) => {
    const { addressid } = req.params;
    const { address, landmark, phonenumber, alphonenumber, iduser } = req.body;
  
    const updateQuery = 'UPDATE address SET address=?, landmark=?, phonenumber=?, alphonenumber=?, iduser=?,usname=?,zipcode=? WHERE addressid=?';
    const values = [address, landmark, phonenumber, alphonenumber, iduser, usname, zipcode, addressid];
  
    db.query(updateQuery, values, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.status(200).json({ message: 'address updated successfully' });
      }
    });
  };
  
