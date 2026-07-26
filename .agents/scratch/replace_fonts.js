const fs = require('fs');
const path = require('path');

const files = [
  'app/(main)/profile/page.tsx',
  'components/settings/PersonalInfoSettings.tsx',
  'components/settings/SecuritySettings.tsx',
  'components/settings/NotificationSettings.tsx',
  'components/settings/PaymentSettings.tsx',
  'components/vip/BonusesDashboard.tsx',
  'components/auth/AuthGate.tsx',
  'components/auth/LoginForm.tsx',
  'components/auth/RegisterForm.tsx',
];

files.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/font-\['Outfit',_sans-serif\]/g, 'font-display');
    content = content.replace(/font-\['Inter',_sans-serif\]/g, 'font-body');
    fs.writeFileSync(fullPath, content);
    console.log('Updated ' + file);
  } else {
    console.log('File not found: ' + file);
  }
});
