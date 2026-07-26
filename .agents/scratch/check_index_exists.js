const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\kazam\\Desktop\\App\\movie-booking-site\\movie-site\\AI_Index.md';
if (fs.existsSync(filePath)) {
  console.log('AI_Index.md exists!');
  console.log(fs.readFileSync(filePath, 'utf8'));
} else {
  console.log('AI_Index.md does not exist at:', filePath);
  // Let's check files in that folder
  const files = fs.readdirSync(path.dirname(filePath));
  console.log('Files in folder:', files);
}
