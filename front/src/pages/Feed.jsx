import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Textarea,
  Avatar,
} from "@material-tailwind/react";
import {
  Image,
  Video,
  Link,
  Smile,
  MapPin,
  Calendar,
  X,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserData } from '../store/thunks/userThunks';
import PostCard from '../components/PostCard';

const Feed = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/posts/feed?page=${page}`,
        {
          credentials: 'include'
        }
      );
      const data = await response.json();
      
      setPosts(prevPosts => {
        const newPosts = [...prevPosts];
        data.posts.forEach(post => {
          if (!newPosts.find(p => p._id === post._id)) {
            newPosts.push(post);
          }
        });
        return newPosts;
      });
      
      setHasMore(page < data.pagination.total);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Typography className="text-gray-400">Loading...</Typography>
      </div>
    );
  }

  const profilePicture = user?.avatar || 
                        user?.startgg?.profile?.images?.[0]?.url || 
                        "https://docs.material-tailwind.com/img/face-2.jpg";

  const username = user?.username || "Anonymous";

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: message }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const newPost = await response.json();
      setPosts(prev => [newPost, ...prev]);
      setMessage('');
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start p-8 overflow-x-hidden">

      {/* Create Post Card - Refined styling */}
      <Card className="w-full max-w-[48rem] bg-gray-900 text-white border border-blue-500/10 rounded-lg overflow-hidden mb-6">
        <CardBody>
          <form onSubmit={handleSubmit}>
            {/* User Info and Text Input Area */}
            <div className="flex gap-4 mb-4">
              <div className="flex flex-col items-center">
                <Avatar
                  size="md"
                  variant="circular"
                  alt={username}
                  src={profilePicture}
                  className="border-2 border-blue-500/20"
                />
                <Typography className="text-xs font-medium text-gray-400 mt-1">
                  {username}
                </Typography>
              </div>
              <div className="flex-1">
                <Textarea
                  variant="static"
                  placeholder={`What's on your mind ?`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px] border border-none p-4 focus:border-transparent text-white bg-transparent focus:ring-1 focus:ring-blue-500/20 rounded-lg"
                  labelProps={{
                    className: "hidden",
                  }}
                />
              </div>
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : file.type.startsWith('video/') ? (
                        <video
                          src={URL.createObjectURL(file)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Typography className="text-gray-400">
                            {file.name}
                          </Typography>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons - Restored and improved colors */}
            <div className="flex items-center justify-between border-t border-blue-500/10 pt-4">
              <div className="flex items-center gap-2">
                <label className="cursor-pointer p-2 rounded-lg hover:bg-blue-500/10 transition-colors">
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
                  <Image className="h-5 w-5 text-blue-500" />
                </label>

                <label className="cursor-pointer p-2 rounded-lg hover:bg-blue-500/10 transition-colors">
                  <input type="file" accept="video/*" multiple className="hidden" onChange={handleFileSelect} />
                  <Video className="h-5 w-5 text-blue-500" />
                </label>

                <button type="button" className="p-2 rounded-lg hover:bg-blue-500/10 transition-colors">
                  <Link className="h-5 w-5 text-blue-500" />
                </button>

                <button type="button" className="p-2 rounded-lg hover:bg-blue-500/10 transition-colors">
                  <Smile className="h-5 w-5 text-blue-500" />
                </button>

                <button type="button" className="p-2 rounded-lg hover:bg-blue-500/10 transition-colors">
                  <MapPin className="h-5 w-5 text-blue-500" />
                </button>

                <button type="button" className="p-2 rounded-lg hover:bg-blue-500/10 transition-colors">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </button>
              </div>

              {/* Post Button */}
              <Button
                type="submit"
                disabled={!message.trim() && selectedFiles.length === 0}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed px-6"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Feed Content - Refined container */}
      <div className="w-full max-w-[48rem] space-y-4 bg-gray-900 border border-blue-500/10 rounded-lg p-4">
        {isLoading ? (
          <Typography className="text-center text-gray-400">Loading posts...</Typography>
        ) : posts.length > 0 ? (
          <>
            {posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
            {hasMore && (
              <Button
                onClick={() => setPage(prev => prev + 1)}
                className="w-full bg-gray-800 hover:bg-gray-700 border border-blue-500/10"
              >
                Load More
              </Button>
            )}
          </>
        ) : (
          <Typography className="text-center text-gray-400">No posts yet</Typography>
        )}
      </div>
    </div>
  );
};

export default Feed;
