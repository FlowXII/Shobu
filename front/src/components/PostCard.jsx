import React from 'react';
import { Card, CardBody, Avatar, Typography, Button } from "@material-tailwind/react";
import { formatDistanceToNow } from 'date-fns';
import { Heart, Share, Repeat } from 'lucide-react';

const PostCard = ({ post }) => {
  const profilePicture = post.userId?.startgg?.profile?.images?.[0]?.url || 
                        "https://docs.material-tailwind.com/img/face-2.jpg";
  
  const username = post.userId?.username || "Anonymous";

  return (
    <Card className="w-full bg-gray-800/50 text-white border border-blue-500/10 rounded-lg overflow-hidden">
      <CardBody className="divide-y divide-blue-500/10">
        <div className="flex gap-4 pb-4">
          <div className="flex flex-col items-center">
            <Avatar
              size="md"
              variant="circular"
              src={profilePicture}
              alt={username}
              className="border-2 border-blue-500/20"
            />
            <Typography className="text-xs font-medium text-gray-400 mt-1">
              {username || ""}
            </Typography>
          </div>
          <div className="flex-1 space-y-2">
            <Typography className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) || ""}
            </Typography>
            <Typography className="font-normal bg-gray-800 p-4 rounded-xl border border-blue-500/10">
              {post.content || ""}
            </Typography>
          </div>
        </div>
        <div className="flex justify-between pt-4">
          <Button variant="text" className="flex items-center gap-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 transition-colors">
            <Heart className="h-5 w-5" />
            <span className="text-xs">0</span>
          </Button>
          <Button variant="text" className="flex items-center gap-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 transition-colors">
            <Share className="h-5 w-5" />
            <span className="text-xs">0</span>
          </Button>
          <Button variant="text" className="flex items-center gap-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 transition-colors">
            <Repeat className="h-5 w-5" />
            <span className="text-xs">0</span>
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default PostCard;
