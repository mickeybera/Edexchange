import { auth } from '@clerk/nextjs/server';
import dbConnect from './db';
import { User } from '@/models';

export async function getCurrentUser() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return null;
    }
  
  await dbConnect();
  
  const user = await User.findOne({ clerkId: userId });
  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

export function createPaginationResponse(data: any[], page: number, limit: number, total: number) {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}

export function buildSearchQuery(params: Record<string, any>) {
  const query: any = {};
  
  // Handle text search
  if (params.search) {
    query.$or = [
      { title: { $regex: params.search, $options: 'i' } },
      { description: { $regex: params.search, $options: 'i' } },
    ];
  }
  
  // Handle exact matches
  ['category', 'status', 'authorId', 'sellerId'].forEach(field => {
    if (params[field]) {
      query[field] = params[field];
    }
  });
  
  // Handle range queries
  if (params.minPrice || params.maxPrice) {
    query.price = {};
    if (params.minPrice) query.price.$gte = parseFloat(params.minPrice);
    if (params.maxPrice) query.price.$lte = parseFloat(params.maxPrice);
  }
  
  // Handle date ranges
  if (params.startDate || params.endDate) {
    query.startDate = {};
    if (params.startDate) query.startDate.$gte = new Date(params.startDate);
    if (params.endDate) query.startDate.$lte = new Date(params.endDate);
  }
  
  // Handle location search
  if (params.location) {
    query.location = { $regex: params.location, $options: 'i' };
  }
  
  return query;
}

export function getPaginationParams(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
}

