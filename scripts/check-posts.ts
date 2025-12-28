
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import connectDB from '../lib/db';
import Post from '../models/Post';

async function checkPosts() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();

    console.log('Fetching all posts...');
    const posts = await Post.find({});
    
    console.log(`Found ${posts.length} posts.`);
    
    posts.forEach((post: any) => {
      console.log(JSON.stringify(post, null, 2));
    });

    process.exit(0);
  } catch (error) {
    console.error('Error checking posts:', error);
    process.exit(1);
  }
}

checkPosts();
