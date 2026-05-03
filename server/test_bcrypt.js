const bcrypt = require('bcryptjs');
const test = async () => {
  const pass = 'admin123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pass, salt);
  const match = await bcrypt.compare(pass, hash);
  console.log('Match:', match);
};
test();
