import db from '../connect.js';
import path from 'path';

export const postItem = (req, res) => {
  try {
    const { itemname, price, category, size, sale, dec } = req.body;
    const { img1, img2, img3, img4, img5 } = req.files;

    if (!img1 || !img2 || !img3 || !img4 || !img5) {
      return res.status(400).json({ error: 'Missing one or more image files' });
    }

    const img1Path = path.join( 'uploads', img1.name);
    const img2Path = path.join( 'uploads', img2.name);
    const img3Path = path.join( 'uploads', img3.name);
    const img4Path = path.join( 'uploads', img4.name);
    const img5Path = path.join( 'uploads', img5.name);

    img1.mv(img1Path, (err) => {
      if (err) {
        console.error('Error saving image1:', err);
        return res.status(500).json({ error: 'Failed to save image1', details: err.message });
      }
      img2.mv(img2Path, (err) => {
        if (err) {
          console.error('Error saving image2:', err);
          return res.status(500).json({ error: 'Failed to save image2', details: err.message });
        }
        img3.mv(img3Path, (err) => {
          if (err) {
            console.error('Error saving image3:', err);
            return res.status(500).json({ error: 'Failed to save image3', details: err.message });
          }
          img4.mv(img4Path, (err) => {
            if (err) {
              console.error('Error saving image4:', err);
              return res.status(500).json({ error: 'Failed to save image4', details: err.message });
            }
            img5.mv(img5Path, (err) => {
              if (err) {
                console.error('Error saving image5:', err);
                return res.status(500).json({ error: 'Failed to save image5', details: err.message });
              }

              const insertQuery = 'INSERT INTO item (img1, img2, img3, img4, img5, itemname, price, category, size, sale, dec) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
              const values = [img1Path, img2Path, img3Path, img4Path, img5Path, itemname, price, category, size, sale, dec];

              db.query(insertQuery, values, (err) => {
                if (err) {
                  console.error('Error creating item:', err);
                  return res.status(500).json({ error: 'Failed to create item', details: err.message });
                }
                return res.status(200).json({ message: 'Item created successfully', item: req.body });
              });
            });
          });
        });
      });
    });
  } catch (err) {
    console.error('Error creating item:', err);
    return res.status(500).json({ error: 'Failed to create item', details: err.message });
  }
};


export const getItemById = (req, res) => {
  const { itemid } = req.params;

  const selectQuery = 'SELECT * FROM item WHERE itemid = ?';

  db.query(selectQuery, [itemid], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } else {
      return res.status(200).json({ item: result });
    }
  });
};

export const getItems = (req, res) => {
  const selectQuery = 'SELECT * FROM item';

  db.query(selectQuery, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } else {
      return res.status(200).json({ items: results });
    }
  });
};

export const deleteItem = (req, res) => {
  const { itemid } = req.params;

  const deleteQuery = 'DELETE FROM item WHERE itemid = ?';

  db.query(deleteQuery, [itemid], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } else {
      return res.status(200).json({ message: 'Item deleted successfully' });
    }
  });
};


export const updateItem = (req, res) => {
  const { itemid } = req.params;
  const { itemname, price, category, size, sale, dec } = req.body;
  const { img1, img2, img3, img4, img5 } = req.files;

  try {
    let updateQuery = 'UPDATE item SET itemname=?, price=?, category=?, size=?, sale=?';
    let values = [itemname, price, category, size, sale];

    // Check if 'dec' field is provided in the request body
    if (dec !== undefined) {
      updateQuery += ', `dec`=?'; // Use backticks to escape reserved keyword 'dec'
      values.push(dec); // Add 'dec' value to the values array
    }

    // Check if image files are provided and update image paths in the database
    const updateImages = (img, imgPath, callback) => {
      if (img) {
        const imagePath = path.join( 'uploads', img.name);
        img.mv(imagePath, (err) => {
          if (err) {
            console.error(`Error saving ${img.name}:`, err);
            return res.status(500).json({ error: `Failed to save ${img.name}`, details: err.message });
          }
          callback(imagePath);
        });
      } else {
        callback(null);
      }
    };

    // Update each image path
    updateImages(img1, 'img1', (img1Path) => {
      updateImages(img2, 'img2', (img2Path) => {
        updateImages(img3, 'img3', (img3Path) => {
          updateImages(img4, 'img4', (img4Path) => {
            updateImages(img5, 'img5', (img5Path) => {
              const imgValues = [img1Path, img2Path, img3Path, img4Path, img5Path];
              updateQuery += ', img1=?, img2=?, img3=?, img4=?, img5=?';
              values.push(...imgValues);

              updateQuery += ' WHERE itemid=?';
              values.push(itemid); // Add 'itemid' value to the values array

              db.query(updateQuery, values, (err, result) => {
                if (err) {
                  console.error('Error updating item:', err);
                  console.log('Error updating item:', err);
                  return res.status(500).json({ error: 'Failed to update item', details: err.message });
                } else {
                  return res.status(200).json({ message: 'Item updated successfully' });
                }
              });
            });
          });
        });
      });
    });
  } catch (err) {
    console.error('Error updating item:', err);
    return res.status(500).json({ error: 'Failed to update item', details: err.message });
  }
};

