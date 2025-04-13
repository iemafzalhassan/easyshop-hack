import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server'; // Add this import
// Fix the MongoDB connection import path
import dbConnect from '@/lib/mongodb';  // Use proper alias path
import Product from '@/lib/models/product';

export const dynamic = 'force-dynamic';

// Add request parameter to the GET function
// Add category mapping at the top of the file
const categoryMap: { [key: string]: string } = {
  electronics: 'electronics',
  clothing: 'fashion',
  books: 'literature',
  furniture: 'home-living',
  all: 'all'
};

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const requestedCategory = searchParams.get('category') || 'electronics';
    const category = categoryMap[requestedCategory] || requestedCategory; // Now resolves correctly
    console.log('Requested category:', requestedCategory, '-> Mapped to:', category);
    
    // Build query based on category
    const query: any = {};
    if (category !== 'all') {
      query.shop_category = category;
    }
    console.log('Query:', JSON.stringify(query));
    
    // First, check if we have any products matching the category
    const count = await Product.countDocuments(query);
    console.log('Matching products count:', count);

    // Get featured products - best sellers based on rating and sales
    const products = await Product.aggregate([
      { $match: query },
      {
        $addFields: {
          score: {
            $multiply: [
              { $ifNull: ['$rating', 0] },  // Rating score
              { $add: [{ $ifNull: ['$sales', 0] }, 1] }  // Sales score (add 1 to avoid multiplication by 0)
            ]
          }
        }
      },
      { $sort: { score: -1 } },
      { $limit: 8 }
    ]);
    
    console.log('Found featured products:', products.length);
    
    // Return empty array instead of null if no products
    // Ensure consistent response format
    return NextResponse.json({
      success: true,
      data: products || []
    });
    
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json({
      success: false,
      data: [],
      error: "Failed to load featured products"
    }, { status: 500 });
  }
}
