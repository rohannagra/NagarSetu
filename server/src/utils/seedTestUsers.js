import bcrypt from 'bcryptjs';
import fileStorage from './fileStorage.js';

// Test user credentials - Simple password: password123
const testUsers = [
  {
    name: 'Test Citizen',
    email: 'citizen@test.com',
    password: 'password123',
    phone: '1234567890',
    role: 'citizen',
    address: {
      street: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
      district: 'Test District'
    },
    isEmailVerified: true,
    isActive: true
  },
  {
    name: 'Test Officer',
    email: 'officer@test.com',
    password: 'password123',
    phone: '0987654321',
    role: 'officer',
    address: {
      street: '456 Officer Road',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
      district: 'Test District'
    },
    isEmailVerified: true,
    isActive: true
  },
  {
    name: 'Test Admin',
    email: 'admin@test.com',
    password: 'password123',
    phone: '5555555555',
    role: 'super_admin',
    address: {
      street: '789 Admin Avenue',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
      district: 'Test District'
    },
    isEmailVerified: true,
    isActive: true
  }
];

export const seedTestUsers = async () => {
  try {
    console.log('🌱 Seeding test users...');

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = fileStorage.findOne('users', { email: userData.email });
      
      if (existingUser) {
        console.log(`✓ User ${userData.email} already exists`);
        continue;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create user
      const user = fileStorage.create('users', {
        ...userData,
        password: hashedPassword
      });

      console.log(`✓ Created test user: ${userData.email} (${userData.role})`);
    }

    console.log('✅ Test users seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('   Citizen: citizen@test.com / password123');
    console.log('   Officer: officer@test.com / password123');
    console.log('   Admin:   admin@test.com / password123\n');

  } catch (error) {
    console.error('❌ Error seeding test users:', error);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedTestUsers().then(() => process.exit(0));
}

export default seedTestUsers;
