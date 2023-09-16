const generateRandomID  = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const length = 10;
    let id = "";
  
    for (let i = 0; i < length; i++) {
      id += characters[Math.floor(Math.random() * characters.length)];
    }
  
    return id;
  }
module.exports = generateRandomID;