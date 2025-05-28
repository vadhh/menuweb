import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../src/lib/mongodb'; // Adjust path if your connectDB is elsewhere
import { Product } from '../src/app/models/Product'; // Adjust path to your Product model
import { Category } from '../src/app/models/Category'; // Adjust path to your Category model

dotenv.config({ path: '.env.local' }); // Ensure your .env.local or .env has MONGODB_URI

const seedData = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected for seeding...');

    // Clear existing data (optional, be careful with this in production)
    console.log('Clearing existing Categories and Products...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Existing data cleared.');

    // --- Create Categories ---
    const categoriesData = [
      { name: 'Appetizers' },
      { name: 'Main Courses' },
      { name: 'Desserts' },
      { name: 'Beverages' },
      { name: 'Salads' },
    ];

    console.log('Seeding Categories...');
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`${createdCategories.length} categories seeded successfully.`);

    // --- Map category names to their IDs for product creation ---
    const categoryMap = createdCategories.reduce((acc, category) => {
      acc[category.name] = category._id;
      return acc;
    }, {} as Record<string, mongoose.Types.ObjectId>);

    // --- Create Products ---
    const productsData = [
      // Appetizers
      {
        name: 'Spring Rolls',
        description: 'Crispy vegetable spring rolls served with sweet chili sauce.',
        price: 8.99,
        imageUrl: 'https://via.placeholder.com/150/FFC107/000000?Text=Spring+Rolls',
        category: categoryMap['Appetizers'],
      },
      {
        name: 'Garlic Bread',
        description: 'Toasted bread with garlic butter and herbs.',
        price: 6.50,
        imageUrl: 'https://via.placeholder.com/150/4CAF50/FFFFFF?Text=Garlic+Bread',
        category: categoryMap['Appetizers'],
      },
      // Main Courses
      {
        name: 'Grilled Salmon',
        description: 'Fresh salmon fillet grilled to perfection, served with asparagus.',
        price: 22.99,
        imageUrl: 'https://via.placeholder.com/150/F44336/FFFFFF?Text=Grilled+Salmon',
        category: categoryMap['Main Courses'],
      },
      {
        name: 'Chicken Alfredo',
        description: 'Creamy Alfredo pasta with grilled chicken breast.',
        price: 18.75,
        imageUrl: 'https://via.placeholder.com/150/2196F3/FFFFFF?Text=Chicken+Alfredo',
        category: categoryMap['Main Courses'],
      },
      {
        name: 'Vegetarian Pizza',
        description: 'A delicious pizza topped with fresh seasonal vegetables.',
        price: 15.00,
        imageUrl: 'https://via.placeholder.com/150/9C27B0/FFFFFF?Text=Veggie+Pizza',
        category: categoryMap['Main Courses'],
      },
      // Desserts
      {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with a gooey molten center.',
        price: 9.50,
        imageUrl: 'https://via.placeholder.com/150/795548/FFFFFF?Text=Lava+Cake',
        category: categoryMap['Desserts'],
      },
      {
        name: 'Cheesecake',
        description: 'Classic New York style cheesecake with a berry compote.',
        price: 7.99,
        imageUrl: 'https://via.placeholder.com/150/FF9800/000000?Text=Cheesecake',
        category: categoryMap['Desserts'],
      },
      // Beverages
      {
        name: 'Fresh Orange Juice',
        description: '100% freshly squeezed orange juice.',
        price: 5.00,
        imageUrl: 'https://via.placeholder.com/150/FF5722/FFFFFF?Text=Orange+Juice',
        category: categoryMap['Beverages'],
      },
      {
        name: 'Iced Coffee',
        description: 'Chilled coffee served with milk and optional sweetener.',
        price: 4.50,
        imageUrl: 'https://via.placeholder.com/150/607D8B/FFFFFF?Text=Iced+Coffee',
        category: categoryMap['Beverages'],
      },
       // Salads
      {
        name: 'Caesar Salad',
        description: 'Crisp romaine lettuce, croutons, Parmesan cheese, and Caesar dressing.',
        price: 12.00,
        imageUrl: 'https://via.placeholder.com/150/8BC34A/000000?Text=Caesar+Salad',
        category: categoryMap['Salads'],
      },
    ];

    console.log('Seeding Products...');
    const createdProducts = await Product.insertMany(productsData);
    console.log(`${createdProducts.length} products seeded successfully.`);

    console.log('\nDatabase seeding completed successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

seedData();